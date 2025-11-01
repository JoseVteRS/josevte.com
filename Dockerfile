FROM node:20 AS builder
WORKDIR /app

# Habilitar pnpm mediante corepack (recomendado por Node)
RUN corepack enable

# Copiar solo archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias sin forzar lockfile
RUN pnpm install

# Copiar todo el proyecto
COPY . .

# Build Astro
RUN pnpm run build

# Etapa final para servir estático
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
