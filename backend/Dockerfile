FROM node:16

# Install bash and pm2 globally
RUN yarn global add pm2

WORKDIR /app

# Copy the package.json and yarn.lock files for the backend
COPY package*.json .

# Install dependencies
RUN yarn

# Copy the rest of the application files for the backend
COPY . .

# Expose the necessary port
EXPOSE 3001

# Command to run the application
CMD ["pm2-runtime", "yarn", "--interpreter", "bash", "--name", "backend", "--", "dev"]