# Event Controller - WhatsApp Manager

## Visão Geral

O `WAMonitoringService` é um componente central para gerenciar eventos e instâncias do WhatsApp no projeto ZapBless. Ele fornece funcionalidades de monitoramento, limpeza de dados e controle de conexões.

## Características Principais

### 🔄 **Gerenciamento de Eventos**
- Monitoramento de conexões WhatsApp
- Tratamento de desconexões e reconexões
- Limpeza automática de recursos
- Eventos customizáveis

### 🧹 **Limpeza de Dados**
- Remoção de sessões expiradas
- Limpeza de dados do banco
- Limpeza de cache
- Limpeza de arquivos temporários

### 📊 **Monitoramento**
- Status de instâncias em tempo real
- Logs detalhados de eventos
- Notificações para administradores
- Métricas de performance

## Arquivos do Sistema

### Core Files
- `event_controller.js` - Classe principal WAMonitoringService
- `event_config.js` - Configurações e constantes centralizadas
- `event_controller_example.js` - Exemplos de uso

### Dependências
- `baileys_startup_service.js` - Gerenciador WhatsApp
- `supabase_repository.js` - Repositório de dados
- `provider_file_service.js` - Gerenciador de arquivos
- `clear_session.js` - Limpeza de sessões

## Configuração

### Variáveis de Ambiente

```bash
# Configurações de banco de dados
SAVE_INSTANCE_DATA=true
CLIENT_NAME=ZapBless

# Configurações de cache
REDIS_ENABLED=false
REDIS_SAVE_INSTANCES=false

# Configurações de provider
PROVIDER_ENABLED=false

# Configurações do Chatwoot
CHATWOOT_ENABLED=false

# Configurações de timeout
INSTANCE_TIMEOUT=60

# Configurações de notificação
NOTIFICATION_WEBHOOK_URL=https://api.example.com/webhook
```

### Configurações de Limpeza

```javascript
const CLEANUP_CONFIG = {
    ENABLE_CHATWOOT_CLEANUP: true,
    ENABLE_SESSION_CLEANUP: true,
    ENABLE_DATABASE_CLEANUP: true,
    ENABLE_CACHE_CLEANUP: true
};
```

## Uso Básico

### 1. Inicialização

```javascript
import { EventEmitter } from 'events';
import { WAMonitoringService } from './event_controller.js';
import { SupabaseRepository } from './supabase_repository.js';
import { ProviderFiles } from './provider_file_service.js';

// Cria o event emitter
const eventEmitter = new EventEmitter();

// Inicializa repositórios
const supabaseRepository = new SupabaseRepository();
const providerFiles = new ProviderFiles();

// Cria o monitoring service
const monitoringService = new WAMonitoringService(
    eventEmitter,
    configService,
    supabaseRepository,
    providerFiles,
    cache,
    chatwootCache,
    baileysCache
);
```

### 2. Carregamento de Instâncias

```javascript
// Carrega instâncias existentes
await monitoringService.loadInstance();

// Obtém informações de instâncias
const instanceInfo = await monitoringService.instanceInfo(['ZapBless']);

// Obtém informações por ID
const instanceById = await monitoringService.instanceInfoById('instance-id');
```

### 3. Gerenciamento de Instâncias

```javascript
// Salva nova instância
await monitoringService.saveInstance({
    instanceId: 'instance-123',
    instanceName: 'ZapBless',
    ownerJid: '5512981606045@s.whatsapp.net',
    profileName: 'ZapBless Bot',
    integration: 'WhatsApp',
    number: '5512981606045'
});

// Deleta instância
monitoringService.deleteInstance('ZapBless');

// Configura timeout para instância
monitoringService.delInstanceTime('ZapBless');
```

## Eventos Disponíveis

### Eventos de Conexão

```javascript
// Reconexão falhou
eventEmitter.on('reconnect.failed', (instanceName) => {
    console.log(`Reconexão falhou: ${instanceName}`);
});

// Logout de instância
eventEmitter.on('logout.instance', (instanceName, reason) => {
    console.log(`Logout: ${instanceName}, motivo: ${reason}`);
});

// Instância removida
eventEmitter.on('remove.instance', (instanceName, reason) => {
    console.log(`Removida: ${instanceName}, motivo: ${reason}`);
});

// Sem conexão
eventEmitter.on('no.connection', (instanceName) => {
    console.log(`Sem conexão: ${instanceName}`);
});
```

### Eventos de WhatsApp

```javascript
// Atualização de conexão
eventEmitter.on('connection.update', (data) => {
    console.log('Status da conexão:', data.state);
});

// QR Code atualizado
eventEmitter.on('qrcode.updated', (data) => {
    console.log('QR Code gerado:', data.qrcode);
});

// Status da instância
eventEmitter.on('status.instance', (data) => {
    console.log('Status da instância:', data.status);
});
```

## Integração com o Servidor

### 1. No servidor.js

```javascript
import { integrateWithServer } from './event_controller_example.js';

// Após inicializar o servidor
integrateWithServer(app);

// Agora você tem acesso a:
app.monitoringService // WAMonitoringService
app.eventEmitter      // EventEmitter
```

### 2. Event Listeners Customizados

