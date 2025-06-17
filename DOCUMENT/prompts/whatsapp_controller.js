import { handleChatIntent } from '../services/llm_orchestrator.js';

export async function receiveWhatsappMessage(req, res) {
  const { from, message } = req.body;

  // Aqui você pode implementar uma lógica para detectar a intenção:
  const intent = await classifyUserMessage(message); // ex: "create_event", "church_info", etc

  // Buscar dados do usuário e da igreja no Supabase
  const context = await fetchContextFromSupabase(from); // dados úteis p/ LLM

  const reply = await handleChatIntent(intent, message, context);

  // Enviar mensagem de volta para o WhatsApp
  await sendWhatsappMessage(from, reply);

  res.send({ status: 'ok' });
}
