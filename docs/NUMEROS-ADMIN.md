# 👥 Sistema de Números Administradores

**Status:** 🟡 Documentado, pronto para implementar  
**Data:** 15 de outubro de 2025

---

## 📋 Visão Geral

Sistema que permite números específicos (donos/administradores) consultarem relatórios e estatísticas do bot diretamente pelo WhatsApp, sem interferir no atendimento aos clientes.

---

## 🎯 Casos de Uso

### Ana Cláudia pergunta ao bot:

```
Ana: "Relatório de hoje"

Bot: 📊 Relatório de Hoje (15/10/2025)

🎯 Leads Totais: 12
   • Facebook: 8 🎯
   • Diretos: 4

✅ Qualificados: 5 (42%)
   • Renda OK: 5
   • Idade OK: 5
   • Enviaram docs: 3

❌ Desqualificados: 2 (17%)
   • Renda baixa: 1
   • Idade alta: 1

⏳ Em qualificação: 5 (42%)

💬 Total de mensagens: 87
🎤 Áudios recebidos: 15
📝 Áudios transcritos: 15

⏰ Horário: 18:45
```

### Rodrigo pergunta ao bot:

```
Rodrigo: "Leads da semana"

Bot: 📊 Relatório Semanal (09-15/10/2025)

🎯 Leads Totais: 67
   • Facebook: 45 (67%)
   • Diretos: 22 (33%)

✅ Qualificados: 28 (42%)
❌ Desqualificados: 15 (22%)
⏳ Em qualificação: 24 (36%)

📈 Conversão: 42%

🏆 Melhor dia: 12/10 (15 leads)
📉 Pior dia: 09/10 (6 leads)

💰 Potencial (leads qualificados):
   Renda média: R$ 3.200
   Ticket médio estimado: R$ 180k
```

---

## 🔐 Configuração

### 1️⃣ Adicionar no `.env`:

```bash
# Números administradores (separados por vírgula)
ADMIN_PHONES=5522998715947,5524981058194,5521999999999

# Comandos disponíveis (ativa/desativa funcionalidade)
ENABLE_ADMIN_COMMANDS=true
```

### 2️⃣ Comandos Disponíveis:

```javascript
// Relatórios
"relatório hoje"     → Estatísticas do dia
"relatório semana"   → Últimos 7 dias
"relatório mês"      → Mês atual

// Leads
"leads hoje"         → Lista de leads do dia
"leads qualificados" → Leads prontos para contato
"leads fb"           → Leads do Facebook

// Conversas
"conversas ativas"   → Conversas em andamento
"última conversa"    → Última interação

// Estatísticas
"taxa de conversão"  → % de leads qualificados
"melhor horário"     → Horário com mais leads
"origem dos leads"   → Facebook vs Direto

// Follow-up
"follow-ups hoje"    → Follow-ups agendados hoje
"leads inativos"     → Leads que não responderam

// Ajuda
"comandos"           → Lista todos comandos
"ajuda"              → Ajuda geral
```

---

## 💻 Implementação Técnica

### Arquivo: `src/admin-commands.js`

```javascript
const conversationMemory = require("./conversation-memory");

// Lista de números administradores (do .env)
const ADMIN_PHONES = process.env.ADMIN_PHONES
  ? process.env.ADMIN_PHONES.split(",").map((p) => p.trim())
  : [];

/**
 * Verifica se número é administrador
 */
function isAdmin(phoneNumber) {
  const cleanPhone = phoneNumber.replace("@c.us", "");
  return ADMIN_PHONES.some((admin) => cleanPhone.includes(admin));
}

/**
 * Processa comando de admin
 */
async function processAdminCommand(phoneNumber, message) {
  const command = message.toLowerCase().trim();

  // Relatórios
  if (
    command.includes("relatório hoje") ||
    command.includes("relatorio hoje")
  ) {
    return await getDailyReport();
  }

  if (
    command.includes("relatório semana") ||
    command.includes("relatorio semana")
  ) {
    return await getWeeklyReport();
  }

  if (command.includes("relatório mês") || command.includes("relatorio mês")) {
    return await getMonthlyReport();
  }

  // Leads
  if (command.includes("leads hoje")) {
    return await getTodayLeads();
  }

  if (command.includes("leads qualificados")) {
    return await getQualifiedLeads();
  }

  if (command.includes("leads fb") || command.includes("leads facebook")) {
    return await getFacebookLeads();
  }

  // Estatísticas
  if (command.includes("taxa de conversão") || command.includes("conversao")) {
    return await getConversionRate();
  }

  if (command.includes("origem dos leads")) {
    return await getLeadsOrigin();
  }

  // Follow-up
  if (
    command.includes("follow-ups hoje") ||
    command.includes("followups hoje")
  ) {
    return await getTodayFollowUps();
  }

  if (command.includes("leads inativos")) {
    return await getInactiveLeads();
  }

  // Ajuda
  if (command === "comandos" || command === "ajuda" || command === "help") {
    return getCommandsList();
  }

  return null; // Não é comando admin
}

/**
 * Relatório diário
 */
async function getDailyReport() {
  const stats = conversationMemory.getDailyStats();

  return `📊 *Relatório de Hoje* (${new Date().toLocaleDateString("pt-BR")})

