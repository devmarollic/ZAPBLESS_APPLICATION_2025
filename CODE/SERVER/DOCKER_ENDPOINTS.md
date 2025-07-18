# Endpoints Docker - ZapBless

Este documento descreve os endpoints disponíveis para gerenciar containers Docker das igrejas.

## Pré-requisitos

1. Docker instalado e rodando
2. Imagem `zapbless-whatsapp-manager:latest` construída
3. Servidor ZapBless rodando

## Construir a Imagem Docker

### Windows
```bash
CODE\build_whatsapp_image.bat
```

### Linux/Mac
```bash
./CODE/build_whatsapp_image.sh
```

## Endpoints Disponíveis

### 1. Sincronizar WhatsApp (Recomendado)
**POST** `/docker/sync`

Inicia um container Docker para a igreja do usuário logado e retorna a URL para conexão.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
    "success": true,
    "message": "Container iniciado com sucesso",
    "containerUrl": "http://localhost:3456",
    "port": 3456,
    "containerName": "zapbless-whatsapp-church_123",
    "churchId": "church_123"
}
```

### 2. Iniciar Container Docker
**POST** `/docker/container/start`

Inicia um container Docker para uma igreja específica.

**Body:**
```json
{
    "churchId": "church_123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Container iniciado com sucesso",
    "containerName": "zapbless-whatsapp-church_123",
    "port": 3456,
    "containerId": "abc123def456"
}
```

### 2. Parar Container Docker
**POST** `/docker/container/:churchId/stop`

Para e remove o container Docker de uma igreja.

**Response:**
```json
{
    "success": true,
    "message": "Container parado e removido com sucesso"
}
```

### 3. Reiniciar Container Docker
**POST** `/docker/container/:churchId/restart`

Reinicia o container Docker de uma igreja.

**Response:**
```json
{
    "success": true,
    "message": "Container iniciado com sucesso",
    "containerName": "zapbless-whatsapp-church_123",
    "port": 3456,
    "containerId": "abc123def456"
}
```

### 4. Obter Logs do Container
**GET** `/docker/container/:churchId/logs?lines=50`

Obtém os logs do container Docker de uma igreja.

**Query Parameters:**
- `lines` (opcional): Número de linhas de log (padrão: 50, máximo: 1000)

**Response:**
```json
{
    "success": true,
    "logs": "2025-01-30 10:30:15 INFO: Container started\n2025-01-30 10:30:16 INFO: WhatsApp session initialized"
}
```

### 5. Obter Status do Container
**GET** `/docker/container/:churchId/status`

Obtém o status atual do container Docker de uma igreja.

**Response:**
```json
{
    "success": true,
    "churchId": "church_123",
    "containerName": "zapbless-whatsapp-church_123",
    "isRunning": true,
    "status": "Up 2 hours",
    "port": 3456
}
```

### 6. Listar Todos os Containers
**GET** `/docker/containers/list`

Lista todos os containers Docker ativos.

**Response:**
```json
{
    "success": true,
    "containers": [
        {
            "churchId": "church_123",
            "containerName": "zapbless-whatsapp-church_123",
            "isRunning": true,
            "status": "Up 2 hours",
            "port": 3456
        },
        {
            "churchId": "church_456",
            "containerName": "zapbless-whatsapp-church_456",
            "isRunning": false,
            "status": "Exited (0) 1 hour ago",
            "port": 3789
        }
    ]
}
```

### 7. Verificar Status do Pairing Code
**GET** `/docker/pairing/{churchId}/status`

Verifica o status do pairing code e conexão WhatsApp para uma igreja específica.

**Parâmetros:**
- `churchId` (path): ID da igreja

**Response:**
```json
{
    "success": true,
    "message": "Status do WhatsApp obtido com sucesso",
    "status": "connecting",
    "pairingCode": "123-456-789",
    "qrCode": "/qr/qr-church_123.png",
    "containerUrl": "http://192.168.15.7:3456"
}
```

## 🔄 Fluxo de Sincronização WhatsApp

### 1. Frontend chama `/docker/sync`
```javascript
const response = await fetch('/docker/sync', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
    }
});

const result = await response.json();
// result.containerUrl contém a URL do container
```

### 2. Frontend se conecta ao container
```javascript
// Obter status do WhatsApp
const status = await fetch(`${result.containerUrl}/status`);

