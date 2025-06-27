FROM node:16-alpine

# Instala dependências necessárias
RUN apk add --no-cache ffmpeg python3 g++ make

# Cria diretório da aplicação
WORKDIR /app

# Copia arquivos de configuração
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia arquivos do projeto
COPY . .

# Cria diretórios necessários
RUN mkdir -p public/qr data/sessions

# Expõe a porta que será usada
EXPOSE 1234

# Comando para iniciar a aplicação
CMD ["node", "server.js"] 