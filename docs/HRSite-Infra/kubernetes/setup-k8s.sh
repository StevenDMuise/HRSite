#!/bin/bash

# Update kubeconfig
aws eks update-kubeconfig --name hrsite-cluster-dev --region us-east-1

# Create namespace
kubectl apply -f namespace.yml

# Apply deployments and services
kubectl apply -f frontend.yml
kubectl apply -f backend.yml

# Verify deployments
echo "Waiting for deployments to be ready..."
kubectl rollout status deployment/hrsite-frontend -n hrsite
kubectl rollout status deployment/hrsite-backend -n hrsite

# Get service information
echo "Frontend Service (LoadBalancer) details:"
kubectl get svc hrsite-frontend -n hrsite
