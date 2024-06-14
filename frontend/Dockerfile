FROM node:lts-slim AS deps
WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

RUN yarn global add pm2

EXPOSE 3000

CMD ["pm2-runtime", "yarn", "--interpreter", "bash", "--name", "frontend", "--", "start"]