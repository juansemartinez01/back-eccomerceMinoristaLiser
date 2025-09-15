# Stage 1: build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copiamos deps y lockfile para cache
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código y compilamos
COPY . .
RUN npm run build

# Stage 2: producción
FROM node:18-alpine

WORKDIR /usr/src/app

# Sólo copiamos lo necesario: build + package.json + node_modules de prod
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Variables de entorno
ENV NODE_ENV=production

# Puerto expuesto
EXPOSE 3000

# Comando de arranque
CMD ["node", "dist/src/main.js"]
