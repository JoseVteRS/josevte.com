# Dockerfile optimizado para desplegar el sitio Astro estático con Dokploy

# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias primero para cachear mejor las instalaciones
COPY package*.json ./
COPY pnpm-lock.yaml* ./
COPY yarn.lock* ./
COPY .npmrc* ./

# Instalar dependencias usando el gestor correspondiente
RUN if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    else npm ci; fi

# Copiar el resto del código fuente
COPY . .

# Construir archivos estáticos de Astro
RUN npm run build

# Etapa de despliegue: usar nginx para servir archivos estáticos en Dokploy
FROM nginx:alpine AS runner

# Copiar los archivos estáticos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto por defecto que Dokploy espera (80)
EXPOSE 80

# Comando por defecto para arrancar nginx
CMD ["nginx", "-g", "daemon off;"]
