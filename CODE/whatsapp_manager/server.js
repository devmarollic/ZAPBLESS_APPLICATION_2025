/**
 * WhatsApp Session Server
 * 
 * Este servidor gerencia uma única sessão do WhatsApp por container Docker.
 * Expõe APIs para conectar, enviar mensagens e gerenciar a sessão.
 * Implementação independente usando diretamente a biblioteca Baileys.
 */

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');
const WhatsAppManager = require('./whatsapp');

// Configurações
const PORT = process.env.PORT || 1234;
const SESSION_ID = process.env.SESSION_ID || `session-${Date.now()}`;
const SESSION_DIR = process.env.SESSION_DIR || './data';
const DEBUG = process.env.DEBUG === 'true';

// Inicializa o gerenciador WhatsApp
const whatsapp = new WhatsAppManager({
  sessionDir: SESSION_DIR,
  sessionId: SESSION_ID,
  debug: DEBUG
});

// Inicializa o servidor Express
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Variáveis de estado
let qrCodePath = null;

// Configura eventos do WhatsApp
whatsapp.on('qr', async (qr) => {
  try {
    console.log('Novo QR code recebido');
    
    // Cria o diretório para o QR code se não existir
    const qrDir = path.join(__dirname, 'public', 'qr');
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }
    
    // Salva o QR code como imagem
    qrCodePath = path.join(qrDir, `qr-${Date.now()}.png`);
    await qrcode.toFile(qrCodePath, qr);
    
    console.log(`QR code salvo em ${qrCodePath}`);
  } catch (error) {
    console.error('Erro ao processar QR code:', error);
  }
});

whatsapp.on('connection', ({ status }) => {
  console.log(`Status da conexão alterado para: ${status}`);
  
  // Se conectado, remove o QR code
  if (status === 'open' && qrCodePath) {
    try {
      if (fs.existsSync(qrCodePath)) {
        fs.unlinkSync(qrCodePath);
      }
      qrCodePath = null;
    } catch (error) {
      console.error('Erro ao remover QR code:', error);
    }
  }
});

whatsapp.on('message', (message) => {
  console.log('Nova mensagem recebida:', message.key.remoteJid);
});

// Middleware para verificar se o WhatsApp está conectado
const checkConnection = (req, res, next) => {
  const state = whatsapp.getConnectionState();
  if (state.state === 'open') {
    next();
  } else {
    res.status(403).json({ 
      error: 'WhatsApp não está conectado',
      state: state.state
    });
  }
};

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para obter status da sessão
app.get('/status', (req, res) => {
  try {
    const state = whatsapp.getConnectionState();
    
    res.json({
      sessionId: SESSION_ID,
      status: state.state,
      qrCode: qrCodePath ? `/qr/${path.basename(qrCodePath)}` : null,
      hasSession: state.hasSession
    });
  } catch (error) {
    console.error('Erro ao obter status:', error);
    res.status(500).json({ error: 'Erro ao obter status' });
  }
});

// Rota para iniciar a sessão
app.post('/start', async (req, res) => {
  try {
    console.log('Iniciando sessão do WhatsApp...');
    
    // Verifica se já está conectado
    const state = whatsapp.getConnectionState();
    if (state.state === 'open') {
      return res.json({ 
        success: true, 
        status: 'connected',
        message: 'WhatsApp já está conectado'
      });
    }
    
    // Inicia a conexão
    await whatsapp.connect();
    
    res.json({
      success: true,
      status: whatsapp.getConnectionState().state,
      qrCode: qrCodePath ? `/qr/${path.basename(qrCodePath)}` : null
    });
  } catch (error) {
    console.error('Erro ao iniciar sessão:', error);
    res.status(500).json({ error: 'Erro ao iniciar sessão' });
  }
});

