# 🚀 Notes App - Deployment Guide

This repository contains a complete CI/CD pipeline for automatically building and deploying the Notes application to Google Cloud VMs using GitHub Actions.

## 📁 Project Structure

```
notes-app/
├── backend/                          # Node.js backend
├── frontend/                         # React frontend
└── .github/workflows/
    ├── backend-build-push.yml        # Build backend Docker image
    ├── frontend-build-push.yml       # Build frontend Docker image
    ├── deploy-backend.yml            # Deploy backend only
    ├── deploy-frontend.yml           # Deploy frontend only
    ├── build-and-deploy-backend.yml  # Auto build+deploy backend (on push)
    └── build-and-deploy-frontend.yml # Auto build+deploy frontend (on push)
```

## 🔄 How Deployments Work

### **Automatic Deployments (Push to Main)**

| Change | Trigger | Action |
|--------|---------|--------|
| `backend/**` files | Push to main | Builds & deploys backend automatically |
| `frontend/**` files | Push to main | Builds & deploys frontend automatically |
| Both changed | Push to main | Builds & deploys both services in parallel |

### **Manual Deployments**

| Workflow | Purpose |
|----------|---------|
| **Build and Deploy Backend** | Build & deploy backend with custom tag |
| **Build and Deploy Frontend** | Build & deploy frontend with custom tag |
| **Deploy Backend via SSH** | Deploy existing backend image |
| **Deploy Frontend via SSH** | Deploy existing frontend image |

## 🛠️ Initial Setup

### 1. **Set Up SSH Access**

Follow the [SSH Setup Guide](./SSH-SETUP.md) to configure SSH access for deployments.

### 2. **Required GitHub Secrets**

Add these secrets to your repository (**Settings** → **Secrets and variables** → **Actions**):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VM_HOST` | VM external IP address | `34.123.45.67` |
| `VM_SSH_PRIVATE_KEY` | SSH private key for VM access | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VM_SSH_USER` | SSH username | `your-username` |
| `DOCKERHUB_USERNAME` | Docker Hub username | `subzerox9` |
| `DOCKERHUB_TOKEN` | Docker Hub access token | `dckr_pat_abc123...` |

### 3. **VM Requirements**

Your VM must have:
- Docker installed and running
- Firewall rules allowing ports 80 and 5000
- SSH access configured

## 🚀 Usage Examples

### **Automatic Deployment (Recommended)**

Simply push changes to the main branch:

```bash
# Backend changes automatically deploy
git add backend/
git commit -m "Update API endpoint"
git push origin main

# Frontend changes automatically deploy  
git add frontend/
git commit -m "Update UI"
git push origin main
```

### **Manual Deployment with Custom Tags**

1. Go to **Actions** in your GitHub repository
2. Select the appropriate workflow
3. Click **"Run workflow"**
4. Fill in the parameters:

**Example: Deploy backend hotfix**
- Workflow: **"Build and Deploy Backend"**
- VM Host: `34.123.45.67`
- Tag: `hotfix-auth-fix`

**Example: Deploy frontend update**
- Workflow: **"Build and Deploy Frontend"**
- VM Host: `34.123.45.67`
- Tag: `v2.1.0`

**Example: Deploy both services (run both workflows)**
- First run: **"Build and Deploy Backend"** with tag `v2.1.0`
- Then run: **"Build and Deploy Frontend"** with tag `v2.1.0`

### **Deploy Existing Images**

If you have pre-built images and just want to deploy:

1. **Actions** → **"Deploy Backend via SSH"** or **"Deploy Frontend via SSH"**
2. Enter VM host and image tag
3. Click **"Run workflow"**

## 🌐 Accessing Your Application

After successful deployment:

- **Frontend:** `http://YOUR_VM_IP`
- **Backend API:** `http://YOUR_VM_IP:5000`

## 📊 Monitoring Deployments

### **Check Deployment Status**
- Go to **Actions** tab to see workflow runs
- Click on any workflow run to see detailed logs
- Green checkmark = successful deployment
- Red X = failed deployment

### **Check Application Health**
SSH into your VM to check container status:

```bash
ssh your-username@YOUR_VM_IP
docker ps
docker logs notes-backend
docker logs notes-frontend
```

## 🔧 Troubleshooting

### **Deployment Fails with SSH Error**
- Verify SSH key is correctly added to VM
- Check `VM_SSH_PRIVATE_KEY` secret is complete
- Ensure `VM_SSH_USER` matches your VM username

### **Docker Permission Denied**
```bash
ssh your-username@YOUR_VM_IP
sudo usermod -aG docker your-username
# Log out and back in
```

### **Application Not Accessible**
- Check VM firewall allows ports 80 and 5000
- Verify containers are running: `docker ps`
- Check container logs: `docker logs notes-frontend`

### **Build Fails**
- Check Docker Hub credentials in secrets
- Verify Dockerfile paths in workflow files
- Review build logs in Actions tab

## 🏗️ Architecture

```
GitHub Repository
       ↓ (push to main)
GitHub Actions Workflows
       ↓ (build & push)
Docker Hub Registry
       ↓ (pull & deploy)
Google Cloud VM
```

**Workflow Flow:**
1. Code pushed to main branch
2. GitHub Actions builds Docker images
3. Images pushed to Docker Hub
4. SSH into VM and deploy new containers
5. Health checks verify deployment

## 🎯 Best Practices

- **Use semantic versioning** for release tags (`v1.0.0`, `v1.1.0`)
- **Test in staging** before deploying to production
- **Monitor logs** after deployments
- **Keep secrets secure** and rotate them regularly
- **Use descriptive commit messages** for better deployment tracking

## 📈 Scaling

To deploy to multiple environments:
- Create additional VMs
- Update workflows with environment-specific secrets
- Use branch-based deployment strategies

---

🎉 **You now have a complete CI/CD pipeline for your Notes application!**

For issues or questions, check the GitHub Actions logs or review the troubleshooting section above.