#!/bin/bash

# Ensure the script stops on the first error
set -e

DIR_NAME="Living-Mile-High"

# Navigate to the directory containing the docker-compose files
if [[ "$(basename $PWD)" != $DIR_NAME ]]
then
  cd $DIR_NAME
fi

# Stop and remove existing containers
docker-compose -f docker-compose.prod.yml down

# Pull the latest images from the container registry
docker-compose -f docker-compose.prod.yml pull

# Start the containers with the latest images
docker-compose -f docker-compose.prod.yml up -d