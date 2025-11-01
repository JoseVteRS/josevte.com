FROM node:22-alpine AS builder
WORKDIR /app

# Copia solo archivos necesarios para instalar dependencias
COPY package.json pnpm-lock.yaml ./

# Instala pnpm global
RUN npm install -g pnpm

# Instala dependencias usando el lockfile
RUN pnpm install --frozen-lockfile

# Copia el resto del código
COPY . .

# Build Astro
RUN pnpm run build

# Etapa final: servir estático
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
