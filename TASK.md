# ZapBless – Lista de Tarefas

---

## 🔐 Autenticação e Perfis

- [ ] Configurar Supabase Auth com JWT
- [ ] Criar tabela PROFILE com campos estendidos
- [ ] Implementar troca de igreja ativa (currentChurchId)

---

## 🏛️ Igreja e Permissões

- [ ] Usar tabela CHURCH
- [ ] Usar USER_CHURCH_ROLE
- [ ] Middleware Fastify: verificar se perfil tem permissão na igreja

---

## 💳 Assinaturas

- [ ] Usar tabelas: PLAN, SUBSCRIPTION, SUBSCRIPTION_STATUS, SUBSCRIPTION_METHOD
- [ ] Criar endpoint para iniciar plano gratuito na criação da igreja
- [ ] Middleware para validar uso de recursos baseado no plano
- [x] Criar endpoint para visão geral da assinatura (plano atual, próxima cobrança, histórico de faturas) - 2025-01-30

---

## 💬 Sessões WhatsApp

- [ ] Usar tabela WHATSAPP
- [ ] Criar serviço de inicialização da sessão (Docker)
- [ ] Criar webhook para atualizar status
- [ ] Criar watchdog e publisher para tópico `zapbless.watchdog`
- [ ] Implementar fallback via ZapBless se sessão cair

---

## 🧾 Eventos

- [ ] Usar tabela EVENT e RECURRENCE
- [ ] Criar endpoint para evento com e sem recorrência
- [ ] Criar job (cron) para gerar instâncias futuras

---

## 👥 Ministérios e Escalas

- [ ] Criar tabelas MINISTRY, MINISTRY_MEMBER, MINISTRY_MEMBER_ROLE
- [ ] Implementar geração de escala excluindo ausentes
- [ ] Persistir escala e associar perfis

---

## ⏰ Lembretes

- [ ] Criar tabelas SCHEDULE, SCHEDULE_PROFILE
- [ ] Criar agendador para lembretes antes dos eventos
- [ ] Validar canal permitido (WhatsApp)

---

## 📨 Mensageria

- [ ] Criar produtor RabbitMQ para `zapbless.outbound`
- [ ] Criar consumer RabbitMQ para `zapbless.inbound`
- [ ] Enviar mensagens via WhatsApp Session
- [ ] Criar fallback caso sessão esteja offline

---

## 📋 Templates

- [ ] Criar tabela TEMPLATE com placeholders
- [ ] Implementar sistema de substituição dinâmica
- [ ] Vincular templates a tipo de mensagem e idioma

---

## 🤖 Chatbot

- [ ] Criar consumer do RabbitMQ inbound
- [ ] Implementar roteador de intents
- [ ] Integrar intents com eventos, escalas, lembretes

---

## 🧪 Testes & Auditoria

- [ ] Criar tabela AUDIT_LOG
- [ ] Registrar criação/edição de evento, escalas, lembretes
- [ ] Criar testes unitários por módulo

---

## 🧼 Infra

- [ ] Configurar RabbitMQ e conexão
- [ ] Configurar cron jobs (node-cron)
- [ ] Configurar Docker para WhatsApp sessions
- [ ] Configurar scripts de seed para planos e roles

---

## 🚀 Lançamento MVP

- [ ] Cadastro de igreja e usuário
- [ ] Eventos e lembretes
- [ ] Sessão WhatsApp integrada
- [ ] Geração e envio de escala
- [ ] Chatbot com pelo menos 2 intents básicas
- [x] Criar endpoint para retornar dados da igreja e usuário (nome, imagem, endereço, etc) - 2025-01-30
