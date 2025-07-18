# 🔧 Guia de Solução de Problemas - WhatsApp Manager

Este guia ajuda a resolver problemas comuns de conexão e funcionamento do WhatsApp Manager.

## 🚨 Problemas Comuns

### 1. Erro de Conexão WebSocket

**Sintoma:**
```
Error: Connection Failure
at WebSocketClient.<anonymous> (/app/node_modules/@whiskeysockets/baileys/lib/Socket/socket.js:529:13)
```

**Possíveis Causas:**
- Problemas de rede/proxy
- Firewall bloqueando conexões
- Rate limiting do WhatsApp
- Configuração incorreta do Baileys

**Soluções:**

#### A. Executar Diagnóstico
```bash
npm run diagnose
```

#### B. Testar Conectividade Específica
```bash
npm run diagnose:test
```

#### C. Verificar Configurações de Rede
```bash
# Testar DNS
nslookup web.whatsapp.com

# Testar conectividade HTTP
curl -I https://web.whatsapp.com
```

#### D. Limpar Sessão Corrompida
```bash
# Listar sessões
npm run session:list

# Limpar sessão específica
npm run session:clear <nome_da_sessao>

# Limpar todas as sessões
npm run session:clear-all
```

### 2. Timeout de Conexão

**Sintoma:**
```
Connection TimedOut, Reconnecting...
```

**Soluções:**
- Aumentar timeout de conexão no `connection_config.js`
- Verificar estabilidade da rede
- Usar proxy se necessário

### 3. Bad Session File

**Sintoma:**
```
Bad Session File, Please Delete and Scan Again
```

**Solução:**
```bash
# Limpar sessão corrompida
npm run session:clear <nome_da_sessao>

# Ou limpar todas as sessões
npm run session:clear-all
```

### 4. Rate Limiting

**Sintoma:**
- Muitas tentativas de reconexão
- Conexões sendo fechadas rapidamente

**Soluções:**
- Aguardar alguns minutos antes de tentar novamente
- Reduzir frequência de tentativas de reconexão
- Verificar se não há múltiplas instâncias rodando

## 🔍 Diagnóstico Detalhado

### Executar Diagnóstico Completo
```bash
npm run diagnose
```

Este comando verifica:
- ✅ Informações do sistema
- ✅ Configurações de conexão
- ✅ Conectividade de rede
- ✅ Resolução DNS
- ✅ Conectividade HTTP
- ✅ Variáveis de ambiente
- ✅ Dependências instaladas

### Teste de Conectividade Específica
```bash
npm run diagnose:test
```

Testa especificamente a conexão com `web.whatsapp.com`.

## 🛠️ Ferramentas de Manutenção

### Gerenciamento de Sessões

#### Listar Sessões
```bash
npm run session:list
```

#### Informações de uma Sessão
```bash
npm run session:info <nome_da_sessao>
```

#### Backup de Sessão
```bash
npm run session:backup <nome_da_sessao>
```

#### Restaurar Sessão
```bash
npm run session:restore <caminho_do_backup>
```

#### Limpar Sessão Específica
```bash
npm run session:clear <nome_da_sessao>
```

#### Limpar Todas as Sessões
```bash
npm run session:clear-all
```

## ⚙️ Configurações Avançadas

### Configuração de Proxy

Se você precisa usar proxy, configure as variáveis de ambiente:

```bash
export PROXY_HOST=proxy.exemplo.com
export PROXY_PORT=8080
export PROXY_USERNAME=usuario
export PROXY_PASSWORD=senha
```

E habilite o proxy no `connection_config.js`:
```javascript
useProxy: true
```

### Ajustar Timeouts

No arquivo `connection_config.js`, você pode ajustar:

```javascript
const CONNECTION_CONFIG = {
    connectTimeoutMs: 60000,    // Timeout de conexão
    qrTimeout: 40000,           // Timeout do QR code
    keepAliveIntervalMs: 30000, // Intervalo keep-alive
    retryRequestDelayMs: 2000,  // Delay entre tentativas
    maxReconnectAttempts: 5,    // Máximo de tentativas
    reconnectDelayMs: 2000,     // Delay base de reconexão
};
```

### Configuração de User Agent

Para melhorar a compatibilidade, você pode ajustar o user agent:

```javascript
browser: ['Chrome (Linux)', 'Chrome', '112.0.0.0']
```

## 🔄 Processo de Recuperação

### 1. Diagnóstico Inicial
```bash
npm run diagnose
```

### 2. Limpeza de Sessão (se necessário)
```bash
npm run session:clear-all
```

### 3. Reinicialização do Serviço
```bash
# Parar o serviço
docker stop <container_name>

# Iniciar novamente
docker start <container_name>
```

### 4. Verificação de Logs
```bash
docker logs <container_name> -f
```

### 5. Teste de Funcionamento
```bash
npm run test:connection
```

## 📊 Monitoramento

### Verificar Status da Conexão
```bash
curl http://localhost:3000/status
```

### Monitorar Logs em Tempo Real
```bash
docker logs <container_name> -f --tail 100
```

### Verificar Uso de Recursos
```bash
docker stats <container_name>
```

## 🚀 Otimizações

### 1. Configuração de Memória
```bash
docker run -m 512m <image_name>
```

### 2. Configuração de CPU
```bash
docker run --cpus=1.0 <image_name>
```

### 3. Configuração de Rede
```bash
docker run --network=host <image_name>
```

## 📞 Suporte

Se os problemas persistirem:

1. **Coletar Logs:**
   ```bash
   docker logs <container_name> > logs.txt
   ```

2. **Executar Diagnóstico:**
   ```bash
   npm run diagnose > diagnosis.txt
   ```

3. **Informações do Sistema:**
   ```bash
   docker info > system_info.txt
   ```

4. **Enviar os arquivos gerados para suporte técnico**

## 🔗 Links Úteis

- [Documentação do Baileys](https://github.com/whiskeysockets/baileys)
- [Problemas Conhecidos](https://github.com/whiskeysockets/baileys/issues)
- [Guia de Configuração](README.md)
- [Exemplos de Uso](examples/)

---

**Nota:** Sempre faça backup das sessões antes de limpar ou modificar configurações importantes. 