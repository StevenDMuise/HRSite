#!/bin/bash

# HR Service Kubernetes Deployment Script

echo "🚀 Deploying HR Service to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    exit 1
fi

# Check if Kubernetes cluster is running
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Kubernetes cluster is not running or not accessible"
    echo "💡 Make sure to enable Kubernetes in Docker Desktop:"
    echo "   1. Open Docker Desktop"
    echo "   2. Go to Settings"
    echo "   3. Click on 'Kubernetes' tab"
    echo "   4. Check 'Enable Kubernetes'"
    echo "   5. Click 'Apply & Restart'"
    exit 1
fi

echo "✅ Kubernetes cluster is accessible"

# Deploy the application
echo "📦 Deploying HR Service..."
kubectl apply -f k8s/

# Check deployment status
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/hr-service

# Show deployment status
echo "📊 Deployment Status:"
kubectl get pods -l app=hr-service
kubectl get services

echo "🎉 HR Service has been deployed successfully!"
echo ""
echo "📋 To access the service:"
echo "   Option 1: Port forward to access locally"
echo "   kubectl port-forward service/hr-service 8080:80"
echo "   Then visit: http://localhost:8080"
echo ""
echo "   Option 2: If using ingress, add to /etc/hosts:"
echo "   127.0.0.1 hr-service.local"
echo "   Then visit: http://hr-service.local"
echo ""
echo "🧹 To clean up the deployment:"
echo "   kubectl delete -f k8s/"
