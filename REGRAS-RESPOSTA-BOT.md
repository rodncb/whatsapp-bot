# 🤖 Regras de Resposta do Bot

## 📋 **QUANDO O BOT RESPONDE**

### ✅ **REGRA 1: Mensagem do Anúncio do Facebook**

**Mensagem:** `"Olá! Tenho interesse e queria mais informações, por favor."`

**Comportamento:**

- ✅ **SEMPRE RESPONDE** (ignora todo o resto)
- ✅ Não verifica histórico
- ✅ Não verifica se Ana participou
- ✅ Usa saudação específica do anúncio

**Saudação usada:**

```
Olá, tudo bem? 😊

Você clicou em nosso anúncio para saber mais informações sobre o financiamento de imóveis, correto?

Me chamo Ana Cláudia, sou da Novo Lar Negócios Imobiliários e farei seu atendimento. Qual seu nome?
```

---

### ✅ **REGRA 2: Mensagens DIFERENTES do anúncio**

**Fluxo de decisão:**

#### **2.1. Contato NOVO (sem histórico)**

- ✅ **BOT RESPONDE**
- ✅ Usa saudação genérica

**Saudação genérica:**

```
Olá, tudo bem? 😊

Me chamo Ana Cláudia, sou da Novo Lar Negócios Imobiliários. Como posso te ajudar?

Qual seu nome?
```

#### **2.2. Contato ANTIGO (com histórico)**

**2.2.1. Ana (ou outro admin) JÁ CONVERSOU:**

- ❌ **BOT FICA SILENCIOSO**
- ❌ Não responde mais nunca neste chat
- 📝 Log: `🔕 [MODO SILENCIOSO] Admin já participou dessa conversa`

**2.2.2. Ana NÃO conversou ainda:**

- ✅ **BOT RESPONDE**
- ✅ Usa saudação genérica

---

## 🚫 **QUANDO O BOT NÃO RESPONDE**

### **1. Grupos**

```
🚫 Mensagem de GRUPO ignorada
```

### **2. Mensagens de Administradores**

**Admins configurados:**

- Ana Cláudia: `5522999055098@c.us`
- Thiago: `5522999388505@c.us`
- Cliente teste: `5522998680768@c.us`

**Comportamento:**

- ✅ Bot responde com informações sobre **STATUS/FLUXO**
- ✅ Não trata como cliente
- 📊 Comandos disponíveis: `status`, `atendimento`, `fluxo`, `leads`, `pendentes`

### **3. Contato antigo + Ana já conversou**

```
🔕 [MODO SILENCIOSO] Admin (5522999055098@c.us) já participou dessa conversa
```

---

## 📊 **FLUXO DE DECISÃO COMPLETO**

```
Mensagem recebida
    ↓
É de grupo?
    ├─ SIM → ❌ IGNORA
    └─ NÃO
        ↓
É de admin?
    ├─ SIM → ✅ RESPONDE SOBRE STATUS/FLUXO
    └─ NÃO
        ↓
É mensagem do anúncio FB?
    ├─ SIM → ✅ RESPONDE (saudação do anúncio)
    └─ NÃO
        ↓
Tem histórico?
    ├─ NÃO (novo) → ✅ RESPONDE (saudação genérica)
    └─ SIM (antigo)
        ↓
Ana já conversou neste chat?
    ├─ SIM → ❌ SILENCIOSO
    └─ NÃO → ✅ RESPONDE (saudação genérica)
```

---

## 🎯 **CENÁRIOS PRÁTICOS**

### **Cenário 1: Lead do Facebook**

```
Cliente: "Olá! Tenho interesse e queria mais informações, por favor."
Bot: ✅ RESPONDE (saudação do anúncio)
```

### **Cenário 2: Contato novo (não anúncio)**

```
Cliente: "Oi, tudo bem?"
Bot verifica: Sem histórico
Bot: ✅ RESPONDE (saudação genérica)
```

### **Cenário 3: Contato antigo + Ana não conversou**

```
Cliente: "Oi, tudo bem?"
Bot verifica: Tem histórico, mas Ana não participou
Bot: ✅ RESPONDE (saudação genérica)
```

### **Cenário 4: Contato antigo + Ana já conversou**

```
Cliente: "Oi, tudo bem?"
Bot verifica: Tem histórico E Ana já conversou
Bot: ❌ SILENCIOSO
Log: 🔕 [MODO SILENCIOSO] Admin já participou dessa conversa
```

### **Cenário 5: Ana enviando mensagem**

```
Ana: "status"
Bot: ✅ RESPONDE com status do bot
(não trata como cliente)
```

---

## ⚙️ **SISTEMA DE DEBOUNCE**

**Funcionamento:**

- ⏱️ Bot aguarda **30 segundos** após primeira mensagem
- 📦 Agrupa TODAS as mensagens recebidas nesse período
- ✅ Responde **UMA VEZ SÓ** com contexto completo

**Vantagem:**

- Cliente envia 3 mensagens seguidas
- Bot não responde 3 vezes
- Bot lê todas e responde 1 vez

---

## 🔔 **SISTEMA DE FOLLOW-UP**

**Detecção automática:**

- Cliente diz: "Vou enviar depois", "Mando mais tarde", "Chegando em casa envio"
- Bot marca como pendente
- Bot agenda lembrete para **19h**

**Lembrete enviado:**

```
Oi [Nome]! 😊

Tudo bem? Passando aqui pra lembrar dos documentos que você ia me enviar!

Quando tiver um tempinho, me manda:
📄 RG e CPF
📄 Contracheque (se CLT) ou Extrato bancário (se autônomo)

Assim a gente consegue dar andamento na sua análise de crédito! 🏠✨

Qualquer dúvida, estou por aqui! 😊
```

---

## 📝 **LOGS DO BOT**

### **Quando responde:**

```
==================================================
📩 Mensagem de: João Silva
📱 Número: 5521999999999@c.us
📝 Tipo: chat
⏰ Horário: 15/10/2025, 12:00:00
✅ Mensagem do anúncio FB → Bot vai responder
✅ [BOT ATIVO] Contato novo, bot vai responder
```

### **Quando NÃO responde:**

```
==================================================
📩 Mensagem de: Maria Santos
📱 Número: 5521888888888@c.us
📝 Tipo: chat
⏰ Horário: 15/10/2025, 12:00:00
🔕 [MODO SILENCIOSO] Admin (5522999055098@c.us) já participou dessa conversa
📝 Mensagem salva, mas bot NÃO vai responder
```

---

## ✅ **STATUS ATUAL**

- ✅ Regras implementadas
- ✅ Saudações diferenciadas (anúncio vs genérica)
- ✅ Verificação de admin funcionando
- ✅ Debounce de 30s ativo
- ✅ Follow-up às 19h todo dia
- ✅ Sistema de resposta para admins (status/fluxo)

**Tudo funcionando corretamente!** 🎉
