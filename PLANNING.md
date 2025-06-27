# ZapBless – PLANEJAMENTO DO PROJETO

## 🧭 Visão Geral

ZapBless é uma plataforma de gerenciamento para igrejas com foco em comunicação inteligente via WhatsApp. A aplicação permite organização de eventos, escalas de voluntariado, lembretes automatizados e envio de mensagens personalizadas por canais como WhatsApp, e-mail e SMS (futuro). O sistema será inicialmente um monólito modularizado, já preparado para migração futura para microserviços.

---

## ⚙️ Tecnologias e Stack

- **Backend:** Node.js + Fastify
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth (JWT com claims customizados)
- **Mensageria:** RabbitMQ (Inbound/Outbound/Watchdog)
- **Agendamento:** Node-cron
- **Sessões WhatsApp:** WhatsApp-web.js com Docker por igreja
- **Armazenamento:** Supabase Storage
- **Email/SMS (futuro):** SMTP ou serviços externos
- **Frontend:** (Fora de escopo por agora)

---

## 📦 Módulos Principais

1. **Auth**
2. **Usuários e Perfis**
3. **Igrejas e permissões (roles)**
4. **Assinaturas e planos**
5. **Eventos com recorrência infinita**
6. **Escalas de voluntariado**
7. **Ministérios**
8. **Lembretes**
9. **Mensageria e notificações**
10. **WhatsApp + fallback**
11. **Templates de mensagens**
12. **Chatbot**

---

## 🔐 Segurança e Acesso

- Um perfil pode pertencer a múltiplas igrejas
- A sessão ativa deve carregar `currentChurchId` no JWT
- Todas as ações precisam validar `USER_CHURCH_ROLE`
- Middlewares garantirão que apenas admins possam executar ações administrativas

---

## 🔄 Comunicação entre Módulos

| Origem             | Destino             | Meio        |
|--------------------|---------------------|-------------|
| Chatbot            | Eventos, Escalas    | Direto      |
| Cron (diário)      | Eventos             | Agendado    |
| Escalas            | Lembretes           | Interno     |
| Lembretes          | Mensageria          | Interno     |
| Mensageria         | RabbitMQ outbound   | MQ          |
| WhatsApp Session   | RabbitMQ inbound    | MQ          |
| Watchdog           | RabbitMQ watchdog   | MQ          |
| Fallback WhatsApp  | Mensageria          | Interno     |

---

## 📬 Canais suportados por plano

- Iniciante: Até 100 membros, Mensagens ilimitadas, 2 ministérios, Notificações de eventos, suporte por e-mmail
- Crescimento: Até 500 membros, Mensagens ilimitadas, 10 ministérios, Notificações de eventos, Mensagens personalizadas, Automações básicas, Suporte prioritário
- Comunidade: Membros ilimitados, Mensagens ilimitadas, Ministérios ilimitados, Todas as funcionalidades, Automações avançadas, Relatórios avançados, API personalizada, Gerente de sucesso dedicado
- Limites aplicados em middleware de verificação de plano

---

## 🧠 Fluxo de um Evento

1. Admin cria evento com recorrência
2. Cron gera próximas instâncias
3. Escala é gerada com base no ministério
4. Lembretes são agendados por perfil
5. Template é renderizado
6. Mensagem é enviada via WhatsApp

---

## 🧾 Estrutura Modular

app/
├── auth/
├── church/
├── profile/
├── subscription/
├── event/
├── scale/
├── ministry/
├── reminder/
├── whatsapp/
├── messaging/
├── chatbot/
├── shared/
core/
├── mq/
├── cron/
├── templates/
├── auth/


---

## 🔧 RabbitMQ Topics

- `zapbless.inbound` → entrada de mensagens WhatsApp
- `zapbless.outbound` → envio de mensagens
- `zapbless.watchdog` → sessão WhatsApp desconectada

---

## ✅ Objetivos de curto prazo

- Sistema funcional com criação de igrejas, eventos e lembretes
- Sessão WhatsApp funcionando por igreja
- Geração de escala e envio de lembretes automatizados

---

## 🎯 Futuro

- Suporte a e-mail e SMS
- Painel administrativo frontend
- Notificações push
- Internacionalização total
- Migração para microserviços (RabbitMQ e handlers isolados)
