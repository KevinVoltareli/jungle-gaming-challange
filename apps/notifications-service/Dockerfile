# Base com Node
FROM node:22-alpine AS base

WORKDIR /app

# Copia arquivos principais do monorepo
COPY package.json package-lock.json* turbo.json ./
COPY packages ./packages
COPY apps/api-gateway/package.json ./apps/api-gateway/package.json

RUN npm install

FROM base AS development

WORKDIR /app

# comando default será sobrescrito no docker-compose
CMD ["npm", "run", "dev"]
