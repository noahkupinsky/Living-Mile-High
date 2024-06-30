FROM --platform=linux/amd64 node:lts-slim

WORKDIR /app

# Copy the package.json and yarn.lock files for the backend
COPY ./package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files for the backend
COPY . .

RUN yarn build

# Command to run the application
CMD ["yarn", "start"]