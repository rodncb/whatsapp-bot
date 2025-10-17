# 📅 Sistema de Follow-up Automático

**Status:** 🟡 Estrutura criada, aguardando ativação

---

## 📋 Visão Geral

Sistema automático para reengajar leads que não responderam ou não foram qualificados.

### 🎯 Objetivos

1. **Reengajar leads inativos** (não responderam no dia)
2. **Nutrir leads não qualificados** (renda baixa, idade alta)
3. **Aumentar taxa de conversão** através de follow-ups estratégicos

---

## 🔄 Fluxos de Follow-up

### 1️⃣ Follow-up de 7 dias (Lead inativo)

**Quando ativar:**

- Lead clicou no anúncio
- Bot enviou mensagem de boas-vindas
- Lead NÃO respondeu no mesmo dia

**Mensagem:**

```
Oi! 😊

Você clicou no nosso anúncio há alguns dias. Só queria verificar se ainda há interesse nos imóveis da região de Campos dos Goytacazes!

Temos ótimas opções com financiamento facilitado pela Caixa. Posso te ajudar? 🏠✨
```

### 2️⃣ Follow-up Mensal (Lead não qualificado)

**Quando ativar:**

- Lead foi desqualificado (renda < R$ 2.000 ou idade > 60)
- Enviar 1 mensagem por mês durante 6 meses

**Mensagem Mês 1:**

```
Olá! 😊

Me lembro que você se interessou pelos nossos imóveis.

Queria avisar que sempre surgem novas oportunidades e condições especiais! Se sua situação mudou ou você quer saber de novidades, estou aqui para ajudar! 🏠✨

Pode me chamar quando quiser!
```

**Mensagem Mês 2+:**

```
Oi! 😊

Tudo bem? Temos novidades nos imóveis de Campos dos Goytacazes!

Se quiser saber mais sobre as opções disponíveis ou se sua situação mudou, é só me chamar! 🏠

Estou sempre à disposição! ✨
```

---

## 💾 Estrutura do Banco de Dados

### Tabela: `contacts`

Novos campos adicionados:

```sql
- lead_source TEXT DEFAULT 'direct'           -- 'facebook_ad', 'direct', 'instagram_ad'
- is_ad_lead BOOLEAN DEFAULT 0                -- 1 se veio de anúncio
- follow_up_status TEXT DEFAULT 'pending'     -- 'pending', 'responded', 'qualified', 'unqualified'
- last_bot_response DATETIME                  -- Última vez que bot respondeu
```

### Tabela: `follow_ups`

```sql
CREATE TABLE follow_ups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone_number TEXT NOT NULL,
  scheduled_date DATETIME NOT NULL,          -- Data agendada para envio
  follow_up_type TEXT NOT NULL,              -- '7days', 'monthly'
  status TEXT DEFAULT 'pending',             -- 'pending', 'sent', 'cancelled'
  message_sent BOOLEAN DEFAULT 0,            -- 0 ou 1
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  sent_at DATETIME,
  FOREIGN KEY (phone_number) REFERENCES contacts(phone_number)
);
```

---

## 🛠️ Implementação Técnica

### Dependência necessária:

```bash
npm install node-cron
```

### Estrutura do código:

```javascript
// follow-up-scheduler.js
const cron = require("node-cron");
const conversationMemory = require("./conversation-memory");

// Roda a cada hora
cron.schedule("0 * * * *", async () => {
  const pendingFollowUps = conversationMemory.getPendingFollowUps();

  for (const followUp of pendingFollowUps) {
    await sendFollowUpMessage(followUp);
  }
});

async function sendFollowUpMessage(followUp) {
  const message = getFollowUpMessage(followUp.follow_up_type);

  // Envia via WhatsApp
  await client.sendMessage(`${followUp.phone_number}@c.us`, message);

  // Marca como enviado
  conversationMemory.markFollowUpAsSent(followUp.id);
}

function getFollowUpMessage(type) {
  const messages = {
    "7days": `Oi! 😊\n\nVocê clicou no nosso anúncio há alguns dias. Só queria verificar se ainda há interesse nos imóveis da região de Campos dos Goytacazes!\n\nTemos ótimas opções com financiamento facilitado pela Caixa. Posso te ajudar? 🏠✨`,
    monthly: `Olá! 😊\n\nMe lembro que você se interessou pelos nossos imóveis.\n\nQueria avisar que sempre surgem novas oportunidades e condições especiais! Se sua situação mudou ou você quer saber de novidades, estou aqui para ajudar! 🏠✨\n\nPode me chamar quando quiser!`,
  };

  return messages[type] || messages["7days"];
}
```

