# Cluster Autoscaler IAM Role and Policy
resource "aws_iam_role" "cluster_autoscaler_prod" {
  name = "hrsite-prod-cluster-autoscaler"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.eks_prod.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${replace(aws_iam_openid_connect_provider.eks_prod.url, "https://", "")}:sub" = "system:serviceaccount:kube-system:cluster-autoscaler"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "cluster_autoscaler_prod" {
  name = "hrsite-prod-cluster-autoscaler"
  role = aws_iam_role.cluster_autoscaler_prod.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "autoscaling:DescribeAutoScalingGroups",
          "autoscaling:DescribeAutoScalingInstances",
          "autoscaling:DescribeLaunchConfigurations",
          "autoscaling:DescribeTags",
          "autoscaling:SetDesiredCapacity",
          "autoscaling:TerminateInstanceInAutoScalingGroup",
          "ec2:DescribeLaunchTemplateVersions"
        ]
        Resource = ["*"]
      }
    ]
  })
}

# EKS OIDC Provider
data "tls_certificate" "eks_prod" {
  url = aws_eks_cluster.prod.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "eks_prod" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.eks_prod.certificates[0].sha1_fingerprint]
  url             = aws_eks_cluster.prod.identity[0].oidc[0].issuer
}

output "cluster_autoscaler_role_arn" {
  value = aws_iam_role.cluster_autoscaler_prod.arn
}
