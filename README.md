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
