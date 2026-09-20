# 1. Imagen oficial de Playwright
# Contiene Node.js y todas las dependencias de SO para Chromium, Firefox y WebKit
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# 2. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar los archivos de dependencias
COPY package*.json ./

# 4. Instalar dependencias exactas
RUN npm ci

# 5. Copiar el resto del código fuente del framework
COPY . .

# 6. Comando por defecto que se ejecutará al levantar el contenedor
CMD ["npx", "playwright", "test"]