# Estágio de build
FROM node:lts-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos de dependência primeiro para aproveitar o cache do Docker
COPY SERVER/package*.json ./

# Instalar dependências e gerar package-lock.json atualizado
RUN npm install

# Copiar o resto dos arquivos do servidor
COPY SERVER/ ./

# Construir a aplicação
RUN npm run build

# Estágio de produção
FROM node:lts-alpine

# Adicionar usuário não-root para segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Definir diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos necessários do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalar apenas dependências de produção
RUN npm install --production && \
    npm cache clean --force

# Configurar variáveis de ambiente básicas
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8000

# Mudar para usuário não-root
USER appuser

# Expor porta
EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]
    