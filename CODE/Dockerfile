# Estágio de build
FROM node:22-alpine as builder

WORKDIR /app
COPY . .

WORKDIR /app/SERVER
RUN yarn install && \
    yarn run build && \
    rm -rf node_modules

COPY --from=builder /app/SERVER/dist .

ENV HOST 0.0.0.0
ENV PORT 8000

EXPOSE 8000

CMD ["node", "index.js"]

# Estágio de produção
FROM node:22-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY SERVER/package*.json ./

# Instalar dependências de produção
RUN yarn install --production && \
    yarn cache clean

# Copiar o bundle compilado
COPY --from=builder /app/SERVER/dist ./dist

ENV HOST 0.0.0.0
ENV PORT 8000

EXPOSE 8000

CMD ["node", "dist/index.js"]