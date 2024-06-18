FROM --platform=linux/amd64 node:lts-slim
WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

RUN yarn global add pm2

CMD ["yarn", "start"]
#CMD ["pm2-runtime", "yarn", "--interpreter", "bash", "--name", "frontend", "--", "start"]