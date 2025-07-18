# Integração do Event Controller com WhatsApp

## Visão Geral

Este guia mostra como integrar o `EventController` e `WAMonitoringService` com o seu servidor WhatsApp existente, fornecendo monitoramento avançado, tratamento de eventos e integrações.

## Arquivos Principais

### Core Files
- `event_controller.js` - Classe principal com WAMonitoringService e EventController
- `event_config.js` - Configurações centralizadas
- `event_controller_usage.js` - Exemplos específicos para WhatsApp

### Integração com Servidor Existente
- `server.js` - Servidor principal (já existente)
- `baileys_startup_service.js` - Gerenciador WhatsApp (já existente)

## Integração Rápida

### 1. Integração Básica no server.js

```javascript
// No início do server.js
import { integrateWithExistingServer } from './event_controller_usage.js';

// Após inicializar o servidor Express
const app = express();

// ... suas configurações existentes ...

// Integra o Event Controller
integrateWithExistingServer(app);

// Agora você tem acesso a:
// app.monitoringService - WAMonitoringService
// app.eventController - EventController
// app.eventEmitter - EventEmitter
```

### 2. Configuração de Event Listeners

```javascript
// Configura event listeners específicos para WhatsApp
import { setupWhatsAppEventListeners } from './event_controller_usage.js';

setupWhatsAppEventListeners(
    app.eventEmitter,
    app.monitoringService,
    app.eventController
);
```

## Funcionalidades Disponíveis

### 🔄 **Monitoramento de Conexão**
- Status em tempo real das instâncias WhatsApp
- Detecção automática de desconexões
- Logs detalhados de eventos

### 🚨 **Tratamento de Erros**
- Reconexão automática com backoff exponencial
- Tratamento específico de erros 401
- Limpeza automática de recursos

### 📡 **Integrações**
- Webhooks para eventos importantes
- Notificações para administradores
- Logs estruturados

### 🧹 **Limpeza Automática**
- Sessões expiradas
- Dados órfãos no banco
- Cache e arquivos temporários

## Eventos Monitorados

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

## Configuração de Webhooks

### 1. Configurar Webhook para Instância

```javascript
// Configura webhook para uma instância específica
await app.eventController.set('ZapBless', {
    webhook: {
        enabled: true,
        events: [
            'MESSAGES_UPSERT',
            'CONNECTION_UPDATE',
            'QRCODE_UPDATED',
            'RECONNECT_FAILED',
            'LOGOUT_INSTANCE'
        ]
    }
});
```

### 2. Obter Configuração Atual

```javascript
// Obtém configuração de webhook
const config = await app.eventController.get('ZapBless');
console.log('Configuração atual:', config);
```

### 3. Eventos Disponíveis para Webhook

```javascript
const availableEvents = [
    'APPLICATION_STARTUP',
    'QRCODE_UPDATED',
    'MESSAGES_SET',
    'MESSAGES_UPSERT',
    'MESSAGES_EDITED',
    'MESSAGES_UPDATE',
    'MESSAGES_DELETE',
    'SEND_MESSAGE',
    'SEND_MESSAGE_UPDATE',
    'CONTACTS_SET',
    'CONTACTS_UPSERT',
    'CONTACTS_UPDATE',
    'PRESENCE_UPDATE',
    'CHATS_SET',
    'CHATS_UPSERT',
    'CHATS_UPDATE',
    'CHATS_DELETE',
    'GROUPS_UPSERT',
    'GROUP_UPDATE',
    'GROUP_PARTICIPANTS_UPDATE',
    'CONNECTION_UPDATE',
    'LABELS_EDIT',
    'LABELS_ASSOCIATION',
    'CALL',
    'TYPEBOT_START',
    'TYPEBOT_CHANGE_STATUS',
    'REMOVE_INSTANCE',
    'LOGOUT_INSTANCE',
    'INSTANCE_CREATE',
    'INSTANCE_DELETE',
    'STATUS_INSTANCE',
    'RECONNECT_FAILED',
    'NO_CONNECTION'
];
```

## Monitoramento de Instâncias

### 1. Monitoramento Automático

```javascript
// Configura monitoramento automático
import { setupInstanceMonitoring } from './event_controller_usage.js';

setupInstanceMonitoring(app.monitoringService);
```

### 2. Monitoramento Manual

```javascript
// Obtém informações de todas as instâncias
const instances = await app.monitoringService.instanceInfo();
console.log('Instâncias:', instances);

// Obtém informações de instância específica
const instance = await app.monitoringService.instanceInfoById('instance-id');
console.log('Instância:', instance);
```

### 3. Status de Conexão

```javascript
// Verifica status de conexão
const status = app.monitoringService.waInstances['ZapBless']?.stateConnection?.state;
console.log('Status da conexão:', status);

// Possíveis valores:
// - 'open' - Conectado
// - 'close' - Desconectado
// - 'connecting' - Conectando
// - 'reconnecting' - Reconectando
```

