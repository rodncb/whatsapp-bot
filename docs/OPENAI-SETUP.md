# 🎤 PASSO A PASSO: Criar conta OpenAI e pegar API Key

## ⏱️ Tempo estimado: 10 minutos

---

## 📋 Passo 1: Criar conta OpenAI

### 1.1 - Acessar página de cadastro

🔗 Abra: https://platform.openai.com/signup

### 1.2 - Escolher método de cadastro

Você pode usar:

- ✅ **Conta Google** (mais rápido)
- ✅ **Conta Microsoft**
- ✅ **Email** (cria senha)

**Recomendo:** Google (1 clique)

### 1.3 - Verificar email

- Se usar email próprio, verifique a caixa de entrada
- Clique no link de confirmação
- ✅ Conta criada!

---

## 💳 Passo 2: Adicionar forma de pagamento

### 2.1 - Acessar billing

🔗 Vá em: https://platform.openai.com/settings/organization/billing

Ou:

1. Clique no seu nome (canto superior direito)
2. Settings
3. Billing
4. Add payment method

### 2.2 - Adicionar cartão de crédito

- Pode ser qualquer cartão internacional
- **Nubank funciona!** ✅
- **Inter funciona!** ✅
- **Banco tradicional funciona!** ✅

### 2.3 - Adicionar créditos

**Quanto colocar?**

| Valor | Duração estimada          |
| ----- | ------------------------- |
| $5    | ~1-2 meses (teste)        |
| $10   | ~2-4 meses (uso leve)     |
| $20   | ~4-6 meses (uso moderado) |

**Recomendo começar:** $10 (seguro e dura bastante)

**⚠️ Importante:**

- OpenAI cobra **apenas o que usar**
- Se colocar $10, só desconta conforme usa
- Não é assinatura mensal
- Pode adicionar mais depois

---

## 🔑 Passo 3: Criar API Key

### 3.1 - Acessar API Keys

🔗 Vá em: https://platform.openai.com/api-keys

Ou:

1. Clique no seu nome
2. Settings (ou API Keys no menu lateral)
3. API Keys

### 3.2 - Criar nova chave

1. Clique em **"Create new secret key"**
2. Dê um nome: `WhatsBot Audio` (para identificar)
3. Clique em **"Create secret key"**

### 3.3 - COPIAR A CHAVE

⚠️ **ATENÇÃO: A chave só aparece UMA VEZ!**

A chave começa com: `sk-proj-...` ou `sk-...`

Exemplo (falso):

```
sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

**Copie TODA a chave!**

📋 Cole num lugar seguro (Notas, Google Keep, etc)

---

## ⚙️ Passo 4: Configurar no projeto

### 4.1 - Abrir arquivo .env

No VS Code:

1. Abra o projeto `/Users/rodrigobezerra/whatsbot`
2. Abra o arquivo `.env`

### 4.2 - Adicionar a chave

Procure esta linha:

```env
OPENAI_API_KEY=
```

Cole sua chave:

```env
OPENAI_API_KEY=sk-proj-suachaveaqui
```

**Exemplo (com chave falsa):**

```env
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### 4.3 - Salvar arquivo

- Mac: `Cmd + S`
- Ou: File → Save

---

## 🚀 Passo 5: Reiniciar o bot

Se o bot estiver rodando:

### 5.1 - Parar o bot

No terminal, pressione: `Ctrl + C`

### 5.2 - Iniciar novamente

```bash
./start-bot.sh
```

### 5.3 - Verificar se funcionou

Procure esta mensagem no terminal:

```
🎤 Suporte a ÁUDIO HABILITADO (OpenAI Whisper)
```

✅ **Se aparecer: SUCESSO!** Áudio está funcionando!

❌ **Se aparecer:** "Modo TEXTO apenas" → Chave não foi configurada corretamente

---

## 🧪 Passo 6: Testar com áudio

### 6.1 - Conectar o bot (QR Code normal)

### 6.2 - Pedir para alguém mandar áudio

### 6.3 - Observar o terminal

Você deve ver:

```
🎤 Áudio recebido
🔄 Transcrevendo áudio com OpenAI Whisper...
📁 Áudio salvo temporariamente: /temp/audio_xxx.ogg
🎤 Transcrevendo áudio: audio_xxx.ogg
✅ Áudio transcrito: "olá, tudo bem? quero saber sobre..."
💬 Transcrição: olá, tudo bem? quero saber sobre...
🤖 Resposta enviada: Olá, tudo bem? 😊...
```

### 6.4 - Bot responde normalmente

Como se fosse mensagem de texto! ✅

---

## 💰 Passo 7: Monitorar custos

### 7.1 - Ver quanto gastou

🔗 Acesse: https://platform.openai.com/usage

Você verá:

- Gastos de hoje
- Gastos do mês
- Histórico detalhado

### 7.2 - Configurar alertas

🔗 Vá em: https://platform.openai.com/settings/organization/limits

Configure:

- **Hard limit:** $20 (bot para se atingir)
- **Soft limit:** $15 (recebe email de aviso)

---

## ✅ Checklist completo:

- [ ] Criar conta OpenAI
- [ ] Verificar email
- [ ] Adicionar cartão de crédito
- [ ] Adicionar créditos ($10-20)
- [ ] Criar API Key
- [ ] Copiar a chave (começa com sk-...)
- [ ] Colar no arquivo `.env`
- [ ] Salvar `.env`
- [ ] Reiniciar bot
- [ ] Ver mensagem "ÁUDIO HABILITADO"
- [ ] Testar com áudio real
- [ ] Configurar limite de gasto
- [ ] 🎉 **FUNCIONANDO!**

---

## 🆘 Problemas comuns:

### ❌ "Payment method required"

→ Você precisa adicionar cartão e créditos primeiro

### ❌ "Invalid API key"

→ Copiou a chave errada ou incompleta. Pegue nova chave.

### ❌ "Insufficient credits"

→ Saldo acabou. Adicione mais créditos.

### ❌ Modo ainda é "TEXTO apenas"

→ Verifique se:

1. Salvou o arquivo `.env`
2. Reiniciou o bot
3. Chave está correta (sem espaços extras)

### ❌ Bot pede para enviar texto quando mando áudio

→ Áudio não está habilitado. Repita os passos acima.

---

## 🎯 Resultado final:

**ANTES (sem OpenAI):**

```
Cliente: [envia áudio]
Bot: "Recebi seu áudio, pode digitar?"
```

**DEPOIS (com OpenAI):**

```
Cliente: [envia áudio: "oi, quero saber do financiamento"]
Bot: "Olá, tudo bem? 😊 Você clicou em nosso anúncio..."
```

---

## 💡 Dicas finais:

1. **Guarde a API Key** em lugar seguro (nunca compartilhe!)
2. **Monitore os gastos** na primeira semana
3. **$10 dura MUITO** para bot de leads
4. **Configure limite** para não ter surpresas
5. **Whisper é excelente** em português!

---

**Pronto! Agora é só seguir o passo a passo!** 🚀

**Tempo real:** 10-15 minutos do início ao fim.

Qualquer dúvida durante o processo, me chama! 😊
