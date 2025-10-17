# 🚀 Guia de Ativação - Bot Ana Cláudia

## ⚠️ IMPORTANTE: Ler ANTES de ativar!

O bot da Ana Cláudia está **configurado e pronto**, mas NÃO está ativo ainda.

---

## 📋 PRÉ-REQUISITOS

Antes de ativar, certifique-se:

- [ ] Reunião com Ana Cláudia realizada
- [ ] Perguntas do arquivo `PERGUNTAS-REUNIAO-ANA.md` respondidas
- [ ] Prompts ajustados conforme tom da Ana
- [ ] Imóveis cadastrados no sistema (se necessário)
- [ ] Horário de atendimento definido
- [ ] Critérios de qualificação definidos
- [ ] Ana está ciente e de acordo

---

## 🎯 DIFERENÇAS: Bot Teste vs Bot Ana Cláudia

| Característica     | Bot Teste (Rodrigo)                  | Bot Ana Cláudia             |
| ------------------ | ------------------------------------ | --------------------------- |
| **Número**         | +55 24 98105-8194                    | +55 22 99871-5947           |
| **Respostas**      | Automáticas (fixas)                  | IA Humanizada (Arcee.ai)    |
| **Áudio**          | Transcreve + responde auto           | Transcreve + IA responde    |
| **Objetivo**       | Testes rápidos                       | Atendimento real a clientes |
| **Regra conversa** | Não responde se você participou hoje | **A DEFINIR com Ana**       |

---

## 🔧 ATIVAÇÃO PASSO A PASSO

### Opção 1: Ativar APENAS para teste inicial (recomendado)

```bash
# 1. Abra um terminal novo
cd /Users/rodrigobezerra/whatsbot

# 2. Rode o script de start (para ver QR Code)
./start-bot-ana.sh

# 3. Escaneie o QR Code com o WhatsApp da Ana (+55 22 99871-5947)

# 4. Aguarde conectar
# Você verá: "✅ Bot conectado com sucesso!"

# 5. Faça testes (mande mensagens de outro número)

# 6. Quando terminar os testes:
Ctrl + C (para parar)
```

### Opção 2: Ativar com PM2 (produção 24/7)

```bash
# ⚠️ SÓ FAÇA ISSO DEPOIS DOS TESTES!

# 1. Primeiro, escaneie QR Code com a Opção 1
# (só precisa fazer 1 vez)

# 2. Depois, ative com PM2:
pm2 start ecosystem.config.js --only ana-claudia

# 3. Verifique status:
pm2 status

# 4. Veja logs:
pm2 logs ana-claudia

# 5. Salve configuração (auto-start):
pm2 save
```

---

## ⚙️ CONFIGURAÇÕES IMPORTANTES

### 1. Número do WhatsApp

Atualmente configurado: **+55 22 99871-5947**

Para mudar, edite `.env`:

```bash
OWNER_PHONE=552299871594
```

### 2. Nome do bot

Atualmente: **Ana Cláudia**

Para mudar, edite `.env`:

```bash
BOT_NAME=Ana Cláudia
```

### 3. Personalidade e prompts

Edite o arquivo: `src/prompts.js`

Lá você encontra:

- `SYSTEM_PROMPT` - Personalidade da Ana
- `GREETING_MESSAGE` - Primeira mensagem
- `RESPONSES` - Templates de resposta

---

## 🧪 TESTES RECOMENDADOS

Antes de liberar para clientes reais, teste:

### Teste 1: Mensagem de texto simples

```
Você: "Olá"
Esperado: Bot responde de forma natural e humanizada
```

### Teste 2: Pergunta sobre imóvel

```
Você: "Quanto custa o apartamento?"
Esperado: Bot fornece informação ou faz perguntas qualificadoras
```

### Teste 3: Áudio

```
Você: [Envia áudio "Quero agendar uma visita"]
Esperado: Bot transcreve e responde naturalmente
```

### Teste 4: Pergunta complexa

```
Você: "Aceita financiamento e FGTS?"
Esperado: Bot responde de forma inteligente
```

### Teste 5: Objeção

```
Você: "Muito caro!"
Esperado: Bot tenta contornar ou qualifica melhor
```

---

## 📊 MONITORAMENTO

### Ver conversas em tempo real:

**Se rodando com script normal:**

- Logs aparecem no terminal automaticamente

**Se rodando com PM2:**

```bash
pm2 logs ana-claudia
```

### Ver últimas 100 mensagens:

```bash
pm2 logs ana-claudia --lines 100
```

### Ver só erros:

```bash
pm2 logs ana-claudia --err
```

---

## 🛑 PARAR O BOT

### Se rodando com script normal:

```bash
Ctrl + C
```

### Se rodando com PM2:

```bash
# Parar temporariamente
pm2 stop ana-claudia

# Deletar do PM2 (não inicia mais automaticamente)
pm2 delete ana-claudia
pm2 save
```

---

## ⚠️ PROBLEMAS COMUNS

### Bot não conecta (fica no QR Code):

1. Verifique se WhatsApp está com internet
2. Tente escanear novamente
3. Se persistir, delete sessão e reconecte:
   ```bash
   rm -rf .wwebjs_auth/
   ./start-bot-ana.sh
   ```

### Bot responde de forma estranha:

1. Revise os prompts em `src/prompts.js`
2. Ajuste o `SYSTEM_PROMPT`
3. Reinicie o bot

### Bot não transcreve áudio:

1. Verifique se `OPENAI_API_KEY` está no `.env`
2. Verifique saldo na conta OpenAI
3. Veja logs de erro: `pm2 logs ana-claudia --err`

### Bot consome muita memória:

```bash
pm2 restart ana-claudia
```

---

## 🔄 ATUALIZAÇÕES

### Atualizar prompts/personalidade:

1. Edite `src/prompts.js`
2. Reinicie bot:

   ```bash
   # Se usando PM2:
   pm2 restart ana-claudia

   # Se usando script:
   Ctrl + C
   ./start-bot-ana.sh
   ```

### Atualizar código:

1. Faça alterações nos arquivos
2. Reinicie bot (comando acima)
3. Teste novamente

---

## 📞 COMANDOS RÁPIDOS

```bash
# Status
pm2 status

# Logs
pm2 logs ana-claudia

# Reiniciar
pm2 restart ana-claudia

# Parar
pm2 stop ana-claudia

# Iniciar
pm2 start ecosystem.config.js --only ana-claudia

# Deletar
pm2 delete ana-claudia

# Salvar
pm2 save
```

---

## ✅ CHECKLIST FINAL PRÉ-ATIVAÇÃO

- [ ] Reunião com Ana realizada
- [ ] Prompts ajustados e aprovados
- [ ] Testes realizados (mínimo 5 conversas simuladas)
- [ ] Ana testou e aprovou as respostas
- [ ] Número WhatsApp correto configurado
- [ ] Backup da configuração feito
- [ ] Ana sabe como acompanhar logs (se necessário)
- [ ] Plano de ação caso algo dê errado definido

---

## 🎯 PRÓXIMOS PASSOS PÓS-ATIVAÇÃO

Após 7 dias de bot ativo:

1. [ ] Reunião de review com Ana
2. [ ] Analisar métricas (quantas conversas, taxa de qualificação)
3. [ ] Ajustar prompts baseado em feedback real
4. [ ] Decidir sobre integrações (Google Calendar, CRM)
5. [ ] Planejar Fase 2 (melhorias)

---

**Última atualização:** 14 de outubro de 2025  
**Status:** Aguardando reunião com Ana Cláudia  
**Próximo passo:** Agendar reunião e preencher `PERGUNTAS-REUNIAO-ANA.md`
