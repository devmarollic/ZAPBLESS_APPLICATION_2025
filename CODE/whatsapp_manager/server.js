/**
 * WhatsApp Session Server
 * 
 * Este servidor gerencia uma única sessão do WhatsApp por container Docker.
 * Expõe APIs para conectar, enviar mensagens e gerenciar a sessão.
 * Implementação independente usando diretamente a biblioteca Baileys.
 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import qrcode from 'qrcode';
// import WhatsAppManager from './whatsapp';
import { supabaseService } from './supabase_service.js';
import { contactService } from './contact_service.js';
import { RabbitMQService } from './rabbitmq_service.js';
import { whatsappService } from './whatsapp_service.js';
import { getSubstitutedText, sleep, getRandomDelay } from './utils.js';
import { SESSION_DIR, SESSION_ID, DEBUG, RABBITMQ_URL, RABBITMQ_OUTBOUND_QUEUE, RABBITMQ_INBOUND_QUEUE, RABBITMQ_DISCONNECTED_SESSIONS_QUEUE, CHURCH_ID, PORT } from './enviroment.js';
import { ProviderFiles } from './provider_file_service.js';
import { SupabaseRepository } from './supabase_repository.js';
import { WhatsAppManager } from './baileys_startup_service.js';
import { clearSession } from './clear_session.js';
import { WAMonitoringService } from './wamonitor_service.js';
import { EventManager } from './event_emitter.js';
import EventEmitter from 'events';

// Configurações

let providerFiles = new ProviderFiles();
let supabaseRepository = new SupabaseRepository();
let eventEmitter = new EventEmitter();
let waMonitor = new WAMonitoringService(
    eventEmitter,
    supabaseRepository,
    providerFiles   
);
let eventManager = new EventManager(supabaseRepository, waMonitor);

// Inicializa o gerenciador WhatsApp
let whatsappManager = new WhatsAppManager(
    supabaseRepository,
    providerFiles
);

function initWA() {
    waMonitor.loadInstance();
}

// Configura eventos do WhatsApp Manager
whatsappManager.eventEmitter.on('reconnect.failed', (instanceName) => {
    console.error(`Reconexão falhou para a instância: ${instanceName}`);
    // Aqui você pode implementar notificações ou ações específicas
    // como enviar alerta para administradores, etc.
});

whatsappManager.eventEmitter.on('logout.instance', (instanceName, reason) => {
    console.log(`Instância ${instanceName} fechada. Motivo: ${reason}`);
    // Aqui você pode implementar limpeza de recursos ou notificações
});

whatsappManager.eventEmitter.on('no.connection', (instanceName) => {
    console.error(`Sem conexão para a instância: ${instanceName}`);
    // Aqui você pode implementar ações quando não há conexão
});

// Inicializa o serviço RabbitMQ
const rabbitmq = new RabbitMQService(
    {
        url: RABBITMQ_URL,
        outboundQueue: RABBITMQ_OUTBOUND_QUEUE,
        inboundQueue: RABBITMQ_INBOUND_QUEUE,
        disconnectedSessionsQueue: RABBITMQ_DISCONNECTED_SESSIONS_QUEUE,
        churchId: CHURCH_ID
    }
);

// Inicializa o servidor Express
const app = express();
app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    exposedHeaders: '*',
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

// Função auxiliar para buscar template e substituir variáveis
async function getProcessedTemplateText(
    templateId,
    variables = {}
) {
    // Busca o template no Supabase
    let { data, error } = await supabaseService.getClient()
        .from('MESSAGE_TEMPLATE')
        .select('content')
        .eq('id', templateId)
        .single();

    if (error || !data || !data.content) {
        throw new Error('Template não encontrado');
    }

    // Substitui variáveis
    let processedText = getSubstitutedText(data.content, variables);
    return processedText;
}

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
    let status = whatsappManager.stateConnection.state;
    let reconnectAttempts = whatsappManager.reconnectAttempt || 0;
    let qrCodeInfo = whatsappManager.qrCode;

    res.json({
        status: status,
        reconnectAttempts: reconnectAttempts,
        qrCode: {
            hasCode: !!qrCodeInfo.code,
            count: qrCodeInfo.count || 0,
            pairingCode: qrCodeInfo.pairingCode
        },
        instance: {
            name: whatsappManager.instance.name,
            id: whatsappManager.instance.id,
            wuid: whatsappManager.instance.wuid
        },
        timestamp: new Date().toISOString()
    });
});

// Rota para obter status da sessão
app.get('/status', (req, res) => {
    try {
        const state = whatsappManager.qrCode;

        res.json(state);
    } catch (error) {
        console.error('Erro ao obter status:', error);
        res.status(500).json({ error: 'Erro ao obter status' });
    }
});

// Rota para iniciar a sessão
app.post('/start', async (req, res) => {
    try {
        console.log('Iniciando sessão do WhatsApp...');

        // Inicia a conexão
        await whatsappManager.connectToWhatsapp(process.env.CHURCH_NUMBER);

        res.json(whatsappManager.qrCode);
    } catch (error) {
        console.error('Erro ao iniciar sessão:', error);
        res.status(500).json({ error: 'Erro ao iniciar sessão' });
    }
});

// Rota para enviar mensagem de texto
app.post('/send/text', async (req, res) => {
    try {
        const { to, text, templateId, variables } = req.body;

        if (!to || (!text && !templateId)) {
            return res.status(400).json({ error: 'Parâmetros obrigatórios: "to" e "text" ou "templateId"' });
        }

        let finalText = text;
        if (templateId) {
            finalText = await getProcessedTemplateText(templateId, variables);
        }

        // Monta o payload para RabbitMQ
        let payload = {
            type: 'text',
            to,
            text: finalText
        };

        await rabbitmq.publishOutboundMessage(payload);
        res.json({ status: 'queued', to });
    } catch (error) {
        console.error('Erro ao enfileirar mensagem:', error);
        res.status(500).json({ error: 'Erro ao enfileirar mensagem' });
    }
});

// Rota para enviar mensagem de mídia
app.post('/send/media', async (req, res) => {
    try {
        const { to, mediaType, mediaUrl, caption, templateId, variables } = req.body;

        if (!to || !mediaType || !mediaUrl || (!caption && !templateId)) {
            return res.status(400).json({
                error: 'Parâmetros obrigatórios: "to", "mediaType", "mediaUrl" e "caption" ou "templateId"'
            });
        }

        let finalCaption = caption;
        if (templateId) {
            finalCaption = await getProcessedTemplateText(templateId, variables);
        }

        // Monta o payload para RabbitMQ
        let payload = {
            type: 'media',
            to,
            mediaType,
            mediaUrl,
            caption: finalCaption
        };

        await rabbitmq.publishOutboundMessage(payload);
        res.json({ status: 'queued', to });
    } catch (error) {
        console.error('Erro ao enfileirar mídia:', error);
        res.status(500).json({ error: 'Erro ao enfileirar mídia' });
    }
});

// Rota para verificar número
app.post('/check/number', async (req, res) => {
    try {
        const { number } = req.body;

        if (!number) {
            return res.status(400).json({ error: 'Parâmetro "number" é obrigatório' });
        }

        const result = await whatsappManager.checkNumber(number);
        res.json(result);
    } catch (error) {
        console.error('Erro ao verificar número:', error);
        res.status(500).json({ error: 'Erro ao verificar número' });
    }
});

// Rota para solicitar pairing code
app.post('/pairing-code', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Parâmetro "phoneNumber" é obrigatório' });
        }

        console.log('Solicitando pairing code para:', phoneNumber);

        // Formata o número
        let formattedNumber = phoneNumber.replace(/\D/g, '');
        if (!formattedNumber.startsWith('55')) {
            formattedNumber = '55' + formattedNumber;
        }

        // Solicita o pairing code
        const code = await whatsappManager.requestPairingCode(formattedNumber);

        res.json({
            success: true,
            pairingCode: code,
            message: code ? 'Pairing code gerado com sucesso' : 'Pairing code será gerado quando a conexão estiver pronta'
        });
    } catch (error) {
        console.error('Erro ao solicitar pairing code:', error);
        res.status(500).json({
            error: 'Erro ao solicitar pairing code',
            details: error.message
        });
    }
});

// Rota para desconectar
app.post('/disconnect', async (req, res) => {
    try {
        console.log('Desconectando sessão do WhatsApp...');

        await clearSession(CHURCH_ID);

        res.json({
            success: true,
            status: whatsappManager.stateConnection.state
        });
    } catch (error) {
        console.error('Erro ao desconectar:', error);
        res.status(500).json({ error: 'Erro ao desconectar' });
    }
});

// Rota para forçar reconexão
app.post('/reconnect', async (req, res) => {
    try {
        console.log('Forçando reconexão do WhatsApp...');

        // Reset reconnection counter
        whatsappManager.reconnectAttempt = 0;

        // Attempt to reconnect
        await whatsappManager.connectToWhatsapp(process.env.CHURCH_NUMBER);

        res.json({
            success: true,
            message: 'Tentativa de reconexão iniciada',
            status: whatsappManager.stateConnection.state
        });
    } catch (error) {
        console.error('Erro ao forçar reconexão:', error);
        res.status(500).json({
            error: 'Erro ao forçar reconexão',
            details: error.message
        });
    }
});

// Rota para obter informações do usuário
app.get('/user/info', async (req, res) => {
    try {
        const userInfo = await whatsappManager.getUserInfo();
        res.json(userInfo);
    } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
        res.status(500).json({ error: 'Erro ao obter informações do usuário' });
    }
});

// Rota para obter foto de perfil de um contato
app.get('/profile/picture/:number', async (req, res) => {
    try {
        const { number } = req.params;

        if (!number) {
            return res.status(400).json({ error: 'Número de telefone é obrigatório' });
        }

        const result = await whatsappManager.getProfilePicture(number);
        res.json(result);
    } catch (error) {
        console.error('Erro ao obter foto de perfil:', error);
        res.status(500).json({ error: 'Erro ao obter foto de perfil' });
    }
});

app.get('/health', (req, res) => {
    let status = whatsappManager.stateConnection.state;

    res.json({
        status: status
    });
});

// Função para processar mensagens recebidas do WhatsApp
function processIncomingMessage(message) {
    try {
        // Extrai o número de telefone do remetente
        const senderJid = message.key.remoteJid;
        const senderNumber = senderJid.replace(/\D/g, '');

        // Extrai o tipo de mensagem e conteúdo
        let messageType = 'unknown';
        let messageContent = null;
        let caption = null;
        let mediaUrl = null;

        // Verifica o tipo de mensagem
        if (message.message) {
            if (message.message.conversation) {
                messageType = 'text';
                messageContent = message.message.conversation;
            } else if (message.message.extendedTextMessage) {
                messageType = 'text';
                messageContent = message.message.extendedTextMessage.text;
            } else if (message.message.imageMessage) {
                messageType = 'image';
                messageContent = message.message.imageMessage.caption || '';
                caption = message.message.imageMessage.caption || '';
                mediaUrl = message.message.imageMessage.url || null;
            } else if (message.message.videoMessage) {
                messageType = 'video';
                messageContent = message.message.videoMessage.caption || '';
                caption = message.message.videoMessage.caption || '';
                mediaUrl = message.message.videoMessage.url || null;
            } else if (message.message.audioMessage) {
                messageType = 'audio';
                messageContent = '';
                mediaUrl = message.message.audioMessage.url || null;
            } else if (message.message.documentMessage) {
                messageType = 'document';
                messageContent = message.message.documentMessage.fileName || '';
                caption = message.message.documentMessage.caption || '';
                mediaUrl = message.message.documentMessage.url || null;
            } else if (message.message.stickerMessage) {
                messageType = 'sticker';
                messageContent = '';
                mediaUrl = message.message.stickerMessage.url || null;
            } else if (message.message.locationMessage) {
                messageType = 'location';
                messageContent = message.message.locationMessage.name || '';
                const lat = message.message.locationMessage.degreesLatitude;
                const long = message.message.locationMessage.degreesLongitude;
                messageContent = JSON.stringify({ name: messageContent, latitude: lat, longitude: long });
            } else if (message.message.contactMessage || message.message.contactsArrayMessage) {
                messageType = 'contact';
                messageContent = JSON.stringify(message.message.contactMessage || message.message.contactsArrayMessage);
            }
        }

        // Monta o objeto da mensagem processada
        const processedMessage = {
            messageId: message.key.id,
            timestamp: message.messageTimestamp * 1000, // Converte para milissegundos
            from: senderNumber,
            pushName: message.pushName || null,
            type: messageType,
            content: messageContent,
            rawMessage: message // Inclui a mensagem original para referência
        };

        // Adiciona campos específicos para mensagens de mídia
        if (mediaUrl) {
            processedMessage.mediaUrl = mediaUrl;
        }

        if (caption) {
            processedMessage.caption = caption;
        }

        return processedMessage;
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        // Retorna um objeto básico com a mensagem original em caso de erro
        return {
            error: true,
            errorMessage: error.message,
            rawMessage: message
        };
    }
}

// Função para processar mensagens do RabbitMQ
async function processOutboundMessage(message) {
    try {
        if (!message || !message.type) {
            console.error('Mensagem inválida recebida do RabbitMQ:', message);
            return;
        }

        if (message.to !== '5512981606045' && message.to !== '12981606045') {
            return;
        }

        // Verifica se o WhatsApp está conectado
        const state = whatsappManager.stateConnection.state;
        if (state.state !== 'open') {
            console.error('WhatsApp não está conectado. Não é possível enviar a mensagem.');
            throw new Error('WhatsApp não está conectado');
        }

        console.log(`Processando mensagem do tipo: ${message.type}`);

        await sleep(getRandomDelay(500, 1500));

        await whatsappManager.presenceSubscribe(message.to);
        await whatsappManager.sendPresenceUpdate('composing', message.to);
        await sleep(getRandomDelay(2000, 5000));
        await whatsappManager.sendPresenceUpdate('paused', message.to);

        switch (message.type) {
            case 'text':
                if (!message.to || !message.text) {
                    throw new Error('Campos "to" e "text" são obrigatórios para mensagens de texto');
                }
                let processedText = getSubstitutedText(message.text, message.variables);
                await whatsappManager.sendText(message.to, processedText);
                break;

            case 'media':
                if (!message.to || !message.mediaType || !message.mediaUrl) {
                    throw new Error('Campos "to", "mediaType" e "mediaUrl" são obrigatórios para mensagens de mídia');
                }
                await whatsappManager.sendMedia(message.to, message.mediaType, message.mediaUrl, message.caption || '');
                break;

            default:
                throw new Error(`Tipo de mensagem não suportado: ${message.type}`);
        }

        await sleep(getRandomDelay(800, 2500));

        console.log(`Mensagem enviada com sucesso para: ${message.to}`);
    } catch (error) {
        console.error('Erro ao processar mensagem do RabbitMQ:', error);
        throw error;
    }
}

// Configura eventos do RabbitMQ
rabbitmq.on('connected', async () => {
    console.log('RabbitMQ conectado. Iniciando consumo de mensagens...');
    try {
        await rabbitmq.consumeMessages(processOutboundMessage);
    } catch (error) {
        console.error('Erro ao iniciar consumo de mensagens:', error);
    }
});

rabbitmq.on('error', (error) => {
    console.error('Erro no RabbitMQ:', error);
});

// Inicia o servidor
app.listen(PORT, async () => {
    console.log(`Servidor WhatsApp rodando na porta ${PORT}`);
    console.log(`ID da sessão: ${SESSION_ID}`);
    console.log(`Diretório da sessão: ${SESSION_DIR}`);

    // Conecta ao RabbitMQ
    try {
        console.log('Conectando ao RabbitMQ...');
        await rabbitmq.connect();
        initWA();
    } catch (error) {
        console.error('Erro ao conectar ao RabbitMQ:', error);
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
        statusEl.textContent = "Sessao: " + data.instance.id + " | Status: " + data.stateConnection.state;
        statusEl.className = 'status ' + data.status;
        
        // Exibe o QR code se disponível
        if (data.qrCode && data.stateConnection.state === 'connecting') {
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
const publicDir = path.join('public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml);

// Configura manipuladores para encerramento gracioso
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

async function gracefulShutdown() {
    console.log('Encerrando servidor...');

    try {
        // Previne novas tentativas de reconexão
        whatsappManager.reconnectAttempt = 999; // Força parar reconexões

        // Fecha a conexão RabbitMQ
        await rabbitmq.close();
        console.log('Conexão RabbitMQ fechada');

        // Desconecta o WhatsApp
        await clearSession(CHURCH_ID);
        console.log('WhatsApp desconectado');

        process.exit(0);
    } catch (error) {
        console.error('Erro ao encerrar servidor:', error);
        process.exit(1);
    }
} 