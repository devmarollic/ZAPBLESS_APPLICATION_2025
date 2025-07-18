# Pairing Code - WhatsApp Manager

## 📱 Visão Geral

O WhatsApp Manager agora suporta conexão por **Pairing Code**, uma alternativa ao QR Code que permite conectar o WhatsApp usando um código numérico de 8 dígitos.

## 🔄 Modos de Conexão

### 1. QR Code (Padrão)
- Escaneie o QR Code com o WhatsApp do celular
- Método tradicional e mais comum

### 2. Pairing Code (Novo)
- Digite um código de 8 dígitos no WhatsApp do celular
- Útil quando QR Code não funciona ou para conexões remotas

## 🚀 Como Usar

### Interface Web

1. **Acesse o WhatsApp Manager**
   ```
   http://localhost:3001
   ```

2. **Escolha o Modo de Conexão**
   - Clique em "QR Code" ou "Por Número"
   - O modo ativo ficará destacado em azul

3. **Para Pairing Code:**
   - Digite o número de telefone (com código do país)
   - Exemplo: `5511999999999`
   - Clique em "Gerar Código de Pareamento"

4. **Use o Código no WhatsApp:**
   - Abra o WhatsApp no celular
   - Vá em **Configurações** → **Dispositivos vinculados**
   - Toque em **"Vincular dispositivo"**
   - Escolha **"Código de pareamento"**
   - Digite o código de 8 dígitos exibido

### API REST

#### Gerar Pairing Code
```bash
POST /start
Content-Type: application/json

{
  "phoneNumber": "5511999999999"
}
```

**Resposta:**
```json
{
  "success": true,
  "status": "connecting",
  "pairingCode": "123-456-789"
}
```

#### Verificar Status
```bash
GET /status
```

**Resposta:**
```json
{
  "sessionId": "church_123",
  "status": "connecting",
  "pairingCode": "123-456-789",
  "qrCode": "/qr/qr-church_123.png"
}
```

## ⏰ Timer de Expiração

- **Duração**: 2 minutos (120 segundos)
- **Exibição**: Timer visual no formato MM:SS
- **Expiração**: Código fica inválido após o tempo
- **Regeneração**: Botão para gerar novo código

## 🎨 Interface

### Elementos Visuais

- **Código de Pareamento**: Exibido em fonte monospace com espaçamento
- **Timer**: Contador regressivo em vermelho
- **Instruções**: Passo a passo para usar o código
- **Botões**: Gerar código e regenerar código expirado

### Estados

1. **Gerando**: Botão desabilitado com texto "Gerando..."
2. **Ativo**: Código exibido com timer funcionando
3. **Expirado**: Código marcado como "CÓDIGO EXPIRADO"
4. **Conectado**: Timer para e status muda para "open"

## 🧪 Teste

### Página de Teste
Acesse: `http://localhost:3001/examples/pairing_code_test.html`

**Funcionalidades de Teste:**
- ✅ Testar conexão com o Manager
- ✅ Gerar pairing code
- ✅ Verificar status da conexão
- ✅ Monitoramento automático
- ✅ Envio de mensagens de teste

### Exemplo de Uso
```javascript
// Gerar pairing code
const response = await fetch('/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phoneNumber: '5511999999999' })
});

const data = await response.json();
console.log('Pairing Code:', data.pairingCode);
```

## 🔧 Configuração

### Variáveis de Ambiente
```bash
CHURCH_ID=church_123
PORT=3001
DEBUG=true
```

### Dependências
- Node.js 16+
- Baileys (biblioteca WhatsApp)
- Express.js

## 🚨 Troubleshooting

### Problemas Comuns

1. **Código não é gerado**
   - Verifique se o número está no formato correto
   - Certifique-se de incluir o código do país (55 para Brasil)

2. **Código expira rapidamente**
   - O timer é de 2 minutos
   - Gere um novo código se necessário

3. **WhatsApp não aceita o código**
   - Verifique se o número está correto
   - Certifique-se de que o WhatsApp está atualizado
   - Tente gerar um novo código

4. **Erro de conexão**
   - Verifique se o container está rodando
   - Confirme a URL base no teste

### Logs
```bash
# Ver logs do container
docker logs zapbless-whatsapp-church_123

# Ver logs do WhatsApp Manager
tail -f /path/to/whatsapp-manager/logs
```

## 📋 Checklist de Implementação

- [x] Interface web com modos QR Code e Pairing Code
- [x] Geração de pairing code via API
- [x] Timer de expiração (2 minutos)
- [x] Regeneração de código expirado
- [x] Instruções visuais para o usuário
- [x] Página de teste completa
- [x] Documentação detalhada
- [x] Tratamento de erros
- [x] Validação de entrada

## 🔗 Links Úteis

- [Documentação Baileys](https://github.com/whiskeysockets/baileys)
- [WhatsApp Web](https://web.whatsapp.com)
- [API WhatsApp Business](https://developers.facebook.com/docs/whatsapp)

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do container
2. Use a página de teste para diagnóstico
3. Consulte a documentação do Baileys
4. Abra uma issue no repositório

---

**Versão**: 1.0.0  
**Data**: Janeiro 2025  
**Autor**: ZapBless Team 