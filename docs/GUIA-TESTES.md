# 🧪 GUIA DE TESTES - WhatsBot IA

## 📅 Testes programados: Amanhã cedo

### ✅ Checklist PRÉ-TESTE:

- [ ] Mac conectado na energia (carregador)
- [ ] Wi-Fi estável conectado
- [ ] Seu número de WhatsApp disponível para teste
- [ ] Amigo/familiar disponível para mandar mensagens de teste
- [ ] Terminal aberto nesta pasta

---

## 🚀 Como iniciar o teste AMANHÃ:

### **Passo 1: Abrir o terminal nesta pasta**

```bash
cd /Users/rodrigobezerra/whatsbot
```

### **Passo 2: Rodar o bot**

```bash
./start-bot.sh
```

**Isso vai:**

- ✅ Iniciar o bot
- ✅ Manter seu Mac acordado automaticamente
- ✅ Mostrar o QR Code para conectar

---

## 📱 PASSO A PASSO DO TESTE:

### **1️⃣ Iniciar o bot (1 min)**

No terminal:

```bash
./start-bot.sh
```

**Vai aparecer:**

- 🚀 Mensagens de inicialização
- 📱 Um **QR Code grande** no terminal
- ⏳ "Aguardando QR Code..."

### **2️⃣ Conectar seu WhatsApp (1 min)**

1. Abra o WhatsApp no seu celular
2. Toque nos **3 pontinhos** (Android) ou **Configurações** (iPhone)
3. Vá em **Aparelhos conectados**
4. Toque em **Conectar aparelho**
5. **Escaneie o QR Code** do terminal
6. ✅ Vai aparecer: "Bot conectado com sucesso!"

### **3️⃣ Testar com mensagens (10-15 min)**

**Peça para um amigo te mandar uma mensagem NOVA**

Exemplo de conversa para testar:

```
Amigo: Olá, vi o anúncio
Bot: Olá, tudo bem? 😊 Você clicou em nosso anúncio...

Amigo: Sim
Bot: Me chamo Ana Cláudia... Qual seu nome?

Amigo: João Silva
Bot: [Continua qualificando...]

Amigo: Trabalho de carteira assinada
Bot: [Pergunta sobre renda...]

Amigo: Ganho 3000 reais
Bot: [Continua o fluxo...]

Amigo: Quero fazer a análise de crédito
Bot: Maravilha! 🎉
```

**➡️ Nesse momento você recebe um ALERTA no seu WhatsApp!** 🚨

---

## 📊 O que você vai ver no terminal:

```
=================================================
📩 Mensagem de: João Silva
💬 Conteúdo: Olá, vi o anúncio
🕐 Horário: 14/10/2025 08:30:15
🤖 Resposta enviada: Olá, tudo bem? 😊...
=================================================
```

---

## 🧪 Cenários para TESTAR:

### ✅ **Teste 1: Fluxo completo**

- Cliente interessado → qualifica → aceita análise
- **Resultado esperado:** Você recebe alerta

### ✅ **Teste 2: Objeção "tá caro"**

- Cliente pergunta preço → acha caro
- **Resultado esperado:** Bot contorna a objeção

### ✅ **Teste 3: Objeção "vou pensar"**

- Cliente diz que vai pensar
- **Resultado esperado:** Bot incentiva análise

### ✅ **Teste 4: Desqualificação - Renda baixa**

- Cliente diz que ganha R$ 1.500
- **Resultado esperado:** Bot desqualifica educadamente

### ✅ **Teste 5: Perguntas sobre imóvel**

- "Onde fica?" / "Qual o valor?" / "Qual a entrada?"
- **Resultado esperado:** Bot responde e volta a qualificar

---

## 🛑 Como parar o teste:

1. No terminal: pressione `Ctrl + C`
2. Aguarde: "Bot encerrado com sucesso!"
3. ✅ Pronto!

---

## 🔧 Se algo der errado:

### ❌ **QR Code não aparece:**

- Aguarde 30-60 segundos
- Verifique sua conexão com internet

### ❌ **Erro ao conectar:**

```bash
# Delete a sessão antiga e tente novamente
rm -rf .wwebjs_auth
./start-bot.sh
```

### ❌ **Bot não responde:**

- Certifique-se que a mensagem é NOVA (enviada após conectar)
- Verifique se o terminal ainda está aberto
- Veja se há erros no terminal

### ❌ **Mac dormiu:**

- Certifique-se de usar `./start-bot.sh` (não apenas `npm start`)
- Conecte o Mac na energia

---

## ✅ Checklist de SUCESSO:

Após os testes, marque o que funcionou:

- [ ] ✅ Bot conectou sem erros
- [ ] ✅ QR Code apareceu e foi escaneado
- [ ] ✅ Bot responde automaticamente
- [ ] ✅ Tom de voz amigável com emojis
- [ ] ✅ Faz uma pergunta por vez
- [ ] ✅ Qualifica corretamente (renda, idade, trabalho)
- [ ] ✅ Trata objeções adequadamente
- [ ] ✅ Envia alerta quando cliente aceita análise
- [ ] ✅ Desqualifica quando necessário

---

## 📝 Anote durante o teste:

**Coisas que funcionaram bem:**

-

**Coisas para melhorar:**

-

**Erros encontrados:**

-

---

## 🎯 Próximos passos (se os testes forem bem):

1. ✅ Comprar chip novo para o cliente
2. ✅ Configurar o bot com o número do chip
3. ✅ Cliente testa por 7 dias
4. ✅ Avaliar resultados
5. 🚀 Decidir sobre Fase 2 (plataforma web)

---

## 💡 IMPORTANTE para amanhã:

1. **Mantenha o terminal aberto e visível** durante todo o teste
2. **Não feche o terminal** enquanto estiver testando
3. **Peça para seu amigo esperar** o bot responder antes de mandar nova mensagem
4. **Tire prints** das conversas (boas e ruins)
5. **Anote qualquer comportamento estranho**

---

## ⏰ Estimativa de tempo:

- Configuração inicial: **5 minutos**
- Testes de conversa: **15-20 minutos**
- Testes de diferentes cenários: **20-30 minutos**
- **Total: ~1 hora de teste completo**

---

**Tudo pronto para amanhã!** 🚀

Qualquer dúvida durante o teste, é só chamar!
