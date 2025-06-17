import { OpenAI } from 'openai';
import { chatbotPrompts } from './chatbot_prompts.js';

// configure a chave da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Gera resposta do chatbot com base em uma intenção e entrada do usuário.
 * @param {string} intent - Identificador da ação (ex: create_event)
 * @param {string} userInput - Texto recebido do WhatsApp
 * @param {object} context - Dados do usuário, igreja, permissões, etc.
 * @returns {string} - Resposta gerada
 */
export async function handleChatIntent(intent, userInput, context = {}) {
  const systemPrompt = chatbotPrompts[intent] || chatbotPrompts.fallback;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userInput },
  ];

  // Insere contexto como JSON se existir
  if (Object.keys(context).length > 0) {
    messages.push({
      role: 'system',
      content: `Dados adicionais disponíveis: ${JSON.stringify(context)}`,
    });
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0.4,
  });

  return response.choices[0]?.message?.content?.trim();
}
