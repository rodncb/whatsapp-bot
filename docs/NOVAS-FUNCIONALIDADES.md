# 🆕 Novas Funcionalidades - 15/10/2025

## 📋 Resumo das Implementações

### 1. 🎤 Captura de Mensagens e Áudios da Ana

#### Problema Resolvido:

- Bot não salvava mensagens enviadas pela Ana (fromMe = false quando enviadas de outros dispositivos)
- Banco de dados ficava sem registro das participações da Ana
- Bot entrava em conversas que Ana já havia começado

#### Solução Implementada:

- **Novo listener `message_create`** que captura TODAS as mensagens, incluindo as enviadas pela Ana
- Sistema baixa e transcreve áudios da Ana usando OpenAI Whisper
- Salva no banco com identificador "Ana (Humana)"

#### Como Funciona:

```javascript
// bot.js - Linha ~108
client.on("message_create", async (msg) => {
  if (!msg.fromMe) return; // Só processa mensagens da Ana

  // Se for áudio (ptt), baixa e transcreve
  if (msg.type === 'ptt' || msg.type === 'audio') {
    const media = await msg.downloadMedia();
    const transcription = await audioHandler.transcribeAudio(audioPath);
  }

  // Salva no banco
  conversationMemory.saveMessage(chatId, "Ana (Humana)", ...);
});
```

#### Logs Gerados:

```
💬 [ANA HUMANA] Enviou ptt para: Marcelinho (5522981567891)
🎤 Baixando áudio da Ana...
✅ Áudio da Ana transcrito: "Oi Marcelinho, tudo bem? Sobre o documento..."
✅ Mensagem da Ana salva no banco para: Marcelinho
```

#### Banco de Dados:

```sql
-- Mensagens da Ana agora aparecem assim:
contact_name    | message_content          | is_from_bot | message_type
----------------+--------------------------+-------------+-------------
Ana (Humana)    | Oi, tudo bem?           | 0           | chat
Ana (Humana)    | [transcrição do áudio]  | 0           | ptt
```

---

### 2. 📅 Sistema de Agendamento Presencial

#### Objetivo:

Permitir que cliente escolha entre:

- ✅ Atendimento presencial (marcar dia/hora)
- ✅ Continuar pelo WhatsApp (enviar fotos)

#### Fluxo Implementado:

**Passo 1: Pergunta Neutra (SEM mencionar localização)**

```
Perfeito! Agora preciso dos seus documentos para fazer a análise. Você prefere:

1️⃣ Trazer pessoalmente
2️⃣ Enviar por aqui mesmo (foto)

Como você preferir! 😊
```

**Passo 2a: Se escolher WhatsApp**

- Bot pede RG, CPF e contracheque/extrato
- Fluxo normal continua

**Passo 2b: Se escolher Presencial**

- Bot pergunta: "Qual dia e horário seria melhor pra você?"
- Cliente responde: "Sexta-feira às 14h" (ou similar)
- Bot confirma: "Perfeito! Anotado aqui: Sexta-feira às 14h. ✅"
- Bot avisa: "A Ana vai te enviar o endereço e confirmar certinho com você, ok? 😊"
- **Bot PARA de responder** (Ana assume para passar endereço)

**Passo 3: Se cliente perguntar onde fica**

- Bot responde: "Estamos em Campos dos Goytacazes/RJ! 📍 A Ana vai te passar o endereço completo agora. 😊"
- Ana recebe notificação para passar endereço

#### Nova Tabela no Banco:

```sql
CREATE TABLE appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone_number TEXT NOT NULL,
  contact_name TEXT,
  preferred_date TEXT NOT NULL,      -- Ex: "Sexta-feira", "15/10/2025"
  preferred_time TEXT NOT NULL,      -- Ex: "14h", "10:00"
  status TEXT DEFAULT 'pending',     -- pending, confirmed, cancelled
  confirmed_by_ana BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  confirmed_at DATETIME,
  notes TEXT
);
```

#### Funções Adicionadas:

```javascript
// conversation-memory.js

// Criar agendamento
createAppointment(phoneNumber, contactName, date, time);
// Resultado: ID do agendamento

// Listar pendentes
getPendingAppointments();
// Resultado: [{id, phone_number, contact_name, preferred_date, preferred_time, ...}]

// Confirmar agendamento (quando Ana confirmar)
confirmAppointment(appointmentId);
// Resultado: status = 'confirmed', confirmed_by_ana = 1

// Marcar preferência presencial no contato
markAsInPersonPreference(phoneNumber);
// Resultado: adiciona nota "[PREFERÊNCIA: Atendimento presencial]"
```

#### Consultar Agendamentos:

```bash
# Ver todos agendamentos pendentes
sqlite3 data/conversations.db "SELECT * FROM appointments WHERE status = 'pending' ORDER BY created_at DESC;"

# Ver agendamentos de hoje
sqlite3 data/conversations.db "SELECT contact_name, preferred_date, preferred_time FROM appointments WHERE date(created_at) = date('now') ORDER BY preferred_time;"

# Análise de horários mais populares (para futuro sistema de sugestão)
sqlite3 data/conversations.db "SELECT preferred_time, COUNT(*) as total FROM appointments GROUP BY preferred_time ORDER BY total DESC;"
```

---

### 3. 🔧 Correções Adicionais

