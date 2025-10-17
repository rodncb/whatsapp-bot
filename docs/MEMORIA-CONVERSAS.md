# 💾 Sistema de Memória de Conversas

## 🎯 O QUE FAZ?

Salva **todas as conversas** em um banco de dados local (SQLite) e permite que a IA se contextualize automaticamente.

---

## ✅ FUNCIONALIDADES

### 1. **Salvar mensagens automaticamente**
- Toda mensagem (cliente + bot) é salva
- Histórico completo por telefone
- Informações: data, hora, tipo, conteúdo

### 2. **Contexto automático para IA**
- Antes de responder, busca últimas 10 mensagens
- IA "lembra" de conversas anteriores
- Cliente não precisa repetir informações

### 3. **Gestão de contatos**
- Primeira data de contato
- Última mensagem
- Total de mensagens trocadas
- Status de qualificação

### 4. **Relatórios e estatísticas**
- Total de contatos
- Leads qualificados
- Taxa de conversão
- Mensagens por dia

---

## 🔧 COMO USAR NO BOT

### Exemplo de integração:

```javascript
const conversationMemory = require('./conversation-memory');

client.on('message', async (msg) => {
  const phoneNumber = msg.from;
  const contactName = (await msg.getContact()).pushname || 'Cliente';
  
  // 1. BUSCA CONTEXTO (histórico anterior)
  const context = conversationMemory.getContextForAI(phoneNumber);
  
  // 2. SALVA MENSAGEM DO CLIENTE
  conversationMemory.saveMessage(
    phoneNumber,
    contactName,
    msg.type,
    msg.body || '[mídia]',
    false, // não é do bot
    msg.timestamp
  );
  
  // 3. IA PROCESSA COM CONTEXTO
  const response = await aiAgent.chat(msg.body, context);
  
  // 4. ENVIA RESPOSTA
  await msg.reply(response);
  
  // 5. SALVA RESPOSTA DO BOT
  conversationMemory.saveMessage(
    phoneNumber,
    'Ana Cláudia',
    'text',
    response,
    true, // é do bot
    Date.now() / 1000
  );
});
```

---

## 📊 FUNÇÕES DISPONÍVEIS

### `saveMessage(phoneNumber, contactName, type, content, isFromBot, timestamp)`
Salva uma mensagem no histórico.

```javascript
conversationMemory.saveMessage(
  '5521999999999@c.us',
  'João Silva',
  'text',
  'Quanto custa o apartamento?',
  false,
  Date.now() / 1000
);
```

### `getConversationHistory(phoneNumber, limit)`
Retorna últimas N mensagens de um contato.

```javascript
const history = conversationMemory.getConversationHistory(
  '5521999999999@c.us',
  20
);
// Retorna array com últimas 20 mensagens
```

### `getContextForAI(phoneNumber, limit)`
**MAIS IMPORTANTE!** Formata histórico para passar à IA.

```javascript
const context = conversationMemory.getContextForAI(
  '5521999999999@c.us',
  10
);
// Retorna string formatada com contexto
```

**Exemplo de saída:**
```
Histórico da conversa com este cliente (últimas 3 mensagens):

[14/10/2025, 10:30:15] Cliente: Quanto custa o apartamento?
[14/10/2025, 10:30:20] Você (Ana): R$ 222 mil. Quer agendar visita?
[14/10/2025, 10:30:45] Cliente: Aceita financiamento?

Continue a conversa de forma natural, considerando todo o histórico acima.
```

### `getContactInfo(phoneNumber)`
Retorna informações do contato.

```javascript
const info = conversationMemory.getContactInfo('5521999999999@c.us');
console.log(info);
// {
//   phone_number: '5521999999999',
//   name: 'João Silva',
//   first_contact: '2025-10-14 10:30:00',
//   last_contact: '2025-10-14 15:45:00',
//   total_messages: 15,
//   is_qualified: 1,
//   qualification_data: '{"budget": 250000, "urgency": "high"}',
//   notes: 'Cliente muito interessado...'
// }
```

### `markAsQualified(phoneNumber, qualificationData)`
Marca contato como qualificado.