## Gerenciamento de Instâncias

### 1. Salvar Nova Instância

```javascript
await app.monitoringService.saveInstance({
    instanceId: 'zapbless-instance-123',
    instanceName: 'ZapBless',
    ownerJid: '5512981606045@s.whatsapp.net',
    profileName: 'ZapBless Bot',
    profilePicUrl: null,
    integration: 'WhatsApp',
    number: '5512981606045',
    hash: 'zapbless-hash-123',
    businessId: null
});
```

### 2. Deletar Instância

```javascript
app.monitoringService.deleteInstance('ZapBless');
```

### 3. Configurar Timeout

```javascript
app.monitoringService.delInstanceTime('ZapBless');
```

## Limpeza de Dados

### 1. Limpeza Automática

O sistema executa limpeza automática nos seguintes casos:
- Timeout de instância
- Logout de instância
- Remoção de instância
- Falha de reconexão

### 2. Limpeza Manual

```javascript
// Limpeza básica (sessões e cache)
await app.monitoringService.cleaningUp('ZapBless');

// Limpeza completa (todos os dados)
await app.monitoringService.cleaningStoreData('ZapBless');
```

## Configuração de Variáveis de Ambiente

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
SERVER_URL=http://localhost:3000
```

## Exemplo Completo de Integração

### 1. server.js Atualizado

```javascript
import express from 'express';
import { integrateWithExistingServer } from './event_controller_usage.js';
import { setupWhatsAppEventListeners } from './event_controller_usage.js';

const app = express();

// ... suas configurações existentes ...

// Integra o Event Controller
integrateWithExistingServer(app);

// Configura event listeners específicos
setupWhatsAppEventListeners(
    app.eventEmitter,
    app.monitoringService,
    app.eventController
);

// Configura webhook para instância padrão
app.eventController.set('ZapBless', {
    webhook: {
        enabled: true,
        events: [
            'MESSAGES_UPSERT',
            'CONNECTION_UPDATE',
            'QRCODE_UPDATED',
            'RECONNECT_FAILED',
            'LOGOUT_INSTANCE'
        ]
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
    console.log('Event Controller integrado com sucesso!');
});
```

### 2. Endpoints Adicionais

```javascript
// Endpoint para obter status de todas as instâncias
app.get('/instances/status', async (req, res) => {
    try {
        const instances = await app.monitoringService.instanceInfo();
        res.json(instances);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para configurar webhook
app.post('/instances/:name/webhook', async (req, res) => {
    try {
        const { name } = req.params;
        const config = req.body;
        
        await app.eventController.set(name, config);
        res.json({ success: true, message: 'Webhook configurado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para limpeza manual
app.post('/instances/:name/cleanup', async (req, res) => {
    try {
        const { name } = req.params;
        const { full } = req.query;
        
        if (full === 'true') {
            await app.monitoringService.cleaningStoreData(name);
        } else {
            await app.monitoringService.cleaningUp(name);
        }
        
        res.json({ success: true, message: 'Limpeza concluída' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

## Troubleshooting

### Problemas Comuns

1. **Erro de Importação**
   ```bash
   # Verifique se todos os arquivos estão no lugar correto
   ls -la event_controller.js event_config.js event_controller_usage.js
   ```

2. **Instância não encontrada**
   ```javascript
   // Verifique se a instância existe
   const instances = await app.monitoringService.instanceInfo();
   console.log('Instâncias disponíveis:', instances.map(i => i.name));
   ```

3. **Webhook não funcionando**
   ```javascript
   // Verifique a configuração
   const config = await app.eventController.get('ZapBless');
   console.log('Configuração webhook:', config);
   ```

### Debug

```javascript
// Habilitar logs detalhados
process.env.DEBUG = 'event-controller:*';

// Log de todos os eventos
app.eventEmitter.on('*', (eventName, ...args) => {
    console.log(`Event: ${eventName}`, args);
});
```

## Benefícios da Integração

### ✅ **Estabilidade**
- Tratamento automático de erros 401
- Reconexão inteligente
- Limpeza automática de recursos

### 📊 **Monitoramento**
- Status em tempo real
- Logs estruturados
- Métricas de performance

### 🔗 **Integrações**
- Webhooks configuráveis
- Notificações automáticas
- APIs para terceiros

### 🛠️ **Manutenibilidade**
- Código organizado
- Configurações centralizadas
- Fácil extensão

## Próximos Passos

1. **Integre o Event Controller** no seu servidor
2. **Configure webhooks** para eventos importantes
3. **Monitore as instâncias** em produção
4. **Ajuste configurações** conforme necessário
5. **Implemente notificações** personalizadas

O Event Controller agora está totalmente adaptado para o seu projeto WhatsApp e pronto para uso em produção! 