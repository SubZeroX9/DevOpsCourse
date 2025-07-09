# Notes App Deployment Guide

Deploy the Notes application on a VM using pre-built Docker images.

## Prerequisites

- VM with Docker installed
- Open ports 80 and 5000 (or configure firewall)
- Internet access to pull images

## Quick Start

### 1. Install Docker (if not already installed)

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in, or run: newgrp docker
```

### 2. Create deployment directory

```bash
mkdir notes-app-deployment
cd notes-app-deployment
```

### 3. Deploy with Docker CLI commands

```bash
# Create a network for the containers to communicate
docker network create notes-network

# Create a volume for persistent data
docker volume create notes-data

# Start backend container
docker run -d \
  --name notes-backend \
  --network notes-network \
  -p 5000:5000 \
  -v notes-data:/app \
  --restart unless-stopped \
  subzerox9/notes-app-backend:latest

# Start frontend container
docker run -d \
  --name notes-frontend \
  --network notes-network \
  -p 80:80 \
  --restart unless-stopped \
  subzerox9/notes-app-frontend:latest

# Check if containers are running
docker ps
docker logs notes-backend
docker logs notes-frontend
```

**Note:** These images are publicly available on Docker Hub.

## Exposing to Outside World

Your app is accessible on:
- **Frontend:** `http://your-vm-ip:80`
- **Backend API:** `http://your-vm-ip:5000`

Make sure your VM firewall allows these ports