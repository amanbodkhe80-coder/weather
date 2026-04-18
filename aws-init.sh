#!/bin/bash
# AWS EC2 User-Data Script for Amazon Linux 2023
# This script automatically prepares an EC2 instance to serve your Weather Application.

# 1. Update the system
sudo dnf update -y

# 2. Install Git and Docker
sudo dnf install -y git docker

# 3. Start Docker Service
sudo systemctl start docker
sudo systemctl enable docker

# 4. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 5. Add user to docker group
sudo usermod -aG docker ec2-user

echo "EC2 Environment initialized. Ready to clone and run the app."
