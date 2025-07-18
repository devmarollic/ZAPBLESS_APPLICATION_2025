# ZapBless – Lista de Tarefas

---

## 🔐 Autenticação e Perfis

- [ ] Configurar Supabase Auth com JWT
- [ ] Criar tabela PROFILE com campos estendidos
- [ ] Implementar troca de igreja ativa (currentChurchId)
- [x] Criar endpoint para listar usuários da igreja com filtros (nome, email, status, roles) - 2025-01-30

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
- [x] Criar endpoint para atualizar dados da igreja (name, addressLine1, addressLine2, zipCode, neighborhood, cityCode, stateCode, countryCode) - 2025-01-30
- [x] Criar endpoint para atualizar dados do usuário (firstName, lastName, birthDate, genderId, phonePrefix, phoneNumber, countryCode, imagePath, documentType, documentNumber, aboutDescription) - 2025-01-30

---

## 💬 Sessões WhatsApp

- [x] Usar tabela WHATSAPP
- [x] Criar serviço de inicialização da sessão (Docker) - 2025-01-30
- [x] Implementar conexão por número (pairing code) - 2025-01-30
- [x] Corrigir erro "Connection Closed" no pairing code - 2025-01-30
- [x] Implementar sistema de diagnóstico e solução de problemas - 2025-01-30
- [x] Criar ferramentas de gerenciamento de sessões - 2025-01-30
- [x] Melhorar tratamento de erros de conexão WebSocket - 2025-01-30
- [x] Implementar reconexão automática com backoff exponencial - 2025-01-30
- [x] Criar configuração de proxy opcional - 2025-01-30
- [x] Adicionar scripts de configuração interativa - 2025-01-30
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
- [x] Implementar rota para excluir schedule - 2025-01-30
- [x] Implementar rota para mudar statusId do schedule - 2025-01-30

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