---

## 📊 Lógica de Agendamento

### Follow-up de 7 dias:

```javascript
// Quando lead não responde no mesmo dia
client.on("message", async (msg) => {
  // ... detecta que é lead de anúncio ...

  // Agenda follow-up para 7 dias
  conversationMemory.scheduleFollowUp(chatId, 7, "7days");

  // Se lead responder, cancela o follow-up
  // (implementar verificação)
});
```

### Follow-up Mensal:

```javascript
// Quando lead é desqualificado
if (isDisqualified) {
  // Agenda 6 mensagens mensais
  for (let i = 1; i <= 6; i++) {
    conversationMemory.scheduleFollowUp(chatId, 30 * i, "monthly");
  }
}
```

---

## 💰 Custos Estimados

### Cenário Mensal:

- **10 leads inativos/dia** × 7 dias = 70 follow-ups/semana = **280/mês**
- **30 leads desqualificados** = 30 mensagens mensais
- **Total:** ~310 mensagens extras/mês

### Custo por mensagem (Arcee.ai):

- ~R$ 0,01 a R$ 0,05 por mensagem
- **Total mensal:** R$ 3 a R$ 15

### Infraestrutura:

- **VPS 24/7:** Já incluído (R$ 20-30/mês)
- **node-cron:** GRATUITO
- **SQLite:** GRATUITO

**💡 Custo adicional total: ~R$ 3-15/mês**

---

## ✅ Checklist de Ativação

Antes de ativar o sistema:

- [ ] Confirmar mensagens de follow-up com Ana Cláudia
- [ ] Confirmar os 2 anúncios que estão rodando
- [ ] Definir horários de envio (evitar madrugada)
- [ ] Instalar `node-cron`: `npm install node-cron`
- [ ] Criar arquivo `follow-up-scheduler.js`
- [ ] Testar com 1-2 números de teste
- [ ] Ativar no `bot.js`
- [ ] Monitorar logs nos primeiros dias

---

## 📝 Funções Já Disponíveis

### No `conversation-memory.js`:

```javascript
// Detectar lead do Facebook
isFromFacebookAd(messageContent);

// Agendar follow-up
scheduleFollowUp(phoneNumber, daysFromNow, followUpType);

// Buscar follow-ups pendentes
getPendingFollowUps();

// Marcar como enviado
markFollowUpAsSent(followUpId);

// Listar leads de anúncios
getAdLeads(limit);
```

---

## 🚀 Como Ativar

### Passo 1: Instalar dependência

```bash
cd /Users/rodrigobezerra/whatsbot
npm install node-cron
```

### Passo 2: Criar scheduler

Criar arquivo `src/follow-up-scheduler.js` com o código acima

### Passo 3: Importar no bot.js

```javascript
// No bot.js
const followUpScheduler = require("./follow-up-scheduler");

// Inicia scheduler após bot conectar
client.on("ready", () => {
  followUpScheduler.start(client);
});
```

### Passo 4: Monitorar

```bash
pm2 logs whatsbot
```

---

## 📈 Métricas a Acompanhar

1. **Taxa de resposta** após follow-up de 7 dias
2. **Conversões** de leads reengajados
3. **Opt-outs** (pessoas pedindo para parar)
4. **Melhor horário** para enviar follow-ups
5. **ROI** do sistema de follow-up

---

## ⚠️ Avisos Importantes

1. **Não enviar madrugada** (restringir 8h-20h)
2. **Respeitar opt-out** (se pedir para parar, cancelar follow-ups)
3. **Monitorar banimento** (WhatsApp pode bloquear se enviar muito spam)
4. **Começar devagar** (testar com poucos leads primeiro)
5. **Personalizar mensagens** depois dos primeiros resultados

---

## 📞 Próximos Passos

**Com Ana Cláudia:**

1. Confirmar mensagens de follow-up
2. Confirmar produtos dos 2 anúncios
3. Definir horários ideais de envio
4. Aprovar textos das mensagens

**Técnico:**

1. Criar `follow-up-scheduler.js`
2. Testar com números de teste
3. Ativar gradualmente
4. Monitorar resultados

---

**Documentação criada em:** 15/10/2025  
**Última atualização:** 15/10/2025