#### 3.1. Correção: `hasConversationHistory()`

**Problema:** Função não removia `@c.us` do número, não encontrava histórico
**Solução:**

```javascript
function hasConversationHistory(phoneNumber) {
  const cleanPhone = phoneNumber.replace("@c.us", ""); // ADICIONADO
  // ... resto do código
}
```

#### 3.2. Correção: `userSentMessageToday()`

**Problema:** Mesma issue, não removia `@c.us`
**Solução:**

```javascript
function userSentMessageToday(phoneNumber, userPhone) {
  const cleanPhone = phoneNumber.replace("@c.us", ""); // ADICIONADO
  // ... resto do código
}
```

#### 3.3. Saudações Variadas

**Problema:** Bot sempre enviava mesma mensagem de saudação
**Solução:** IA agora gera saudação diferente a cada vez, mantendo contexto (anúncio vs direto)

```javascript
// message-handler.js
const greetingPrompt = isFromAd
  ? `Você é Ana Cláudia. Cliente clicou no anúncio do Facebook. 
     Crie saudação DIFERENTE a cada vez que:
     1. Mencione anúncio de financiamento
     2. Se apresente
     3. Pergunte nome
     Máximo 3 linhas.`
  : `Você é Ana Cláudia. Cliente enviou mensagem direto.
     Crie saudação DIFERENTE que:
     1. Se apresente
     2. Pergunte como pode ajudar
     3. Pergunte nome
     Máximo 3 linhas.`;

const greeting = await this.aiAgent.chat([
  { role: "system", content: greetingPrompt },
  { role: "user", content: message },
]);
```

---

## 📊 Fluxo Completo Atualizado

```
1. Lead entra (FB ad ou direto)
2. Bot saúda (saudação variada baseada em origem)
3. Qualificação (nome, já fez análise, CLT/autônomo, renda, idade)
4. Bot pergunta: Presencial ou WhatsApp?

   ┌─────────────────┐
   │ 1. WhatsApp     │ → Bot pede docs → Cliente envia → Ana analisa
   └─────────────────┘

   ┌─────────────────┐
   │ 2. Presencial   │ → Bot pergunta dia/hora → Salva agendamento no BD
   └─────────────────┘ → Bot confirma e PARA → Ana assume (passa endereço)
```

---

## 🎯 Próximos Passos (Futuro)

### Sistema Inteligente de Sugestão de Horários

- Analisar `appointments` table para identificar horários mais populares
- Bot sugerir automaticamente: "Temos disponível sexta às 14h ou segunda às 10h. Qual prefere?"
- Dashboard para Ana visualizar agenda da semana

### Analytics de Preferências

```sql
-- Horários mais escolhidos
SELECT preferred_time, COUNT(*) as total
FROM appointments
GROUP BY preferred_time
ORDER BY total DESC;

-- Dias mais escolhidos
SELECT preferred_date, COUNT(*) as total
FROM appointments
WHERE preferred_date IN ('segunda', 'terça', 'quarta', 'quinta', 'sexta')
GROUP BY preferred_date;

-- Taxa de conversão presencial vs WhatsApp
SELECT
  SUM(CASE WHEN notes LIKE '%presencial%' THEN 1 ELSE 0 END) as presencial,
  SUM(CASE WHEN notes NOT LIKE '%presencial%' THEN 1 ELSE 0 END) as whatsapp
FROM contacts;
```

---

## 🧪 Como Testar

### Teste 1: Mensagens da Ana

1. Ana envia mensagem ou áudio para cliente
2. Verificar log: `💬 [ANA HUMANA] Enviou...`
3. Verificar banco:

```bash
sqlite3 data/conversations.db "SELECT contact_name, message_content FROM conversations WHERE contact_name = 'Ana (Humana)' ORDER BY timestamp DESC LIMIT 5;"
```

### Teste 2: Agendamento Presencial

1. Cliente chega até pergunta de docs
2. Bot pergunta: "Trazer pessoalmente ou enviar foto?"
3. Cliente: "Pessoalmente"
4. Bot: "Qual dia e horário..."
5. Cliente: "Sexta às 14h"
6. Bot confirma e para
7. Verificar banco:

```bash
sqlite3 data/conversations.db "SELECT * FROM appointments WHERE status = 'pending' ORDER BY created_at DESC LIMIT 1;"
```

### Teste 3: Saudações Variadas

1. Enviar 3 mensagens de clientes diferentes
2. Verificar que saudações são diferentes (mas mantêm contexto)

---

## 📦 Dependências Atualizadas

Nenhuma nova dependência necessária - sistema usa recursos já existentes:

- ✅ `whatsapp-web.js` - event `message_create`
- ✅ `audio-handler.js` - transcrição de áudios
- ✅ `better-sqlite3` - nova tabela `appointments`
- ✅ OpenAI - geração de saudações variadas

---

## 🚀 Status

- ✅ **Captura de mensagens da Ana:** Implementado e testável
- ✅ **Sistema de agendamento:** Implementado e testável
- ✅ **Correções de busca no BD:** Implementado
- ✅ **Saudações variadas:** Implementado
- 🔄 **Testes em produção:** Aguardando

---

**Data:** 15 de outubro de 2025  
**Versão:** 2.1.0  
**PM2 Process:** whatsbot-ana (restart #10)
