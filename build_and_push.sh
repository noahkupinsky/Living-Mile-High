#!/bin/bash

# Ensure the script stops on the first error
set -e

# Build the Docker images using the build Docker Compose file
docker-compose -f docker-compose.build.yml build

# Push the Docker images to the container registry
docker-compose -f docker-compose.build.yml push