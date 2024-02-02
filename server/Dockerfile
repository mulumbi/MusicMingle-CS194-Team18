FROM node:alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN npm ci && npm cache clean --force

COPY src .env tsconfig.json ./

EXPOSE 3000