// Rota para enviar mensagem de texto
app.post('/send/text', checkConnection, async (req, res) => {
  try {
    const { to, text } = req.body;
    
    if (!to || !text) {
      return res.status(400).json({ error: 'Parâmetros "to" e "text" são obrigatórios' });
    }
    
    const result = await whatsapp.sendText(to, text);
    res.json(result);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

// Rota para enviar mensagem de mídia
app.post('/send/media', checkConnection, async (req, res) => {
  try {
    const { to, mediaType, mediaUrl, caption } = req.body;
    
    if (!to || !mediaType || !mediaUrl) {
      return res.status(400).json({ 
        error: 'Parâmetros "to", "mediaType" e "mediaUrl" são obrigatórios' 
      });
    }
    
    const result = await whatsapp.sendMedia(to, mediaType, mediaUrl, caption || '');
    res.json(result);
  } catch (error) {
    console.error('Erro ao enviar mídia:', error);
    res.status(500).json({ error: 'Erro ao enviar mídia' });
  }
});

// Rota para verificar número
app.post('/check/number', checkConnection, async (req, res) => {
  try {
    const { number } = req.body;
    
    if (!number) {
      return res.status(400).json({ error: 'Parâmetro "number" é obrigatório' });
    }
    
    const result = await whatsapp.checkNumber(number);
    res.json(result);
  } catch (error) {
    console.error('Erro ao verificar número:', error);
    res.status(500).json({ error: 'Erro ao verificar número' });
  }
});

// Rota para desconectar
app.post('/disconnect', async (req, res) => {
  try {
    console.log('Desconectando sessão do WhatsApp...');
    
    const result = await whatsapp.disconnect();
    
    res.json({ 
      success: result, 
      status: whatsapp.getConnectionState().state 
    });
  } catch (error) {
    console.error('Erro ao desconectar:', error);
    res.status(500).json({ error: 'Erro ao desconectar' });
  }
});

// Rota para obter informações do usuário
app.get('/user/info', checkConnection, async (req, res) => {
  try {
    const userInfo = await whatsapp.getUserInfo();
    res.json(userInfo);
  } catch (error) {
    console.error('Erro ao obter informações do usuário:', error);
    res.status(500).json({ error: 'Erro ao obter informações do usuário' });
  }
});

// Inicia o servidor
app.listen(PORT, async () => {
  console.log(`Servidor WhatsApp rodando na porta ${PORT}`);
  console.log(`ID da sessão: ${SESSION_ID}`);
  console.log(`Diretório da sessão: ${SESSION_DIR}`);
  
  // Verifica se já existe uma sessão salva
  const state = whatsapp.getConnectionState();
  if (state.hasSession) {
    console.log('Sessão existente encontrada, tentando reconectar...');
    
    // Tenta iniciar a sessão automaticamente
    try {
      setTimeout(async () => {
        await whatsapp.connect();
      }, 2000);
    } catch (error) {
      console.error('Erro ao reconectar sessão automaticamente:', error);
    }
  }
});

// Cria uma página HTML simples para visualizar o status
const indexHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WhatsApp Session Manager</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .status {
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .open { background-color: #d4edda; color: #155724; }
    .connecting { background-color: #fff3cd; color: #856404; }
    .disconnected { background-color: #f8d7da; color: #721c24; }
    .qr-container {
      margin: 20px 0;
      text-align: center;
    }
    .qr-code {
      max-width: 300px;
      margin: 0 auto;
    }
    button {
      padding: 10px 15px;
      margin: 5px;
      cursor: pointer;
    }
    .actions {
      margin: 20px 0;
    }
    .send-form {
      margin-top: 30px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    input, textarea {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h1>WhatsApp Session Manager</h1>
  
  <div id="status" class="status">Carregando status...</div>
  
  <div id="qr-container" class="qr-container" style="display: none;">
    <h2>Escaneie o QR Code</h2>
    <img id="qr-code" class="qr-code" src="" alt="QR Code">
  </div>
  
  <div class="actions">
    <button id="start-btn">Iniciar Sessão</button>
    <button id="disconnect-btn">Desconectar</button>
    <button id="refresh-btn">Atualizar Status</button>
  </div>
  
  <div class="send-form">
    <h2>Enviar Mensagem</h2>
    <div>
      <label for="to">Número (com código do país, ex: 5511999999999):</label>
      <input type="text" id="to" placeholder="5511999999999">
    </div>
    <div>
      <label for="message">Mensagem:</label>
      <textarea id="message" rows="4" placeholder="Digite sua mensagem"></textarea>
    </div>
    <button id="send-btn">Enviar</button>
  </div>

  <script>
    // Elementos DOM
    const statusEl = document.getElementById('status');
    const qrContainer = document.getElementById('qr-container');
    const qrCode = document.getElementById('qr-code');
    const startBtn = document.getElementById('start-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const sendBtn = document.getElementById('send-btn');
    
    // Atualiza o status
    async function updateStatus() {
      try {
        const response = await fetch('/status');
        const data = await response.json();
        
        // Atualiza o elemento de status
        statusEl.textContent = "Sessao: " + data.sessionId + " | Status: " + data.status;
        statusEl.className = 'status ' + data.status;
        
        // Exibe o QR code se disponível
        if (data.qrCode && data.status === 'connecting') {
          qrContainer.style.display = 'block';
          qrCode.src = data.qrCode + '?t=' + Date.now(); // Evita cache
        } else {
          qrContainer.style.display = 'none';
        }
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
        statusEl.textContent = 'Erro ao carregar status';
        statusEl.className = 'status disconnected';
      }
    }
    
    // Inicia a sessão
    async function startSession() {
      try {
        startBtn.disabled = true;
        statusEl.textContent = 'Iniciando sessão...';
        
        const response = await fetch('/start', { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
          updateStatus();
        } else {
          statusEl.textContent = 'Erro ao iniciar sessão: ' + (data.error || 'Desconhecido');
        }
      } catch (error) {
        console.error('Erro ao iniciar sessão:', error);
        statusEl.textContent = 'Erro ao iniciar sessão';
      } finally {
        startBtn.disabled = false;
      }
    }
    
    // Desconecta a sessão
    async function disconnect() {
      try {
        disconnectBtn.disabled = true;
        statusEl.textContent = 'Desconectando...';
        
        const response = await fetch('/disconnect', { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
          updateStatus();
        } else {
          statusEl.textContent = 'Erro ao desconectar: ' + (data.error || 'Desconhecido');
        }
      } catch (error) {
        console.error('Erro ao desconectar:', error);
        statusEl.textContent = 'Erro ao desconectar';
      } finally {
        disconnectBtn.disabled = false;
      }
    }
    
    // Envia mensagem
    async function sendMessage() {
      const to = document.getElementById('to').value;
      const message = document.getElementById('message').value;
      
      if (!to || !message) {
        alert('Preencha o número e a mensagem');
        return;
      }
      
      try {
        sendBtn.disabled = true;
        
        const response = await fetch('/send/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, text: message })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          alert('Mensagem enviada com sucesso!');
          document.getElementById('message').value = '';
        } else {
          alert('Erro ao enviar mensagem: ' + (data.error || 'Desconhecido'));
        }
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        alert('Erro ao enviar mensagem');
      } finally {
        sendBtn.disabled = false;
      }
    }
    
    // Event listeners
    startBtn.addEventListener('click', startSession);
    disconnectBtn.addEventListener('click', disconnect);
    refreshBtn.addEventListener('click', updateStatus);
    sendBtn.addEventListener('click', sendMessage);
    
    // Atualiza o status inicialmente
    updateStatus();
    
    // Atualiza o status a cada 10 segundos
    setInterval(updateStatus, 10000);
  </script>
</body>
</html>
`;

// Cria o arquivo index.html
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml); 