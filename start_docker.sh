#!/bin/bash

# Check if Docker daemon is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker daemon is not running. Starting Docker..."
  open --background -a Docker
  echo "Waiting for Docker to start..."
  while ! docker info > /dev/null 2>&1; do
    sleep 1
  done
  echo "Docker started."
else
  echo "Docker daemon is running."
fi

# Run docker-compose
docker-compose -f $1 up --build
