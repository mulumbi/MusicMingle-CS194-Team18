FROM node:alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN npm ci && npm cache clean --force

COPY src .env index.html tsconfig.json tsconfig.node.json vite.config.ts ./

EXPOSE 5173