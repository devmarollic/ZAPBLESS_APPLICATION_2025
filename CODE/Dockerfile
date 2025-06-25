# ---- STAGE: builder ----
FROM node:lts-alpine AS builder
WORKDIR /app

# 1) Copia package.json e yarn.lock do servidor
COPY SERVER/package.json SERVER/yarn.lock ./SERVER/
WORKDIR /app/SERVER
RUN yarn install --frozen-lockfile

# 2) Copia o código e gera o bundle
COPY SERVER/ .
RUN yarn run build   # ou: npx esbuild --config ../esbuild.config.js

# ---- STAGE: client-builder ---- (Opcional: separa cliente)
FROM node:lts-alpine AS client-builder
WORKDIR /app

COPY CLIENT/package.json CLIENT/yarn.lock ./CLIENT/
WORKDIR /app/CLIENT
RUN yarn install --frozen-lockfile

COPY CLIENT/ .
RUN yarn run build

# ---- STAGE: production ----
FROM node:lts-alpine
WORKDIR /app

# Copia package.json e yarn.lock para instalar dependências de produção
COPY SERVER/package.json SERVER/yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Copia o bundle do servidor
COPY --from=builder /app/SERVER/dist ./dist

# Copia os assets estáticos do cliente
COPY --from=client-builder /app/CLIENT/dist ./public

ENV HOST=0.0.0.0
ENV PORT=8000

EXPOSE 8000

# Executa a aplicação a partir do diretório dist
CMD ["node", "dist/index.js"]
    