```javascript
// Configura listeners personalizados
function setupCustomListeners(eventEmitter, monitoringService) {
    eventEmitter.on('reconnect.failed', async (instanceName) => {
        // Enviar notificação para admin
        await sendAdminNotification(instanceName, 'RECONNECT_FAILED');
        
        // Tentar recuperação automática
        await monitoringService.cleaningUp(instanceName);
    });
    
    eventEmitter.on('logout.instance', async (instanceName, reason) => {
        // Log de auditoria
        await logAuditEvent(instanceName, 'LOGOUT', reason);
        
        // Notificação
        await sendAdminNotification(instanceName, 'LOGOUT', reason);
    });
}
```

## Limpeza de Dados

### Limpeza Automática

O sistema executa limpeza automática nos seguintes casos:

1. **Timeout de Instância**: Instâncias que não conectam dentro do tempo limite
2. **Logout**: Quando uma instância faz logout
3. **Remoção**: Quando uma instância é removida manualmente
4. **Falha de Reconexão**: Após falhas consecutivas de reconexão

### Limpeza Manual

```javascript
// Limpeza básica (sessões e cache)
await monitoringService.cleaningUp('instance-name');

// Limpeza completa (todos os dados)
await monitoringService.cleaningStoreData('instance-name');
```

## Monitoramento e Logs

### Logs Estruturados

```javascript
// Exemplo de log de evento
{
    timestamp: '2025-01-18T18:39:03.869Z',
    event: 'reconnect.failed',
    instanceName: 'ZapBless',
    reason: '401 Unauthorized',
    reconnectAttempts: 5,
    severity: 'HIGH'
}
```

### Métricas Disponíveis

- Número de instâncias ativas
- Tentativas de reconexão
- Status de conexão
- Tempo de uptime
- Erros de conexão

## Tratamento de Erros

### Códigos de Erro

```javascript
const NON_RECONNECT_ERRORS = [
    401, // Unauthorized - não reconecta
    403, // Forbidden - não reconecta
    402, // Payment Required - não reconecta
    406, // Not Acceptable - não reconecta
    'loggedOut', // Usuário deslogado
    'forbidden'  // Acesso proibido
];
```

### Estratégia de Reconexão

1. **Backoff Exponencial**: 2s → 4s → 8s → 16s → 30s
2. **Limite de Tentativas**: Máximo 5 tentativas
3. **Reset Automático**: Contador resetado em conexão bem-sucedida
4. **Prevenção de Loops**: Controle de estado

## Notificações

### Sistema de Notificações

```javascript
// Exemplo de notificação
const notification = {
    timestamp: new Date().toISOString(),
    instanceName: 'ZapBless',
    eventType: 'RECONNECT_FAILED',
    reason: '401 Unauthorized',
    severity: 'HIGH'
};

// Enviar para webhook
await fetch(process.env.NOTIFICATION_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification)
});
```

### Níveis de Severidade

- **HIGH**: Reconexão falhou, erro crítico
- **MEDIUM**: Logout, sem conexão
- **LOW**: Instância removida, limpeza

## Performance e Otimização

### Boas Práticas

1. **Event Listeners**: Use `removeListener` para evitar memory leaks
2. **Async Operations**: Sempre use try/catch em operações assíncronas
3. **Batch Operations**: Agrupe operações de limpeza quando possível
4. **Caching**: Use cache para dados frequentemente acessados

### Monitoramento

```javascript
// Monitorar uso de memória
setInterval(() => {
    const memUsage = process.memoryUsage();
    console.log('Memory usage:', {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`
    });
}, 60000);
```

## Troubleshooting

### Problemas Comuns

1. **Memory Leaks**
   - Verifique se event listeners estão sendo removidos
   - Monitore uso de memória
   - Use heap snapshots para debug

2. **Instâncias Órfãs**
   - Verifique logs de limpeza
   - Execute limpeza manual se necessário
   - Verifique configurações de timeout

3. **Reconexões Excessivas**
   - Verifique códigos de erro
   - Ajuste configurações de backoff
   - Monitore logs de conexão

### Debug

```javascript
// Habilitar logs detalhados
process.env.DEBUG = 'event-controller:*';

// Log de eventos específicos
eventEmitter.on('*', (eventName, ...args) => {
    console.log(`Event: ${eventName}`, args);
});
```

## Exemplos Completos

### Exemplo 1: Servidor Completo

```javascript
import express from 'express';
import { EventEmitter } from 'events';
import { WAMonitoringService } from './event_controller.js';
import { setupCustomEventListeners } from './event_controller_example.js';

const app = express();
const eventEmitter = new EventEmitter();

// Configura monitoring service
const monitoringService = new WAMonitoringService(/* params */);

// Configura event listeners
setupCustomEventListeners(eventEmitter, monitoringService);

// Carrega instâncias
await monitoringService.loadInstance();

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
```

### Exemplo 2: Monitoramento Customizado

```javascript
// Monitor personalizado
class CustomMonitor {
    constructor(monitoringService) {
        this.monitoringService = monitoringService;
        this.setupMonitoring();
    }
    
    setupMonitoring() {
        setInterval(async () => {
            const instances = await this.monitoringService.instanceInfo();
            
            instances.forEach(instance => {
                if (instance.connectionStatus === 'close') {
                    console.log(`⚠️ Instância ${instance.name} está desconectada`);
                }
            });
        }, 30000);
    }
}

const customMonitor = new CustomMonitor(monitoringService);
```

## Contribuição

Para contribuir com melhorias no Event Controller:

1. Siga os padrões do CODEX
2. Adicione testes para novas funcionalidades
3. Documente mudanças na API
4. Mantenha compatibilidade com versões anteriores

## Licença

Este código faz parte do projeto ZapBless e segue as mesmas diretrizes de licenciamento. 