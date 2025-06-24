# Usar la imagen oficial de Deno
FROM denoland/deno:alpine-1.27.1

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos del proyecto al contenedor
COPY . .

# Instalar las dependencias de Deno
RUN deno cache deps.ts

# Exponer el puerto en el que el servidor se ejecutará (ajustar si es necesario)
EXPOSE 8000

# Comando para ejecutar el servidor
CMD ["deno", "run", "--allow-net", "--allow-read", "server/main.ts"]
