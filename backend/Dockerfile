FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# --- DEV ---
FROM base AS dev
EXPOSE 3000
# NestJS em modo watch
CMD ["bun", "run", "start:dev"]

# --- PROD ---
FROM base AS build
COPY . .
RUN bun run build

FROM oven/bun:1 AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["bun", "run", "dist/main.js"]