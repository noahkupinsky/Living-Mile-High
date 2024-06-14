FROM node:lts-slim

WORKDIR /app

# Copy the package.json and yarn.lock files for the backend
COPY ./package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files for the backend
COPY . .

RUN yarn build

RUN yarn global add pm2

# Expose the necessary port
EXPOSE 3001

# Command to run the application
CMD ["pm2-runtime", "yarn", "--interpreter", "bash", "--name", "backend", "--", "start"]