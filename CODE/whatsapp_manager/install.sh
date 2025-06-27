#!/bin/bash

echo "Instalando dependências do WhatsApp Manager..."

# Remove node_modules e package-lock.json existentes
if [ -d "node_modules" ]; then
    echo "Removendo node_modules existente..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "Removendo package-lock.json existente..."
    rm package-lock.json
fi

# Instala as dependências
echo "Instalando dependências com npm..."
npm install

# Verifica se a instalação foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "Dependências instaladas com sucesso!"
    echo "Para iniciar o servidor, execute: ./start.sh"
else
    echo "Erro ao instalar dependências."
    exit 1
fi

# Cria diretórios necessários
echo "Criando diretórios necessários..."
mkdir -p public/qr
mkdir -p data/sessions

echo "Instalação concluída!" 