```javascript
conversationMemory.markAsQualified('5521999999999@c.us', {
  budget: 250000,
  urgency: 'high',
  financing: true,
  propertyType: 'apartamento'
});
```

### `addNote(phoneNumber, note)`
Adiciona nota ao contato.

```javascript
conversationMemory.addNote(
  '5521999999999@c.us',
  'Cliente pediu para ligar amanhã às 14h'
);
```

### `listContacts(limit)`
Lista todos os contatos.

```javascript
const contacts = conversationMemory.listContacts(50);
contacts.forEach(c => {
  console.log(`${c.name} - ${c.phone_number} - ${c.total_messages} msgs`);
});
```

### `getStats()`
Retorna estatísticas gerais.

```javascript
const stats = conversationMemory.getStats();
console.log(stats);
// {
//   totalContacts: 45,
//   qualifiedContacts: 12,
//   totalMessages: 567,
//   qualificationRate: '26.67%'
// }
```

---

## 📁 ESTRUTURA DO BANCO

### Tabela: `conversations`
```sql
- id (auto)
- phone_number (ex: 5521999999999)
- contact_name
- message_type (text, audio, image...)
- message_content
- is_from_bot (0 = cliente, 1 = bot)
- timestamp
- created_at
```

### Tabela: `contacts`
```sql
- phone_number (chave primária)
- name
- first_contact_date
- last_contact_date
- total_messages
- is_qualified (0 = não, 1 = sim)
- qualification_data (JSON)
- notes
```

---

## 🔐 SEGURANÇA

### Dados armazenados localmente:
- ✅ Arquivo: `data/conversations.db`
- ✅ Já está no `.gitignore` (não vai para Git)
- ✅ Backup recomendado semanal

### LGPD (Lei Geral de Proteção de Dados):
⚠️ **Importante:** Você está armazenando dados pessoais (nome, telefone, mensagens).

**Boas práticas:**
1. Informe clientes que conversas são armazenadas
2. Ofereça opção de deletar dados (LGPD exige)
3. Não compartilhe banco com terceiros
4. Faça backup seguro

---

## 🚀 PRÓXIMOS PASSOS

### Integrar no bot da Ana:

1. ✅ Módulo `conversation-memory.js` criado
2. ⏳ Integrar no `src/bot.js`
3. ⏳ Atualizar `src/message-handler.js` para passar contexto
4. ⏳ Testar com conversas reais

### Melhorias futuras:
- [ ] Dashboard web para visualizar conversas
- [ ] Exportar relatórios em Excel
- [ ] Busca por palavra-chave
- [ ] Tags/categorias para contatos
- [ ] Integração com CRM

---

## 💡 EXEMPLO PRÁTICO

### Conversa Dia 1:
```
Cliente: "Olá, quanto custa o apto?"
Bot (sem contexto): "Oi! Temos apartamentos de R$ 200mil a R$ 300mil. 
                     Qual sua faixa de orçamento?"
Cliente: "Até 250 mil"
Bot: "Perfeito! Temos uma opção de R$ 222 mil..."
```

### Conversa Dia 2 (COM memória):
```
Cliente: "E aí, posso visitar amanhã?"
Bot (COM contexto): "Oi! Sobre o apartamento de R$ 222 mil que 
                     conversamos ontem? Claro! Que horário prefere?"
```

### Conversa Dia 2 (SEM memória):
```
Cliente: "E aí, posso visitar amanhã?"
Bot (SEM contexto): "Oi! Visitar qual imóvel?" ❌
```

---

## ✅ BENEFÍCIOS

1. **Experiência melhor para cliente**
   - Não precisa repetir informações
   - Bot "lembra" de conversas anteriores
   - Atendimento mais personalizado

2. **Melhor qualificação**
   - Histórico completo do lead
   - Identifica padrões (clientes sérios vs curiosos)
   - Dados para análise e melhoria

3. **Gestão profissional**
   - Relatórios de performance
   - Acompanhamento de cada lead
   - Base para CRM futuro

---

**Arquivo:** `src/conversation-memory.js`  
**Status:** ✅ Pronto para uso  
**Próximo passo:** Integrar no bot de produção