// Iniciar sessão
await fetch(`${result.containerUrl}/start`, {
    method: 'POST'
});

// Obter QR Code
const qrResponse = await fetch(`${result.containerUrl}/status`);
const qrCode = qrResponse.qrCode;
```

### 3. Frontend exibe QR Code
```javascript
// URL completa do QR Code
const qrCodeUrl = `${result.containerUrl}${qrCode}`;
```

### 4. Usuário escaneia QR Code
O WhatsApp do usuário se conecta automaticamente ao container.

### 5. Frontend monitora status
```javascript

## 🔐 Fluxo de Pairing Code

### 1. Frontend chama `/docker/sync`
```javascript
const response = await fetch('/docker/sync', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
    }
});

const result = await response.json();
// result.containerUrl contém a URL do container
```

### 2. Frontend inicia sessão com número de telefone
```javascript
// Iniciar sessão com número de telefone
const startResponse = await fetch(`${result.containerUrl}/start`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        phoneNumber: '5511999999999' // Número com código do país
    })
});

const startResult = await startResponse.json();
// startResult.pairingCode contém o código de pareamento
```

### 3. Frontend exibe código de pareamento
```javascript
if (startResult.pairingCode) {
    console.log('Código de pareamento:', startResult.pairingCode);
    // Exibir código para o usuário digitar no WhatsApp
}
```

### 4. Usuário digita código no WhatsApp
O usuário abre o WhatsApp no celular e vai em:
- Configurações → Dispositivos vinculados → Vincular dispositivo → Código de pareamento
- Digita o código exibido no frontend

### 5. Frontend monitora status da conexão
```javascript
// Verificar status periodicamente
const checkStatus = async () => {
    const statusResponse = await fetch(`${result.containerUrl}/status`);
    const status = statusResponse.json();
    
    if (status.status === 'open') {
        console.log('WhatsApp conectado com sucesso!');
        // Parar polling
    } else if (status.status === 'connecting') {
        // Continuar monitorando
        setTimeout(checkStatus, 5000);
    }
};

checkStatus();
```

### 6. Verificar status via API do servidor
```javascript
// Verificar status via endpoint do servidor
const pairingStatus = await fetch(`/docker/pairing/${churchId}/status`);
const status = await pairingStatus.json();

console.log('Status:', status.status);
console.log('Pairing Code:', status.pairingCode);
console.log('QR Code:', status.qrCode);
```
// Polling automático para verificar status
setInterval(async () => {
    const status = await fetch(`${result.containerUrl}/status`);
    // Atualizar UI baseado no status
}, 3000);
```

## Integração Automática

Quando uma nova igreja é criada através do endpoint `/church/add`, o sistema automaticamente:

1. Cria a igreja no banco de dados
2. Cria o perfil do administrador
3. Cria a assinatura
4. **Inicia automaticamente o container Docker para a igreja**

A resposta incluirá informações sobre o container Docker:

```json
{
    "subscriptionId": "sub_123",
    "dockerContainer": {
        "success": true,
        "message": "Container iniciado com sucesso",
        "containerName": "zapbless-whatsapp-church_123",
        "port": 3456,
        "containerId": "abc123def456"
    }
}
```

## Portas

Cada igreja recebe uma porta única calculada com base no `churchId`. As portas começam em 3001 e são distribuídas de forma determinística para evitar conflitos.

## Nomenclatura dos Containers

Os containers seguem o padrão: `zapbless-whatsapp-{churchId}`

Exemplo: `zapbless-whatsapp-church_123`

## Variáveis de Ambiente

Cada container recebe as seguintes variáveis de ambiente:

- `CHURCH_ID`: ID da igreja
- `NODE_ENV`: production

## Tratamento de Erros

Todos os endpoints retornam respostas padronizadas:

**Sucesso:**
```json
{
    "success": true,
    "message": "Operação realizada com sucesso",
    // ... dados adicionais
}
```

**Erro:**
```json
{
    "success": false,
    "message": "Descrição do erro",
    "error": "Detalhes técnicos do erro"
}
```

## Monitoramento

Para monitorar os containers, você pode usar:

```bash
# Listar todos os containers ZapBless
docker ps --filter "name=zapbless-whatsapp"

# Ver logs de um container específico
docker logs zapbless-whatsapp-church_123

# Ver estatísticas de uso
docker stats zapbless-whatsapp-church_123
``` 