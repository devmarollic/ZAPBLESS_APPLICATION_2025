#!/bin/bash

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Node.js não encontrado. Por favor, instale o Node.js antes de continuar."
    exit 1
fi

# Verifica se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências..."
    npm install
fi

# Cria diretórios necessários
mkdir -p public/qr
mkdir -p data/sessions

# Inicia o servidor
echo "Iniciando servidor WhatsApp..."
node server.js 