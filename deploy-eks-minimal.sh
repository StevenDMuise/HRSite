#!/bin/bash

# Quick EKS deployment script for development/testing
# This creates a minimal cluster to keep costs low

set -e

export AWS_REGION=${AWS_REGION:-us-west-2}
export CLUSTER_NAME=${CLUSTER_NAME:-hr-service-dev}
export ECR_REPOSITORY=${ECR_REPOSITORY:-hr-service}

echo "🚀 Creating minimal EKS cluster for development..."

# Check AWS CLI
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Please configure AWS CLI first: aws configure"
    exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

# Create ECR repository
echo "📦 Setting up ECR repository..."
aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION &> /dev/null || \
aws ecr create-repository --repository-name $ECR_REPOSITORY --region $AWS_REGION

# Docker login and push
echo "🔐 Pushing image to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI
docker tag hr-service:latest $ECR_URI:latest
docker push $ECR_URI:latest

# Create minimal EKS cluster
echo "🏗️  Creating minimal EKS cluster..."
eksctl create cluster \
    --name $CLUSTER_NAME \
    --region $AWS_REGION \
    --nodegroup-name workers \
    --node-type t3.small \
    --nodes 1 \
    --nodes-min 1 \
    --nodes-max 2 \
    --managed \
    --version 1.29

# Update kubeconfig
aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME

# Create deployment with ECR image
cat > deployment-eks.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hr-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hr-service
  template:
    metadata:
      labels:
        app: hr-service
    spec:
      containers:
      - name: hr-service
        image: $ECR_URI:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
---
apiVersion: v1
kind: Service
metadata:
  name: hr-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: hr-service
EOF

kubectl apply -f deployment-eks.yaml

echo "⏳ Waiting for deployment..."
kubectl wait --for=condition=available --timeout=300s deployment/hr-service

echo "🎉 Deployment complete!"
echo "📊 Status:"
kubectl get pods,svc

echo ""
echo "🌐 To get the LoadBalancer URL:"
echo "kubectl get service hr-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'"
echo ""
echo "🧹 To clean up:"
echo "eksctl delete cluster --name $CLUSTER_NAME --region $AWS_REGION"