🎯 *Leads Totais:* ${stats.totalLeads}
   • Facebook: ${stats.facebookLeads} 🎯
   • Diretos: ${stats.directLeads}

✅ *Qualificados:* ${stats.qualified} (${stats.qualifiedPercent}%)
   • Renda OK: ${stats.qualifiedIncome}
   • Idade OK: ${stats.qualifiedAge}
   • Enviaram docs: ${stats.sentDocuments}

❌ *Desqualificados:* ${stats.disqualified} (${stats.disqualifiedPercent}%)
   • Renda baixa: ${stats.disqualifiedIncome}
   • Idade alta: ${stats.disqualifiedAge}

⏳ *Em qualificação:* ${stats.inProgress} (${stats.inProgressPercent}%)

💬 *Total de mensagens:* ${stats.totalMessages}
🎤 *Áudios recebidos:* ${stats.audiosReceived}
📝 *Áudios transcritos:* ${stats.audiosTranscribed}

⏰ *Atualizado:* ${new Date().toLocaleTimeString("pt-BR")}`;
}

/**
 * Relatório semanal
 */
async function getWeeklyReport() {
  const stats = conversationMemory.getWeeklyStats();

  return `📊 *Relatório Semanal* (${stats.dateRange})

🎯 *Leads Totais:* ${stats.totalLeads}
   • Facebook: ${stats.facebookLeads} (${stats.facebookPercent}%)
   • Diretos: ${stats.directLeads} (${stats.directPercent}%)

✅ *Qualificados:* ${stats.qualified} (${stats.qualifiedPercent}%)
❌ *Desqualificados:* ${stats.disqualified} (${stats.disqualifiedPercent}%)
⏳ *Em qualificação:* ${stats.inProgress} (${stats.inProgressPercent}%)

📈 *Conversão:* ${stats.conversionRate}%

🏆 *Melhor dia:* ${stats.bestDay} (${stats.bestDayLeads} leads)
📉 *Pior dia:* ${stats.worstDay} (${stats.worstDayLeads} leads)

💰 *Potencial (leads qualificados):*
   Renda média: R$ ${stats.avgIncome}
   Ticket médio estimado: R$ ${stats.avgTicket}k

⏰ *Gerado em:* ${new Date().toLocaleString("pt-BR")}`;
}

/**
 * Lista de comandos
 */
function getCommandsList() {
  return `📱 *Comandos Disponíveis*

*📊 RELATÓRIOS*
• relatório hoje
• relatório semana
• relatório mês

*🎯 LEADS*
• leads hoje
• leads qualificados
• leads fb

*📈 ESTATÍSTICAS*
• taxa de conversão
• origem dos leads
• melhor horário

*📅 FOLLOW-UP*
• follow-ups hoje
• leads inativos

*❓ AJUDA*
• comandos (esta lista)
• ajuda

---
💡 *Dica:* Pode usar linguagem natural!
Ex: "Quantos leads tivemos hoje?"`;
}

module.exports = {
  isAdmin,
  processAdminCommand,
};
```

---

## 📊 Funções no `conversation-memory.js`

```javascript
/**
 * Estatísticas do dia
 */
function getDailyStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stmt = db.prepare(`
    SELECT 
      COUNT(DISTINCT phone_number) as total_leads,
      SUM(CASE WHEN is_ad_lead = 1 THEN 1 ELSE 0 END) as facebook_leads,
      SUM(CASE WHEN is_ad_lead = 0 THEN 1 ELSE 0 END) as direct_leads,
      SUM(CASE WHEN is_qualified = 1 THEN 1 ELSE 0 END) as qualified,
      SUM(CASE WHEN follow_up_status = 'disqualified' THEN 1 ELSE 0 END) as disqualified
    FROM contacts
    WHERE DATE(first_contact_date) = DATE('now')
  `);

  const result = stmt.get();

  // Calcular porcentagens
  result.qualifiedPercent = (
    (result.qualified / result.total_leads) *
    100
  ).toFixed(0);
  result.disqualifiedPercent = (
    (result.disqualified / result.total_leads) *
    100
  ).toFixed(0);
  result.inProgress =
    result.total_leads - result.qualified - result.disqualified;
  result.inProgressPercent = (
    (result.inProgress / result.total_leads) *
    100
  ).toFixed(0);

  return result;
}

/**
 * Estatísticas da semana
 */
function getWeeklyStats() {
  const stmt = db.prepare(`
    SELECT 
      COUNT(DISTINCT phone_number) as total_leads,
      SUM(CASE WHEN is_ad_lead = 1 THEN 1 ELSE 0 END) as facebook_leads,
      SUM(CASE WHEN is_qualified = 1 THEN 1 ELSE 0 END) as qualified
    FROM contacts
    WHERE DATE(first_contact_date) >= DATE('now', '-7 days')
  `);

  return stmt.get();
}

// ... mais funções de estatísticas
```

