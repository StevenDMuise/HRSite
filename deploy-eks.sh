#!/bin/bash

# AWS EKS Deployment Script for HR Service

set -e

# Configuration
export AWS_REGION=${AWS_REGION:-us-west-2}
export CLUSTER_NAME=${CLUSTER_NAME:-hr-service-cluster}
export ECR_REPOSITORY=${ECR_REPOSITORY:-hr-service}
export IMAGE_TAG=${IMAGE_TAG:-latest}

echo "🚀 Deploying HR Service to AWS EKS..."
echo "📍 Region: $AWS_REGION"
echo "🏷️  Cluster: $CLUSTER_NAME"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI is configured"

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

echo "🏗️  AWS Account ID: $AWS_ACCOUNT_ID"
echo "📦 ECR URI: $ECR_URI"

# Create ECR repository if it doesn't exist
echo "📦 Creating ECR repository if it doesn't exist..."
aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION &> /dev/null || \
aws ecr create-repository --repository-name $ECR_REPOSITORY --region $AWS_REGION

# Get ECR login token and login to Docker
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI

# Tag and push the image
echo "🏷️  Tagging Docker image..."
docker tag hr-service:latest $ECR_URI:$IMAGE_TAG

echo "📤 Pushing image to ECR..."
docker push $ECR_URI:$IMAGE_TAG

# Create EKS cluster if it doesn't exist
echo "🏗️  Checking if EKS cluster exists..."
if ! eksctl get cluster --name $CLUSTER_NAME --region $AWS_REGION &> /dev/null; then
    echo "🆕 Creating EKS cluster (this may take 10-15 minutes)..."
    eksctl create cluster \
        --name $CLUSTER_NAME \
        --region $AWS_REGION \
        --nodegroup-name hr-service-nodes \
        --node-type t3.medium \
        --nodes 2 \
        --nodes-min 1 \
        --nodes-max 4 \
        --managed
else
    echo "✅ EKS cluster already exists"
fi

# Update kubectl context
echo "🔧 Updating kubectl context..."
aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME

# Create updated Kubernetes manifests with ECR image
echo "📝 Creating EKS-specific Kubernetes manifests..."
mkdir -p k8s-eks

# Create deployment with ECR image
cat > k8s-eks/deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hr-service
  labels:
    app: hr-service
spec:
  replicas: 3
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
        image: $ECR_URI:$IMAGE_TAG
        ports:
        - containerPort: 3000
        env:
        - name: PORT
          value: "3000"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
EOF

# Copy service and ingress
cp k8s/service.yaml k8s-eks/
cp k8s/ingress.yaml k8s-eks/

# Deploy to EKS
echo "🚀 Deploying to EKS..."
kubectl apply -f k8s-eks/

# Wait for deployment
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/hr-service

# Get service information
echo "📊 Deployment Status:"
kubectl get pods -l app=hr-service
kubectl get services
kubectl get ingress

echo ""
echo "🎉 HR Service has been deployed to AWS EKS successfully!"
echo ""
echo "📋 To access the service:"
echo "   Option 1: Port forward to access locally"
echo "   kubectl port-forward service/hr-service 8080:80"
echo "   Then visit: http://localhost:8080"
echo ""
echo "   Option 2: Get LoadBalancer URL (if using LoadBalancer service)"
echo "   kubectl get service hr-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'"
echo ""
echo "🧹 To clean up:"
echo "   kubectl delete -f k8s-eks/"
echo "   eksctl delete cluster --name $CLUSTER_NAME --region $AWS_REGION"
