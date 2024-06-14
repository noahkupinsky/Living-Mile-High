#!/bin/bash

# Variables
REPO_DIR="$HOME/Living-Mile-High"
COMPOSE_FILE="docker-compose.prod.yml"

# Pull the latest changes
cd $REPO_DIR
git pull origin main

# Stop and remove any existing containers
docker-compose -f $COMPOSE_FILE down

# Start new containers
docker-compose -f $COMPOSE_FILE up -d --build

echo "Deployment completed."