---

## 🔄 Integração no Bot

### Em `bot.js`:

```javascript
const adminCommands = require("./admin-commands");

client.on("message", async (msg) => {
  const chatId = msg.from;

  // VERIFICA SE É ADMIN
  if (adminCommands.isAdmin(chatId)) {
    const adminResponse = await adminCommands.processAdminCommand(
      chatId,
      msg.body
    );

    if (adminResponse) {
      // É comando admin! Responde e retorna
      await msg.reply(adminResponse);
      console.log(`👤 Comando admin processado: ${msg.body}`);
      return;
    }
  }

  // Se não for comando admin, continua fluxo normal
  // ... resto do código
});
```

---

## 🎨 Exemplos de Uso

### Exemplo 1: Relatório do dia

```
Ana: "Relatório hoje"

Bot: 📊 Relatório de Hoje (15/10/2025)

🎯 Leads Totais: 12
   • Facebook: 8 🎯
   • Diretos: 4

✅ Qualificados: 5 (42%)
❌ Desqualificados: 2 (17%)
⏳ Em qualificação: 5 (42%)

💬 Total de mensagens: 87
```

### Exemplo 2: Leads qualificados

```
Rodrigo: "Leads qualificados"

Bot: ✅ Leads Qualificados (5)

1. João Silva
   📱 5524999111222
   💰 Renda: R$ 3.500
   📄 Documentos: ✅ Enviados
   ⏰ Há 2 horas

2. Maria Santos
   📱 5524999333444
   💰 Renda: R$ 4.200
   📄 Documentos: ⏳ Aguardando
   ⏰ Há 4 horas

...

💡 Prioridade: João Silva (docs prontos)
```

### Exemplo 3: Linguagem natural

```
Ana: "Quantos leads tivemos hoje?"

Bot: 🎯 Hoje tivemos 12 leads!
   • 8 do Facebook
   • 4 diretos

Quer ver o relatório completo?
Digite "relatório hoje"
```

---

## 🔐 Segurança

### Múltiplas camadas:

1. **Whitelist de números** (`.env`)
2. **Verificação a cada mensagem**
3. **Comandos só funcionam para admins**
4. **Logs de acesso admin**
5. **Não interfere em conversas de clientes**

### Log de auditoria:

```javascript
console.log(`👤 [ADMIN] ${contactName} executou: ${command}`);
```

---

## 💡 Recursos Avançados (Futuro)

### 1️⃣ Notificações Proativas

```javascript
// Notifica admin quando:
- Lead qualificado enviou documentos
- Lead de alto valor (renda > R$ 5k)
- Taxa de conversão < 30% no dia
- Sistema detecta problema (erro, desconexão)
```

### 2️⃣ Comandos de Ação

```
"pausar bot"           → Para atendimento temporariamente
"ativar bot"           → Reativa atendimento
"responder João Silva" → Redireciona conversa específica
"alterar horário"      → Muda horário de atendimento
```

### 3️⃣ Gráficos e Exportação

```
"gráfico semana"  → Envia imagem com gráfico
"exportar leads"  → Envia CSV por email
"backup hoje"     → Backup do banco de dados
```

---

## 📱 Interface Mobile (Futuro)

Para facilitar ainda mais, pode criar um app mobile nativo que:

- Notificações push
- Dashboard visual
- Acesso rápido a relatórios
- Responder conversas manualmente

---

## ✅ Checklist de Implementação

- [ ] Criar `src/admin-commands.js`
- [ ] Adicionar funções de estatísticas no `conversation-memory.js`
- [ ] Integrar no `bot.js`
- [ ] Adicionar `ADMIN_PHONES` no `.env`
- [ ] Testar com números da Ana e Rodrigo
- [ ] Documentar comandos adicionais
- [ ] Implementar notificações proativas (opcional)

---

## 💰 Custo

**R$ 0 adicional!**

- Apenas consultas ao banco de dados local
- Não usa API externa
- Processamento local

---

## 🎯 Benefícios

✅ Acompanhamento em tempo real
✅ Não precisa acessar computador
✅ Relatórios instantâneos
✅ Tomada de decisão rápida
✅ Múltiplos admins (Ana, Rodrigo, gerente)
✅ Seguro (apenas números autorizados)

---

**Pronto para implementar quando quiser!** 🚀

---

**Documentação criada em:** 15/10/2025  
**Última atualização:** 15/10/2025
