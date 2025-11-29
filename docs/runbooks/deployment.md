# Deployment Runbook

## Prerequisites
- kubectl configured
- Docker registry access
- Environment secrets configured

## Deployment Steps

### 1. Build Docker Image
```bash
docker build -f devops/docker/Dockerfile.prod -t backend:latest .
```

### 2. Push to Registry
```bash
docker push registry.example.com/backend:latest
```

### 3. Deploy to Kubernetes
```bash
kubectl apply -k devops/kubernetes/overlays/production
```

### 4. Verify Deployment
```bash
kubectl rollout status deployment/backend
kubectl get pods -l app=backend
```

## Rollback
```bash
kubectl rollout undo deployment/backend
```
