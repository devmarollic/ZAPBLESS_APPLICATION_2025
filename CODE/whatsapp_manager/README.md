# WhatsApp Session Docker

Este projeto fornece uma solução para executar instâncias isoladas do WhatsApp em containers Docker, onde cada container gerencia uma única sessão do WhatsApp. A implementação usa diretamente a biblioteca [Baileys](https://github.com/WhiskeySockets/Baileys) para comunicação com o WhatsApp, sem depender de APIs externas.

## Características

- **Uma sessão por container**: Cada container Docker gerencia exatamente uma sessão do WhatsApp
- **Implementação independente**: Usa diretamente a biblioteca Baileys, sem depender de APIs externas
- **Persistência de sessão**: A sessão é mantida mesmo após reiniciar o container
- **Reconexão automática**: Tentativas automáticas de reconexão em caso de desconexão
- **API HTTP**: Endpoints RESTful para enviar mensagens e gerenciar a sessão
- **Interface web**: Página web simples para visualizar o status da sessão e o QR code

## Requisitos

- Docker e Docker Compose
- Node.js 14+ (para desenvolvimento local)

## Instalação

1. Clone este repositório:

```bash
git clone https://github.com/seu-usuario/whatsapp-session-docker.git
cd whatsapp-session-docker
```

2. Configure as variáveis de ambiente no arquivo `docker-compose.yml`:

```yaml
environment:
  - PORT=1234
  - SESSION_ID=whatsapp-session-1
  - SESSION_DIR=/app/data/sessions
  - DEBUG=false
```

3. Inicie o container:

```bash
docker-compose up -d
```

## Uso

### Interface Web

Acesse a interface web em `http://localhost:1234` para:

- Visualizar o status da sessão
- Escanear o QR code para conectar
- Enviar mensagens de teste
- Desconectar a sessão

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
  networks:
    - whatsapp-network
```

2. Adicionar o novo volume:

```yaml
volumes:
  whatsapp-data:
  whatsapp-data-2:
```

## Desenvolvimento Local

Para executar o projeto localmente sem Docker:

1. Instale as dependências:

```bash
npm install
```

2. Execute o servidor:

```bash
node server.js
```

## Bibliotecas e Dependências

- [Baileys](https://github.com/WhiskeySockets/Baileys) - Biblioteca para comunicação com o WhatsApp
- [Express](https://expressjs.com/) - Framework web para Node.js
- [QRCode](https://www.npmjs.com/package/qrcode) - Geração de QR codes

## Licença

MIT 