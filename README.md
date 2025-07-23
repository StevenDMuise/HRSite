# HR Service

A simple Node.js service built with TypeScript and Express, designed for Kubernetes deployment.

## Features

- TypeScript for type safety
- Express.js web framework
- Docker containerization
- Kubernetes deployment configurations
- Health check endpoints
- Simple "Hello World" web page

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   npm start
   ```

The service will be available at `http://localhost:3000`

## Docker

### Build the Docker image:
```bash
docker build -t hr-service:latest .
```

### Run the container:
```bash
docker run -p 3000:3000 hr-service:latest
```

## Kubernetes Deployment

### Deploy to Kubernetes:
```bash
kubectl apply -f k8s/
```

### Check deployment status:
```bash
kubectl get pods -l app=hr-service
kubectl get services
```

### Access the service:
If using ingress, add this to your `/etc/hosts`:
```
127.0.0.1 hr-service.local
```

Then access: `http://hr-service.local`

### Clean up:
```bash
kubectl delete -f k8s/
```

## AWS EKS Deployment

### Prerequisites for EKS

- AWS CLI configured with appropriate permissions
- Docker installed and running
- kubectl installed
- eksctl installed

### Deploy to AWS EKS:

1. **Configure AWS credentials:**
   ```bash
   aws configure
   ```

2. **Run the EKS deployment script:**
   ```bash
   ./deploy-eks.sh
   ```

   This script will:
   - Create an ECR repository
   - Build and push your Docker image to ECR
   - Create an EKS cluster (if it doesn't exist)
   - Deploy the application to EKS

3. **Alternative: Use eksctl with cluster config:**
   ```bash
   eksctl create cluster -f eksctl-cluster.yaml
   ```

### Access the service on EKS:

**Option 1: Port forwarding**
```bash
kubectl port-forward service/hr-service 8080:80
```

**Option 2: LoadBalancer (if using service-lb.yaml)**
```bash
kubectl apply -f k8s/service-lb.yaml
kubectl get service hr-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

### EKS Environment Variables:

You can customize the deployment by setting these environment variables:

```bash
export AWS_REGION=us-west-2
export CLUSTER_NAME=hr-service-cluster
export ECR_REPOSITORY=hr-service
export IMAGE_TAG=latest
```

### Clean up EKS resources:
```bash
kubectl delete -f k8s-eks/
eksctl delete cluster --name hr-service-cluster --region us-west-2
```

## API Endpoints

- `GET /` - Main page with "Hello World" message
- `GET /health` - Health check endpoint for Kubernetes probes

## Project Structure

```
├── src/
│   └── index.ts          # Main application file
├── k8s/
│   ├── deployment.yaml   # Kubernetes deployment
│   ├── service.yaml      # Kubernetes service
│   └── ingress.yaml      # Kubernetes ingress
├── Dockerfile            # Docker configuration
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```
