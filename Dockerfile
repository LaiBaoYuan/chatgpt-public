FROM node:16.20-alpine

WORKDIR /app

ARG ENV

COPY . .

RUN npm i -g pnpm pm2 && pnpm i && pnpm build:client:${ENV}

ENTRYPOINT ["pm2-runtime","start","ecosystem.config.js"]