# 🔔 Sistema de Follow-up Automático

## 📋 Visão Geral

Sistema inteligente que **detecta automaticamente** quando um cliente promete enviar documentos ou informações, e **envia lembretes às 19h todo dia** para quem está devendo.

## 🎯 Como Funciona

### 1. **Detecção Automática**

O bot detecta frases como:

- "Vou enviar"
- "Mando depois"
- "Chegando em casa te envio"
- "Posso fazer isso mais tarde"
- "Envio quando puder"
- "Logo mando"

### 2. **Marca como Pendente**

Quando detecta, o bot:

- ✅ Marca o contato como "aguardando documentos"
- 📅 Agenda follow-up automático para o dia seguinte às 19h
- 📊 Registra no banco de dados

### 3. **Envia Lembrete Automático**

Às **19h todo dia**, o bot:

- 🔍 Verifica quem está devendo documentos
- 📤 Envia mensagem de lembrete amigável
- ✅ Marca como enviado

### 4. **Remove Pendência**

Quando cliente envia:

- 📄 Documento
- 🖼️ Imagem
- 🎤 Áudio

O bot **automaticamente remove a pendência** e para de cobrar.

## 📱 Mensagem de Follow-up

```
Oi [Nome]! 😊

Tudo bem? Passando aqui pra lembrar dos documentos que você ia me enviar!

Quando tiver um tempinho, me manda:
📄 RG e CPF
📄 Contracheque (se CLT) ou Extrato bancário (se autônomo)

Assim a gente consegue dar andamento na sua análise de crédito! 🏠✨

Qualquer dúvida, estou por aqui! 😊
```

## ⚙️ Configuração

### Horário do Follow-up

O follow-up roda **às 19h** todo dia (horário de Brasília).

Para alterar o horário, edite em `src/follow-up-manager.js`:

```javascript
'0 19 * * *', // Às 19h todo dia
```

Exemplos de horários:

- `'0 18 * * *'` - 18h todo dia
- `'0 20 * * *'` - 20h todo dia
- `'0 12 * * *'` - 12h (meio-dia) todo dia
- `'0 9,19 * * *'` - 9h e 19h todo dia

### Banco de Dados

Tabelas utilizadas:

**contacts**

- `follow_up_status` - Status: 'pending', 'awaiting_documents', 'completed'

**follow_ups**

- `id` - ID único
- `phone_number` - Número do contato
- `scheduled_date` - Data/hora agendada
- `follow_up_type` - Tipo: 'awaiting_documents'
- `status` - Status: 'pending', 'sent', 'completed'
- `message_sent` - Se foi enviado (0 ou 1)
- `sent_at` - Quando foi enviado

## 🧪 Como Testar

### 1. Criar um follow-up manual para testar AGORA:

```javascript
const followUpManager = require("./src/follow-up-manager");

// Marca contato como tendo pendência (follow-up será criado para amanhã 19h)
followUpManager.markAsPending(
  "5524981058194@c.us", // seu número
  "awaiting_documents",
  "Teste de follow-up"
);
```

### 2. Alterar data para testar imediatamente:

No banco de dados:

```sql
UPDATE follow_ups
SET scheduled_date = datetime('now', '-1 hour')
WHERE phone_number = '5524981058194';
```

### 3. Ver follow-ups pendentes:

```javascript
const followUpManager = require("./src/follow-up-manager");
followUpManager.getPendingFollowUps();
```

## 📊 Logs do Sistema

Quando o follow-up roda, você verá:

```
🔔 ========== INICIANDO FOLLOW-UPS AGENDADOS ==========
⏰ Horário: 15/10/2025, 19:00:00
📊 3 follow-up(s) pendente(s)
📤 Enviando follow-up para Rodrigo
📋 Tipo: awaiting_documents
✅ Follow-up enviado com sucesso!
==================================================
```

## 🎯 Fluxo Completo - Exemplo

### Dia 1 - 10:00

**Cliente:** "Posso fazer isso mais tarde, pq agora estou no trabalho"

**Bot detecta:**

```
📋 Detectado: Prometeu enviar documentos
📅 Follow-up agendado para 16/10/2025 às 19:00
```

### Dia 2 - 19:00

**Bot envia automaticamente:**

```
Oi Alessandra! 😊

Tudo bem? Passando aqui pra lembrar dos documentos...
```

### Quando cliente enviar

**Cliente:** [envia foto do RG]

**Bot detecta:**

```
✅ Pendência resolvida para 5522996054940
```

**Follow-up para!** ✅

## 🔧 Manutenção

### Ver status de todos os follow-ups:

```sql
SELECT
  c.name,
  c.phone_number,
  c.follow_up_status,
  f.scheduled_date,
  f.status,
  f.message_sent
FROM contacts c
LEFT JOIN follow_ups f ON c.phone_number = f.phone_number
WHERE c.follow_up_status != 'completed'
ORDER BY f.scheduled_date DESC;
```

### Limpar follow-ups antigos:

```sql
DELETE FROM follow_ups
WHERE status = 'completed'
AND sent_at < datetime('now', '-30 days');
```

## 🚀 Próximas Melhorias

Ideias para expandir o sistema:

1. **Múltiplos lembretes** - Enviar 2º lembrete depois de 3 dias
2. **Follow-up diferenciado** - Mensagens diferentes baseadas em quantos dias já passou
3. **Notificar Ana** - Avisar Ana quando cliente não responde após X lembretes
4. **Follow-up de qualificação** - Lembrar leads que pararam no meio da qualificação
5. **Follow-up pós-análise** - Cobrar retorno depois que Ana fez análise

## ✅ Status Atual

- ✅ Sistema implementado
- ✅ Detecção automática funcionando
- ✅ Cron job configurado (19h todo dia)
- ✅ Mensagens personalizadas
- ✅ Limpeza automática de pendências
- ✅ Integrado ao bot principal

**Sistema ATIVO e rodando!** 🎉
