# 🚀 PROMPT PARA PRÓXIMA SESSÃO

**Use este prompt para retomar de onde paramos:**

---

## PROMPT (copie e cole):

```
Olá! Estou retomando o desenvolvimento do WhatsBot IA.

📋 CONTEXTO RÁPIDO:
- Bot WhatsApp para Ana Cláudia (imobiliária)
- Stack: Node.js + whatsapp-web.js + Arcee.ai
- PM2 gerenciando 2 bots: whatsbot-ana (produção) + bot-teste
- Projeto: /Users/rodrigobezerra/whatsbot

🚨 PROBLEMA URGENTE QUE PRECISO RESOLVER:
O database "conversations-ana.db" está CONTAMINADO com meus dados pessoais (família, amigos). Se a Ana pedir "relatório" via WhatsApp, meus contatos pessoais aparecerão no relatório dela.

✅ O QUE JÁ FOI FEITO (sessão anterior):
1. Sistema de relatórios admin implementado e funcionando
2. Separação de databases por bot via PM2 (DB_NAME env var)
3. Logs do bot simplificados (estava muito verbose)
4. Script de migração criado mas causou contaminação

📊 SITUAÇÃO ATUAL:
- Bot está ONLINE e funcional
- Database contaminado com 166 conversas (mix cliente + pessoal)
- Nenhum relatório enviado ainda (só testado no terminal)
- Sistema de relatórios pronto mas database inseguro

🎯 O QUE PRECISO FAZER AGORA:
Resolver a contaminação do database antes que admin use o sistema de relatórios.

OPÇÕES:
A) Deletar conversations-ana.db e começar limpo (MAIS SEGURO, perde 1 dia histórico)
B) Filtrar apenas DDD 22 (perde clientes de outras regiões)
C) Exclusão manual dos contatos pessoais (trabalhoso)

Qual você recomenda? E pode me ajudar a executar?

📝 NOTA: Verifique sua memória antes de responder - toda info está salva lá.
```

---

## INFORMAÇÕES PARA REFERÊNCIA RÁPIDA

### Comandos Úteis

```bash
# Ver status dos bots
pm2 status

# Ver logs limpos
pm2 logs whatsbot-ana --lines 50

# Reiniciar bot da Ana
pm2 restart whatsbot-ana

# OPÇÃO A - Deletar database contaminado (SEGURO)
rm /Users/rodrigobezerra/whatsbot/data/conversations-ana.db
pm2 restart whatsbot-ana
```

### Arquivos Críticos

- `data/conversations-ana.db` - DATABASE CONTAMINADO ⚠️
- `src/bot.js` - Lógica principal (relatórios nas linhas ~770-1030)
- `ecosystem.config.js` - PM2 config (DB_NAME por bot)
- `src/conversation-memory.js` - Wrapper SQLite (lê DB_NAME)

### Números Admin

- Ana Cláudia: 5522999055098
- Thiago: 5522999388505

### Comando de Relatório

Admin envia: "relatório" ou "relatorio"

---

## CONTEXTO COMPLETO NA MEMÓRIA

Toda a conversa foi salva em:

- `/memories/whatsbot-project.md` - Histórico completo do projeto
- `/memories/problema-database-contaminado.md` - Detalhes do problema crítico
- `/memories/sessao-16-out-logs.md` - Última sessão (limpeza de logs)

O Copilot vai ler automaticamente e terá todo o contexto! 🎯
