# --- BASE ---
# Usamos a imagem oficial do Bun
FROM oven/bun:1 AS base
WORKDIR /app

# Copiamos apenas os arquivos de dependência primeiro para aproveitar o cache do Docker
COPY package.json bun.lockb* ./

# Instalamos as dependências.
# --frozen-lockfile garante que instalamos exatamente as versões do lockfile
RUN bun install --frozen-lockfile

# --- STAGE DE DESENVOLVIMENTO (Dev) ---
FROM base AS dev
# A porta padrão do Vite
EXPOSE 5173
# Rodamos o script "dev" definido no seu package.json, forçando o host para o Docker aceitar conexões
CMD ["bun", "run", "dev", "--host"]

# --- STAGE DE BUILD (Prod Builder) ---
FROM base AS build
# Copia o restante do código fonte
COPY . .
# Roda o script "build" do seu package.json (tsc -b && vite build)
RUN bun run build

# --- STAGE FINAL (Produção) ---
FROM nginx:alpine AS prod
# Copia apenas os arquivos estáticos gerados na pasta 'dist' para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copia a configuração customizada do Nginx (vamos criar abaixo)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]