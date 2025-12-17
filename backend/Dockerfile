# =========================
# BASE
# =========================
FROM oven/bun:1 AS base

WORKDIR /app

# Copia arquivos de dependência
COPY package.json bun.lockb* ./

# Instala dependências (sem scripts de post-install do prisma)
RUN bun install --frozen-lockfile --ignore-scripts


# =========================
# DEV
# =========================
FROM base AS dev

WORKDIR /app

COPY . .

EXPOSE 3000

# Apenas roda o Nest em modo watch
CMD ["bun", "run", "start:dev"]


# =========================
# BUILD
# =========================
FROM base AS build

WORKDIR /app

COPY . .

# Build do NestJS (Gera a pasta dist)
RUN bun run build


# =========================
# PROD
# =========================
FROM oven/bun:1 AS prod

WORKDIR /app

# Copia apenas o necessário do build anterior
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

CMD ["bun", "run", "dist/main.js"]