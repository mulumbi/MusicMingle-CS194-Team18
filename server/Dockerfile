FROM node:alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN apk update

RUN apk upgrade

RUN apk add --no-cache ffmpeg

RUN npm ci && npm cache clean --force

COPY src .env tsconfig.json ./

EXPOSE 3000