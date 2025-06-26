# Dockerfile para frontend (Vite + React) usando Deno para desarrollo
FROM denoland/deno:alpine-2.3.6

# Instala dependencias necesarias
RUN apk add --no-cache bash

# Crea directorio de trabajo
WORKDIR /app

# Copia todo el frontend y archivos de configuración
COPY . .

# Expone el puerto de Vite (por defecto 5173)
EXPOSE 3000

# Comando por defecto: inicia el frontend en modo desarrollo
CMD ["task", "dev"]
