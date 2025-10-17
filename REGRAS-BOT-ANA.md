# 🤖 Regras de Comportamento do Bot - Ana Cláudia

**Data:** 15 de outubro de 2025  
**Versão:** 2.0 - Modo Inteligente

---

## 📋 Resumo das Regras

O bot agora opera com **3 regras de segurança** para não interferir em conversas que não deve:

### ✅ Quando o Bot RESPONDE:

1. **Contato NOVO** (sem histórico no banco de dados)
2. **Mensagens diretas** (não-grupo)
3. **Ana NÃO participou** dessa conversa hoje

### ❌ Quando o Bot NÃO RESPONDE:

1. **Cliente antigo** (já tem histórico de mensagens)
2. **Ana já conversou** com esse contato hoje
3. **Mensagens de GRUPO** (sempre ignora)

---

## 🎭 Comportamento do Bot

### Identidade

- Bot **sempre** se apresenta como **Ana Cláudia**
- **NUNCA** revela que é um bot ou assistente virtual
- Cliente não percebe que está falando com IA

### Objetivo

1. **Qualificar o lead:**
   - Nome
   - Tipo de trabalho (CLT/Autônomo)
   - Renda familiar
   - Idade
2. **Quando lead qualificado:**
   - Bot **silenciosamente** notifica Ana no **22 99905-5098**
   - Bot **continua respondendo** normalmente
   - Ana real **assume quando puder**
   - Cliente **não sabe** que houve troca

### Respostas sobre Imóveis

Bot é **sempre genérico**:

✅ **Respostas corretas:**

- "Trabalho com diversos imóveis nessa região"
- "Tenho várias opções dentro dessa faixa de preço"
- "Após entender seu perfil, vou apresentar as melhores opções"
- "Preciso avaliar suas necessidades para indicar o imóvel ideal"

❌ **NÃO fazer:**

- Dar endereços específicos
- Prometer imóveis que não existem
- Dar detalhes técnicos (número de quartos, metragem, etc.)
- Falar valores específicos de imóveis

**Estratégia:** Qualifica primeiro, Ana mostra imóveis depois.

---

## 🔔 Sistema de Notificações

### Quando Ana é Notificada:

Quando o lead está **qualificado** (aceitou fazer análise de crédito ou enviou documentos), o bot envia uma mensagem **silenciosa** para:

**📱 Celular da Ana:** 22 99905-5098

**Formato da notificação:**

```
🎯 LEAD QUALIFICADO!

[Motivo da qualificação]

📋 Dados do Cliente:
👤 Nome: [nome]
📱 WhatsApp: [número]
💼 Trabalho: [CLT/Autônomo]
💰 Renda: [valor]
🎂 Idade: [idade]
📨 Mensagens: [quantidade]
🕐 Início: [horário]

⚡ Cliente aguardando! Assuma quando puder.

💡 O cliente NÃO sabe que houve troca de atendente.
```

### Importante:

- Cliente **nunca vê** essa notificação
- Bot **continua respondendo** até Ana assumir
- Transição é **imperceptível** para o cliente

---

## 🎯 Detecção de Leads do Facebook

### Mensagem Padrão:

"Olá! Tenho interesse e queria mais informações, por favor"

### Quando detectada:

- ✅ Log especial: `🎯 [LEAD ANÚNCIO FB]`
- ✅ Salvo no banco: `lead_source: "facebook_ad"`
- ✅ Bot responde normalmente
- ✅ Marcado para análise futura

---

## 📊 Logs do Sistema

### Exemplo de log quando bot responde:

```
==================================================
🎯 [LEAD ANÚNCIO FB] Novo lead detectado!
🗺️  Região: Campos dos Goytacazes/RJ
💬 Origem: Anúncio Facebook
📩 Mensagem de: João Silva
📱 Número: 5522999123456@c.us
📝 Tipo: chat
⏰ Horário: 15/10/2025, 09:30:00
✅ [BOT ATIVO] Contato novo, bot vai responder
💬 Conteúdo: Olá! Tenho interesse...
🤖 Resposta enviada: Olá, tudo bem? 😊...
==================================================
```

### Exemplo de log quando bot NÃO responde:

```
==================================================
📩 Mensagem de: Maria Santos
📱 Número: 5522998765432@c.us
📝 Tipo: chat
⏰ Horário: 15/10/2025, 09:35:00
🔕 [MODO SILENCIOSO] Cliente antigo (já tem histórico de conversas)
📝 Mensagem salva, mas bot NÃO vai responder
==================================================
```

---

## 🔧 Arquivos Modificados

### 1. `src/bot.js`

**Mudanças:**

- ✅ Verifica histórico antes de responder
- ✅ Verifica se Ana participou hoje
- ✅ Ignora grupos sempre
- ✅ Notifica Ana silenciosamente
- ✅ Logs detalhados de decisões

### 2. `src/conversation-memory.js`

**Novas funções:**

- `hasConversationHistory(phoneNumber)` - Verifica se contato é novo
- `userSentMessageToday(phoneNumber, userPhone)` - Verifica participação de Ana

### 3. `src/prompts.js`

**Mudanças:**

- ✅ Removido detalhes específicos de imóveis
- ✅ Adicionadas respostas genéricas
- ✅ Foco em qualificação primeiro

---

## 🧪 Como Testar

### Teste 1: Contato Novo

1. Envie mensagem de um número que nunca conversou
2. **Resultado esperado:** Bot responde

### Teste 2: Cliente Antigo

1. Envie mensagem de um número que JÁ conversou antes
2. **Resultado esperado:** Bot NÃO responde (modo silencioso)

### Teste 3: Ana Participou Hoje

1. Ana envia mensagem manual para um contato
2. Contato responde depois
3. **Resultado esperado:** Bot NÃO responde

### Teste 4: Mensagem de Grupo

1. Envie mensagem em grupo
2. **Resultado esperado:** Bot ignora sempre

### Teste 5: Lead do Facebook

1. Envie: "Olá! Tenho interesse e queria mais informações, por favor"
2. **Resultado esperado:**
   - Bot responde
   - Log mostra `🎯 [LEAD ANÚNCIO FB]`

### Teste 6: Notificação Ana

1. Complete qualificação com bot
2. **Resultado esperado:**
   - Ana recebe notificação no 22 99905-5098
   - Cliente não vê notificação
   - Bot continua respondendo

---

## ⚙️ Configuração

### Números Importantes:

```javascript
// src/bot.js
const ANA_REAL_PHONE = "5522999055098@c.us"; // Para notificações
const OWNER_PHONE = "552299871594"; // Bot Ana
```

### Para alterar celular da Ana:

1. Edite `src/bot.js`
2. Altere linha: `const ANA_REAL_PHONE = "5522999055098@c.us";`
3. Reinicie o bot: `pm2 restart whatsbot-ana`

---

## 🚀 Como Iniciar

### Primeira vez:

```bash
./start-bot-ana.sh
```

### Com PM2:

```bash
pm2 start ecosystem.config.js --only whatsbot-ana
pm2 logs whatsbot-ana
```

### Verificar status:

```bash
pm2 status
pm2 logs whatsbot-ana --lines 50
```

---

## 📝 Backup

Backup do bot.js anterior salvo em:

```
/Users/rodrigobezerra/whatsbot/src/bot.js.backup
```

Para restaurar (se necessário):

```bash
cp src/bot.js.backup src/bot.js
pm2 restart whatsbot-ana
```

---

## ✅ Checklist de Validação

Antes de colocar em produção, verificar:

- [ ] Bot só responde contatos novos
- [ ] Bot não responde se Ana já conversou hoje
- [ ] Bot nunca responde grupos
- [ ] Detecção de leads do Facebook funciona
- [ ] Notificações chegam no celular da Ana (22 99905-5098)
- [ ] Respostas sobre imóveis são genéricas
- [ ] Bot sempre se apresenta como Ana Cláudia
- [ ] Cliente não percebe troca de atendente
- [ ] Logs mostram decisões corretas
- [ ] Banco de dados salvando corretamente

---

## 📞 Suporte

**Dúvidas ou problemas:**

- Verificar logs: `pm2 logs whatsbot-ana`
- Verificar banco: `sqlite3 data/conversations.db`
- Restaurar backup se necessário

**Próximos passos:**

1. ✅ Testar com Ana às 9h
2. [ ] Validar notificações
3. [ ] Ajustar prompts se necessário
4. [ ] Configurar VPS
5. [ ] Segundo cliente (clínica)
