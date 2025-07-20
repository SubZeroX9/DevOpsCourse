# 🔑 SSH Setup for GitHub Actions Deployment

Follow these steps to set up SSH access for automated deployments.

## 📋 Step 1: Generate SSH Key Pair

### **For Windows (PowerShell/Command Prompt):**
```bash
# Create .ssh directory if it doesn't exist
mkdir $env:USERPROFILE\.ssh

# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -f $env:USERPROFILE\.ssh\notes-app-deploy -C "github-actions-deploy"
```

### **For Linux/Mac:**
```bash
# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh

# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -f ~/.ssh/notes-app-deploy -C "github-actions-deploy"
```

**When prompted:**
- Enter passphrase: **Press Enter** (leave empty)
- Enter same passphrase again: **Press Enter**

## 📋 Step 2: Display Public Key

### **For Windows:**
```bash
# Display the public key content
Get-Content $env:USERPROFILE\.ssh\notes-app-deploy.pub
```

### **For Linux/Mac:**
```bash
# Display the public key content
cat ~/.ssh/notes-app-deploy.pub
```

**Copy this entire output** (starts with `ssh-rsa` and ends with `github-actions-deploy`).

## 📋 Step 3: Access Your VM and Add Public Key

### **3.1 SSH into Your VM**
Choose one of these methods to access your VM:

#### **Method A: SSH with Password**
```bash
# SSH with password (you'll be prompted for password)
ssh your-username@YOUR_VM_EXTERNAL_IP
```

#### **Method B: Google Cloud CLI**
```bash
# Use gcloud if you have it set up
gcloud compute ssh YOUR_VM_NAME --zone=YOUR_ZONE
```

#### **Method C: Web Browser (Google Cloud Console)**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Compute Engine** → **VM instances**
3. Find your VM in the list
4. Click the **SSH** button next to your VM name
5. A browser-based terminal will open
6. You're now connected to your VM

### **3.2 Set Up SSH Directory on VM**
Once connected to the VM (using any method above), run:

```bash
# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh

# Set correct permissions
chmod 700 ~/.ssh
```

### **3.3 Add Your Public Key to VM**
```bash
# Open the authorized_keys file for editing
nano ~/.ssh/authorized_keys
```

**In the nano editor:**
1. **Paste the public key** from Step 2 on a new line
2. Press `Ctrl + X` to exit
3. Press `Y` to save
4. Press `Enter` to confirm

### **3.4 Set Correct Permissions**
```bash
# Set correct permissions for SSH files
chmod 600 ~/.ssh/authorized_keys

# Verify the setup
ls -la ~/.ssh/
cat ~/.ssh/authorized_keys  # Should show your public key

# Exit the VM
exit
```

## 📋 Step 4: Test SSH Key Access

### **For Windows:**
```bash
# Test SSH connection without password
ssh -i $env:USERPROFILE\.ssh\notes-app-deploy your-username@YOUR_VM_EXTERNAL_IP
```

### **For Linux/Mac:**
```bash
# Test SSH connection without password
ssh -i ~/.ssh/notes-app-deploy your-username@YOUR_VM_EXTERNAL_IP
```

**You should connect without entering a password!**

**Test Docker access:**
```bash
docker --version
docker ps

# Exit the VM
exit
```

## 📋 Step 5: Get VM External IP

Get your VM's external IP address:

```bash
# List VMs with external IPs
gcloud compute instances list --format="table(name,zone,EXTERNAL_IP)"
```

Copy the **EXTERNAL_IP** (e.g., `34.123.45.67`).

## 📋 Step 6: Get Private Key Content

### **For Windows:**
```bash
# Display private key content
Get-Content $env:USERPROFILE\.ssh\notes-app-deploy
```

### **For Linux/Mac:**
```bash
# Display private key content
cat ~/.ssh/notes-app-deploy
```

**Copy the ENTIRE output** including the BEGIN and END lines:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...all the encoded content...
-----END OPENSSH PRIVATE KEY-----
```

## 📋 Step 7: Get Docker Hub Access Token

1. Go to [Docker Hub](https://hub.docker.com) and sign in
2. Click your username → **Account Settings**
3. Go to **Security** → **Access Tokens**
4. Click **New Access Token**
5. Name: `GitHub Actions Deployment`
6. Permissions: **Read, Write, Delete**
7. Click **Generate**
8. **Copy the token** (starts with `dckr_pat_`)

## 📋 Step 8: Add GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these **5 secrets**:

| Secret Name | Value |
|-------------|-------|
| `VM_HOST` | Your VM's external IP (e.g., `34.123.45.67`) |
| `VM_SSH_PRIVATE_KEY` | Complete private key from Step 6 |
| `VM_SSH_USER` | `your-username` |
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Token from Step 7 |

## 📋 Step 9: Test Deployment

1. Go to **Actions** in your GitHub repository
2. Click **"Deploy Backend via SSH"**
3. Click **"Run workflow"**
4. Enter your VM's external IP and click **"Run workflow"**

**Expected result:** Successful deployment with "SSH connection successful" message.

## 🔧 Troubleshooting

### **SSH connection fails:**

**For Windows:**
```bash
# Test with verbose output
ssh -i $env:USERPROFILE\.ssh\notes-app-deploy -v your-username@YOUR_VM_IP
```

**For Linux/Mac:**
```bash
# Check key permissions
chmod 600 ~/.ssh/notes-app-deploy

# Test with verbose output
ssh -i ~/.ssh/notes-app-deploy -v your-username@YOUR_VM_IP
```

### **Docker permission denied:**
```bash
# SSH into VM and add user to docker group
ssh your-username@YOUR_VM_IP
sudo usermod -aG docker your-username
# Log out and back in for changes to take effect
```

### **Can't find VM external IP:**
```bash
# Alternative way to get IP
gcloud compute instances describe YOUR_VM_NAME --zone=YOUR_ZONE --format="get(networkInterfaces[0].accessConfigs[0].natIP)"
```

### **Can't access VM initially:**
- Use Google Cloud Console SSH (browser-based)
- Use `gcloud compute ssh` command
- Check firewall rules allow SSH (port 22)
- Verify VM is running: `gcloud compute instances list`