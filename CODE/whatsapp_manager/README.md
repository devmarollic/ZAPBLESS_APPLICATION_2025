# WhatsApp Session Docker

Este projeto fornece uma solução para executar instâncias isoladas do WhatsApp em containers Docker, onde cada container gerencia uma única sessão do WhatsApp. A implementação usa diretamente a biblioteca [Baileys](https://github.com/WhiskeySockets/Baileys) para comunicação com o WhatsApp, sem depender de APIs externas.

## Características

- **Uma sessão por container**: Cada container Docker gerencia exatamente uma sessão do WhatsApp
- **Implementação independente**: Usa diretamente a biblioteca Baileys, sem depender de APIs externas
- **Persistência de sessão**: A sessão é mantida mesmo após reiniciar o container
- **Reconexão automática**: Tentativas automáticas de reconexão em caso de desconexão
- **API HTTP**: Endpoints RESTful para enviar mensagens e gerenciar a sessão
- **Interface web**: Página web simples para visualizar o status da sessão e o QR code
- **Pairing Code**: Conexão alternativa por código numérico (8 dígitos)
- **Integração com RabbitMQ**: Consumo de mensagens da fila outbound para envio automático

## Requisitos

- Docker e Docker Compose
- Node.js 14+ (para desenvolvimento local)
- RabbitMQ (incluído no docker-compose)

## Instalação

### Desenvolvimento Local

1. Clone este repositório:

```bash
git clone https://github.com/seu-usuario/whatsapp-session-docker.git
cd whatsapp-session-docker
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o ambiente:

```bash
# Configuração interativa
npm run setup

# Ou configure manualmente
cp env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute o diagnóstico:

```bash
npm run diagnose
```

5. Inicie o servidor:

```bash
npm start
```

### Docker

1. Configure as variáveis de ambiente no arquivo `docker-compose.yml`:

```yaml
environment:
  - PORT=1234
  - SESSION_ID=whatsapp-session-1
  - SESSION_DIR=/app/data/sessions
  - DEBUG=false
  - RABBITMQ_URL=amqp://rabbitmq:5672
  - RABBITMQ_OUTBOUND_QUEUE=zapbless.outbound
  - RABBITMQ_INBOUND_QUEUE=zapbless.inbound
  - CHURCH_ID=sua-igreja-id
```

2. Inicie o container:

```bash
docker-compose up -d
```

## Uso

### Interface Web

Acesse a interface web em `http://localhost:1234` para:

- Visualizar o status da sessão
- Escolher entre QR Code ou Pairing Code
- Escanear o QR code para conectar
- Gerar código de pareamento para conexão por número
- Enviar mensagens de teste
- Desconectar a sessão

#### Modos de Conexão

1. **QR Code**: Escaneie o código QR com o WhatsApp do celular
2. **Pairing Code**: Digite um código de 8 dígitos no WhatsApp do celular

Para mais detalhes sobre o Pairing Code, consulte [PAIRING_CODE_README.md](PAIRING_CODE_README.md).

### API HTTP

A API expõe os seguintes endpoints:

#### Status da Sessão

```
GET /status
```

Retorna o status atual da sessão do WhatsApp.

#### Iniciar Sessão

```
POST /start
```

Inicia a sessão do WhatsApp e gera um QR code para conexão.

#### Solicitar Pairing Code

```
POST /pairing-code
Content-Type: application/json

{
  "phoneNumber": "5511999999999"
}
```

Solicita um código de pareamento para um número específico. O código será gerado apenas quando a conexão estiver pronta.

**Resposta:**
```json
{
  "success": true,
  "pairingCode": "12345678",
  "message": "Pairing code gerado com sucesso"
}
```

**Nota:** Esta é a forma recomendada de solicitar pairing code, pois aguarda a conexão estar pronta antes de tentar gerar o código.

#### Iniciar Sessão com Pairing Code (Legado)

```
POST /start
Content-Type: application/json

{
  "phoneNumber": "5511999999999"
}
```

Inicia a sessão com um número específico e gera um código de pareamento (método legado, use `/pairing-code` para melhor controle).

#### Enviar Mensagem de Texto

```
POST /send/text
Content-Type: application/json

{
  "to": "5511999999999",
  "text": "Olá, esta é uma mensagem de teste!"
}
```

#### Enviar Mensagem com Mídia

```
POST /send/media
Content-Type: application/json

{
  "to": "5511999999999",
  "mediaType": "image",
  "mediaUrl": "https://exemplo.com/imagem.jpg",
  "caption": "Legenda da imagem"
}
```

#### Verificar Número

```
POST /check/number
Content-Type: application/json

{
  "number": "5511999999999"
}
```

#### Desconectar Sessão

```
POST /disconnect
```

Desconecta a sessão do WhatsApp.

#### Obter Informações do Usuário

```
GET /user/info
```

Retorna informações sobre o usuário conectado.

### Integração com RabbitMQ

O serviço consome mensagens da fila `zapbless.outbound` no RabbitMQ e processa automaticamente as mensagens destinadas à instância específica (identificada pelo `churchId`).

Além disso, todas as mensagens recebidas pelo WhatsApp são publicadas na fila `zapbless.inbound` para processamento por outros serviços.

#### Formato das Mensagens

**Mensagens Outbound (para envio):**

Para enviar mensagens de texto:

```json
{
  "churchId": "sua-igreja-id",
  "type": "text",
  "to": "5511999999999",
  "text": "Olá, esta é uma mensagem enviada via RabbitMQ!"
}
```

Para enviar mensagens com mídia:

```json
{
  "churchId": "sua-igreja-id",
  "type": "media",
  "to": "5511999999999",
  "mediaType": "image",
  "mediaUrl": "https://exemplo.com/imagem.jpg",
  "caption": "Legenda da imagem"
}
```

**Mensagens Inbound (recebidas):**

Exemplo de mensagem de texto recebida:

```json
{
  "churchId": "sua-igreja-id",
  "messageId": "ABCDEF123456",
  "timestamp": 1617984512000,
  "from": "5511999999999",
  "pushName": "Nome do Contato",
  "type": "text",
  "content": "Olá, esta é uma mensagem recebida!"
}
```

Exemplo de mensagem de mídia recebida:

```json
{
  "churchId": "sua-igreja-id",
  "messageId": "ABCDEF123456",
  "timestamp": 1617984512000,
  "from": "5511999999999",
  "pushName": "Nome do Contato",
  "type": "image",
  "content": "",
  "caption": "Legenda da imagem",
  "mediaUrl": "https://exemplo.com/imagem-recebida.jpg"
}
```

## Múltiplas Instâncias

Para executar múltiplas sessões do WhatsApp, você pode:

1. Duplicar o serviço `whatsapp-session` no arquivo `docker-compose.yml` com nomes e portas diferentes:

```yaml
whatsapp-session-2:
  build:
    context: .
    dockerfile: Dockerfile
  container_name: whatsapp-session-2
  ports:
    - "1235:1234"
  volumes:
    - whatsapp-data-2:/app/data
  environment:
    - PORT=1234
    - SESSION_ID=whatsapp-session-2
    - SESSION_DIR=/app/data/sessions
    - DEBUG=false
    - RABBITMQ_URL=amqp://rabbitmq:5672
    - RABBITMQ_OUTBOUND_QUEUE=zapbless.outbound
    - RABBITMQ_INBOUND_QUEUE=zapbless.inbound
    - CHURCH_ID=igreja-id-2
  depends_on:
    - rabbitmq
  networks:
    - whatsapp-network
```

2. Adicionar o novo volume:

```yaml
volumes:
  whatsapp-data:
  whatsapp-data-2:
  rabbitmq-data:
```

## Scripts Disponíveis

### Desenvolvimento
- `npm start` - Inicia o servidor
- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run setup` - Configuração interativa do ambiente

### Diagnóstico e Solução de Problemas
- `npm run diagnose` - Diagnóstico completo da conexão
- `npm run diagnose:test` - Teste específico de conectividade
- `npm run session:list` - Lista todas as sessões
- `npm run session:clear <nome>` - Remove uma sessão específica
- `npm run session:clear-all` - Remove todas as sessões
- `npm run session:info <nome>` - Mostra informações de uma sessão
- `npm run session:backup <nome>` - Cria backup de uma sessão
- `npm run session:restore <caminho>` - Restaura sessão do backup

### Testes
- `npm test` - Executa testes de pairing code
- `npm run test:pairing` - Testa funcionalidade de pairing code
- `npm run test:pairing-fix` - Testa correção do pairing code
- `npm run test:pairing-fix:all` - Testa todos os cenários de pairing code
- `npm run test:pairing-fix:error` - Testa cenário de erro
- `npm run test:pairing-fix:reconnection` - Testa cenário de reconexão
- `npm run test:connection` - Testa conectividade
- `npm run test:status` - Testa status da sessão
- `npm run test:monitor` - Monitora sessão em tempo real
- `npm run test:send` - Testa envio de mensagens
- `npm run test:full` - Executa todos os testes

## 🔧 Solução de Problemas

Para problemas de conexão e funcionamento, consulte o [Guia de Solução de Problemas](TROUBLESHOOTING.md).

### Problemas Comuns

1. **Erro de Conexão WebSocket**
   ```bash
   npm run diagnose
   npm run session:clear-all
   npm start
   ```

2. **Sessão Corrompida**
   ```bash
   npm run session:list
   npm run session:clear <nome_da_sessao>
   ```

3. **Problemas de Rede**
   ```bash
   npm run diagnose:test
   ```

4. **Configuração de Ambiente**
   ```bash
   npm run setup
   ```

## Desenvolvimento Local

Para executar o projeto localmente sem Docker:

1. Instale as dependências:

```bash
npm install
```

2. Configure o ambiente:

```bash
# Configuração interativa
npm run setup

# Ou configure manualmente
export PORT=1234
export SESSION_ID=whatsapp-session-local
export SESSION_DIR=./data/sessions
export DEBUG=true
export RABBITMQ_URL=amqp://localhost:5672
export RABBITMQ_OUTBOUND_QUEUE=zapbless.outbound
export RABBITMQ_INBOUND_QUEUE=zapbless.inbound
export CHURCH_ID=sua-igreja-id
```

3. Execute o servidor:

```bash
npm start
```

## Bibliotecas e Dependências

- [Baileys](https://github.com/WhiskeySockets/Baileys) - Biblioteca para comunicação com o WhatsApp
- [Express](https://expressjs.com/) - Framework web para Node.js
- [QRCode](https://www.npmjs.com/package/qrcode) - Geração de QR codes
- [amqplib](https://www.npmjs.com/package/amqplib) - Cliente RabbitMQ para Node.js

## Licença

MIT 