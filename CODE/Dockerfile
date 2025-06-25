# Estágio de build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar apenas os arquivos necessários para build
COPY SERVER/package*.json ./
RUN yarn install

# Copiar o resto dos arquivos do servidor
COPY SERVER/ ./

# Construir a aplicação
RUN yarn run build

# Estágio de produção
FROM node:22-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY SERVER/package*.json ./

# Instalar dependências de produção
RUN yarn install --production && \
    yarn cache clean

# Copiar o bundle compilado
COPY --from=builder /app/dist ./dist

ENV HOST 0.0.0.0
ENV PORT 8000

EXPOSE 8000

CMD ["node", "dist/index.js"]