#!/bin/bash

# Script para configurar variáveis de ambiente do WhatsApp Manager

echo "🔧 Configuração do Ambiente WhatsApp Manager"
echo "=============================================="
echo ""

# Verifica se o arquivo .env já existe
if [ -f ".env" ]; then
    echo "⚠️  Arquivo .env já existe!"
    read -p "Deseja sobrescrever? (y/N): " overwrite
    if [[ ! $overwrite =~ ^[Yy]$ ]]; then
        echo "❌ Configuração cancelada"
        exit 1
    fi
fi

echo ""
echo "📝 Configure as variáveis de ambiente:"
echo ""

# CHURCH_ID
read -p "ID da Igreja (CHURCH_ID): " church_id
if [ -z "$church_id" ]; then
    echo "❌ CHURCH_ID é obrigatório!"
    exit 1
fi

# SUPABASE_URL
read -p "URL do Supabase (SUPABASE_URL): " supabase_url
if [ -z "$supabase_url" ]; then
    echo "❌ SUPABASE_URL é obrigatório!"
    exit 1
fi

# SUPABASE_KEY
read -p "Chave do Supabase (SUPABASE_KEY): " supabase_key
if [ -z "$supabase_key" ]; then
    echo "❌ SUPABASE_KEY é obrigatório!"
    exit 1
fi

# Configurações opcionais
echo ""
echo "⚙️  Configurações opcionais (pressione Enter para usar valores padrão):"
echo ""

# PORT
read -p "Porta do servidor (PORT) [3000]: " port
port=${port:-3000}

# LOG_LEVEL
read -p "Nível de log (LOG_LEVEL) [info]: " log_level
log_level=${log_level:-info}

# DEBUG
read -p "Modo debug (DEBUG) [false]: " debug
debug=${debug:-false}

# SESSION_BASE_DIR
read -p "Diretório base para sessões (SESSION_BASE_DIR) [./sessions]: " session_base_dir
session_base_dir=${session_base_dir:-./sessions}

# Proxy (opcional)
echo ""
echo "🌐 Configuração de Proxy (opcional):"
read -p "Usar proxy? (y/N): " use_proxy

if [[ $use_proxy =~ ^[Yy]$ ]]; then
    read -p "Host do proxy (PROXY_HOST): " proxy_host
    read -p "Porta do proxy (PROXY_PORT): " proxy_port
    read -p "Usuário do proxy (PROXY_USERNAME) [opcional]: " proxy_username
    read -p "Senha do proxy (PROXY_PASSWORD) [opcional]: " proxy_password
fi

# Cria o arquivo .env
echo "📄 Criando arquivo .env..."

cat > .env << EOF
# Configurações do WhatsApp Manager
# Gerado automaticamente em $(date)

# ID da Igreja (obrigatório)
CHURCH_ID=$church_id

# Configurações do Supabase (obrigatório)
SUPABASE_URL=$supabase_url
SUPABASE_KEY=$supabase_key

# Configurações de Log
LOG_LEVEL=$log_level
DEBUG=$debug

# Configurações de Porta
PORT=$port

# Configurações de Sessão
SESSION_BASE_DIR=$session_base_dir

EOF

# Adiciona configurações de proxy se especificadas
if [[ $use_proxy =~ ^[Yy]$ ]] && [ ! -z "$proxy_host" ] && [ ! -z "$proxy_port" ]; then
    cat >> .env << EOF

# Configurações de Proxy
PROXY_HOST=$proxy_host
PROXY_PORT=$proxy_port
EOF

    if [ ! -z "$proxy_username" ]; then
        echo "PROXY_USERNAME=$proxy_username" >> .env
    fi
    
    if [ ! -z "$proxy_password" ]; then
        echo "PROXY_PASSWORD=$proxy_password" >> .env
    fi
fi

echo ""
echo "✅ Arquivo .env criado com sucesso!"
echo ""
echo "📋 Configurações aplicadas:"
echo "   CHURCH_ID: $church_id"
echo "   SUPABASE_URL: $supabase_url"
echo "   PORT: $port"
echo "   LOG_LEVEL: $log_level"
echo "   DEBUG: $debug"
echo "   SESSION_BASE_DIR: $session_base_dir"

if [[ $use_proxy =~ ^[Yy]$ ]] && [ ! -z "$proxy_host" ]; then
    echo "   PROXY: $proxy_host:$proxy_port"
fi

echo ""
echo "🚀 Próximos passos:"
echo "   1. Execute: npm run diagnose"
echo "   2. Execute: npm start"
echo "   3. Acesse: http://localhost:$port"
echo ""
echo "📚 Para mais informações, consulte:"
echo "   - README.md"
echo "   - TROUBLESHOOTING.md" 