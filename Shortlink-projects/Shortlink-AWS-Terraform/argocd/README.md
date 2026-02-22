# ArgoCD Integration 
## Overview 

ArgoCD Applications for managing Shortlink Platform deployments on AWS EKS. 

## Applications 

### 1. shortlink-platform.yaml 
Main application that deploys all services (Gateway, Admin, Shortlink) to EKS. 

### 2. infrastructure.yaml 
Infrastructure components (Istio Gateway, VirutalService).

## Setup 
### 1. Install ArgoCD 

```bash 
kubectl create namespace argocd 
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### 2. Get ArgoCD Admin Password 

```bash 
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d 
```


### 3. Port Forward ArgoCD UI 

```bash 
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Access: https://localhost:8080 (admin / password from step 2)


### 4. Apply Application 

```bash 
kubectl apply -f argocd/applications/
```

## GitOps Workflow 

1. **Code Push**      -> GitHub Actions builds images 
2. **Image Push**     -> ECR updated 
3. **GitOps Update**  -> CI/CD updates image tags in `gitops/overlays/aws-prod/`
4. **ArgoCD Sync**    -> ArgoCD detects changes and sync to EKS 

## Manual Sync 
```bash 
argocd app sync shortlink-platform 
argocd app sync shortlink-infrastructure 
```
