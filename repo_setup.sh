#!/bin/bash

# Variables
REPO_URL="https://github.com/noahkupinsky/Living-Mile-High.git"
CLONE_DIR="./LivingMileHigh"
REMOTE_NAME="origin"

# Function to clone the repository
clone_repo() {
    if [ -d "$CLONE_DIR" ]; then
        echo "Directory $CLONE_DIR already exists. Please choose a different directory or delete the existing one."
        exit 1
    fi

    git clone "$REPO_URL" "$CLONE_DIR"
    if [ $? -ne 0 ]; then
        echo "Failed to clone the repository."
        exit 1
    fi
}

# Function to add the remote
add_remote() {
    cd "$CLONE_DIR" || exit

    # Check if the remote already exists
    if git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
        echo "Remote $REMOTE_NAME already exists. Skipping adding remote."
    else
        git remote add "$REMOTE_NAME" "$REPO_URL"
        if [ $? -ne 0 ]; then
            echo "Failed to add the remote."
            exit 1
        fi
        echo "Remote $REMOTE_NAME added successfully."
    fi
}

# Main script execution
clone_repo
add_remote

echo "Repository cloned and remote added successfully."