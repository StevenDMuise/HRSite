#!/bin/bash

# Update kubeconfig
aws eks update-kubeconfig --name hrsite-cluster --region us-east-1

# Create namespace
kubectl apply -f kubernetes/namespace.yml

# Apply deployments and services
kubectl apply -f kubernetes/frontend.yml
kubectl apply -f kubernetes/backend.yml

# Verify deployments
echo "Waiting for deployments to be ready..."
kubectl rollout status deployment/hrsite-frontend -n hrsite
kubectl rollout status deployment/hrsite-backend -n hrsite

# Get service information
echo "Frontend Service (LoadBalancer) details:"
kubectl get svc hrsite-frontend -n hrsite
