/**
 * Exemplo de uso do WhatsAppManager
 * 
 * Este arquivo demonstra como usar a classe WhatsAppManager para
 * gerenciar uma sessão do WhatsApp diretamente com a biblioteca Baileys.
 */

const WhatsAppManager = require('./whatsapp');

// Configurações da sessão
const config = {
  sessionDir: './sessions',
  sessionId: 'exemplo-sessao',
  debug: true
};

// Inicializa o gerenciador
const whatsapp = new WhatsAppManager(config);

// Configura eventos
whatsapp.on('qr', (qr) => {
  console.log('QR Code recebido! Escaneie com seu WhatsApp:');
});

whatsapp.on('connection', ({ status }) => {
  console.log(`Status da conexão alterado para: ${status}`);
});

whatsapp.on('message', (message) => {
  console.log(`Nova mensagem recebida de: ${message.key.remoteJid}`);
  console.log(`Conteúdo: ${message.message?.conversation || '[Mídia ou outro tipo]'}`);
});

// Função principal assíncrona
async function main() {
  try {
    // Exemplo 1: Conectar ao WhatsApp
    console.log('Conectando ao WhatsApp...');
    console.log('Escaneie o QR code que aparecerá no terminal para conectar seu WhatsApp');
    await whatsapp.connect();
    
    // Aguarda alguns segundos para a conexão ser estabelecida
    console.log('\nAguardando conexão...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Exemplo 2: Verificar estado da conexão
    console.log('\nVerificando estado da conexão...');
    const connectionState = whatsapp.getConnectionState();
    console.log('Estado da conexão:', connectionState.state);
    
    // Se estiver conectado, continua com os exemplos
    if (connectionState.state === 'open') {
      // Exemplo 3: Obter informações do usuário
      console.log('\nObtendo informações do usuário...');
      const userInfo = await whatsapp.getUserInfo();
      console.log('Informações do usuário:', userInfo);
      
      // Exemplo 4: Verificar número
      console.log('\nVerificando número...');
      const numberToCheck = '5511999999999'; // Substitua pelo número que deseja verificar
      const checkResult = await whatsapp.checkNumber(numberToCheck);
      console.log('Resultado da verificação:', checkResult);
      
      // Exemplo 5: Enviar mensagem de texto
      if (checkResult.exists) {
        console.log('\nEnviando mensagem de texto...');
        await whatsapp.sendText(numberToCheck, 'Olá! Esta é uma mensagem de teste enviada pela API.');
        console.log('Mensagem enviada com sucesso!');
      }
      
      // Aguarda um pouco antes de desconectar
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Exemplo 6: Desconectar
      console.log('\nDesconectando do WhatsApp...');
      await whatsapp.disconnect();
      console.log('Desconectado com sucesso!');
    } else {
      console.log('Não foi possível conectar ao WhatsApp. Estado atual:', connectionState.state);
    }
    
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

// Executa o exemplo
main(); 