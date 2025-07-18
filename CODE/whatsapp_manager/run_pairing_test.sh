#!/bin/bash

# Script para executar testes de Pairing Code
# Uso: ./run_pairing_test.sh [opção]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${2:-$NC}$1${NC}"
}

# Função para mostrar ajuda
show_help() {
    echo "Uso: $0 [opção]"
    echo ""
    echo "Opções:"
    echo "  connection  - Testar conexão com WhatsApp Manager"
    echo "  pairing     - Testar geração de pairing code"
    echo "  status      - Verificar status da sessão"
    echo "  monitor     - Monitorar status por 2 minutos"
    echo "  send        - Testar envio de mensagem"
    echo "  full        - Executar teste completo (padrão)"
    echo "  help        - Mostrar esta ajuda"
    echo ""
    echo "Variáveis de ambiente:"
    echo "  WHATSAPP_MANAGER_URL - URL do WhatsApp Manager (padrão: http://localhost:3001)"
    echo "  TEST_PHONE_NUMBER    - Número para teste (padrão: 5511999999999)"
    echo "  TEST_DESTINATION     - Número de destino (padrão: 5511888888888@s.whatsapp.net)"
    echo ""
    echo "Exemplos:"
    echo "  $0 full"
    echo "  WHATSAPP_MANAGER_URL=http://192.168.1.100:3001 $0 pairing"
    echo "  TEST_PHONE_NUMBER=5511888888888 $0 monitor"
}

# Verificar se Node.js está instalado
check_node() {
    if ! command -v node &> /dev/null; then
        log "❌ Node.js não está instalado!" $RED
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log "❌ npm não está instalado!" $RED
        exit 1
    fi
}

# Verificar se axios está instalado
check_axios() {
    if ! node -e "require('axios')" 2>/dev/null; then
        log "📦 Instalando axios..." $YELLOW
        npm install axios
    fi
}

# Função principal
main() {
    local option=${1:-full}
    
    case $option in
        help|--help|-h)
            show_help
            exit 0
            ;;
        connection|pairing|status|monitor|send|full)
            log "🔧 Verificando dependências..." $BLUE
            check_node
            check_axios
            
            log "🚀 Executando teste: $option" $GREEN
            node test_pairing_code.js "$option"
            ;;
        *)
            log "❌ Opção inválida: $option" $RED
            show_help
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@" 