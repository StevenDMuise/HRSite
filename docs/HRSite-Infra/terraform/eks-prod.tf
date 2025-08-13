# EKS Cluster Role for Production
resource "aws_iam_role" "eks_cluster_prod" {
  name = "hrsite-prod-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy_prod" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_prod.name
}

# EKS Node Group Role for Production
resource "aws_iam_role" "eks_nodes_prod" {
  name = "hrsite-prod-eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_worker_node_policy_prod" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_nodes_prod.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy_prod" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_nodes_prod.name
}

resource "aws_iam_role_policy_attachment" "eks_container_registry_prod" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_nodes_prod.name
}

# Production EKS Cluster
resource "aws_eks_cluster" "prod" {
  name     = "hrsite-cluster-prod"
  role_arn = aws_iam_role.eks_cluster_prod.arn
  version  = "1.28"

  vpc_config {
    subnet_ids              = concat(aws_subnet.prod_private_subnets[*].id, aws_subnet.prod_public_subnets[*].id)
    endpoint_public_access  = true
    endpoint_private_access = true
    security_group_ids      = [aws_security_group.eks_cluster_prod.id]
  }

  encryption_config {
    provider {
      key_arn = aws_kms_key.eks_prod.arn
    }
    resources = ["secrets"]
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy_prod,
    aws_cloudwatch_log_group.eks_prod
  ]

  tags = {
    Environment = "production"
    Name        = "hrsite-cluster-prod"
  }
}

# Production EKS Node Groups
resource "aws_eks_node_group" "prod" {
  cluster_name    = aws_eks_cluster.prod.name
  node_group_name = "hrsite-prod-node-group"
  node_role_arn   = aws_iam_role.eks_nodes_prod.arn
  subnet_ids      = aws_subnet.prod_private_subnets[*].id

  scaling_config {
    desired_size = 3
    max_size     = 5
    min_size     = 2
  }

  update_config {
    max_unavailable = 1
  }

  instance_types = ["t3.medium"]

  # Enable EBS optimization
  disk_size = 50

  labels = {
    Environment = "production"
  }

  tags = {
    Environment = "production"
    Name        = "hrsite-prod-node-group"
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy_prod,
    aws_iam_role_policy_attachment.eks_cni_policy_prod,
    aws_iam_role_policy_attachment.eks_container_registry_prod,
  ]
}

# EKS Cluster Security Group for Production
resource "aws_security_group" "eks_cluster_prod" {
  name_prefix = "hrsite-prod-eks-cluster-"
  vpc_id      = aws_vpc.prod_vpc.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "hrsite-prod-eks-cluster-sg"
    Environment = "production"
  }
}

# KMS Key for EKS Secret Encryption
resource "aws_kms_key" "eks_prod" {
  description             = "KMS key for EKS Production Cluster Secret Encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = {
    Name        = "hrsite-prod-eks-key"
    Environment = "production"
  }
}

resource "aws_kms_alias" "eks_prod" {
  name          = "alias/hrsite-prod-eks"
  target_key_id = aws_kms_key.eks_prod.key_id
}

# CloudWatch Log Group for EKS Logs
resource "aws_cloudwatch_log_group" "eks_prod" {
  name              = "/aws/eks/hrsite-cluster-prod/cluster"
  retention_in_days = 30

  tags = {
    Name        = "hrsite-prod-eks-logs"
    Environment = "production"
  }
}

# Outputs
output "eks_cluster_prod_endpoint" {
  value = aws_eks_cluster.prod.endpoint
}

output "eks_cluster_prod_ca_certificate" {
  value = aws_eks_cluster.prod.certificate_authority[0].data
}

output "eks_cluster_prod_name" {
  value = aws_eks_cluster.prod.name
}

output "eks_cluster_prod_security_group_id" {
  value = aws_security_group.eks_cluster_prod.id
}
