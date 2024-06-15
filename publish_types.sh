#!/bin/bash

# Save the current directory
ORIG_DIR=$(pwd)

# Change into the living-mile-high-types directory
cd living-mile-high-types

# Increment the version in package.json
npm version patch

# Publish the package
npm publish

# Change back to the original directory
cd "$ORIG_DIR"

# Change into the frontend directory and reinstall the package
cd frontend
yarn add "living-mile-high-types@$(cat ../living-mile-high-types/package.json | jq -r '.version')"

# Change back to the original directory
cd "$ORIG_DIR"

# Change into the backend directory and reinstall the package
cd backend
yarn add "living-mile-high-types@$(cat ../living-mile-high-types/package.json | jq -r '.version')"

# Change back to the original directory
cd "$ORIG_DIR"
