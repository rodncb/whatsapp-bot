# 🧪 Bot de TESTE - Rodrigo

## 📱 Para que serve?

Bot simples para **TESTAR** se o WhatsApp está funcionando no seu número (+5524981058194).

**O que ele faz:**

- ✅ Responde **TODAS as mensagens** automaticamente
- ❌ **NÃO responde** em grupos
- ❌ **NÃO responde** suas próprias mensagens

**Resposta automática:**

```
Oi! Sou o assistente do Rodrigo (em treinamento 🤖).

Já avisei ele, aguarde que logo ele responde! 😊
```

---

## 🚀 Como usar:

### **1️⃣ Iniciar o bot de teste**

```bash
./start-bot-teste.sh
```

### **2️⃣ Escanear QR Code**

1. Aparece QR Code no terminal
2. Abra **SEU WhatsApp** (+5524981058194)
3. Vá em **Aparelhos Conectados**
4. Escaneia o QR Code
5. ✅ Conectado!

### **3️⃣ Testar**

Peça para alguém te mandar mensagem:

- Pode ser texto
- Pode ser áudio
- Pode ser imagem
- Qualquer coisa!

**Bot vai responder automaticamente** com a mensagem:

```
Oi! Sou o assistente do Rodrigo (em treinamento 🤖).

Já avisei ele, aguarde que logo ele responde! 😊
```

### **4️⃣ Parar o bot**

No terminal: `Ctrl + C`

---

## 📊 O que você vai ver no terminal:

```
==================================================
📩 Mensagem de: João Silva
📱 Número: 5521987654321@c.us
📝 Tipo: chat
💬 Conteúdo: Oi Rodrigo, tudo bem?
🕐 Horário: 14/10/2025 09:30:15
🤖 Resposta automática enviada!
==================================================
```

---

## 🎯 Diferenças entre os bots:

| Feature      | Bot TESTE              | Bot ANA CLÁUDIA        |
| ------------ | ---------------------- | ---------------------- |
| **Comando**  | `./start-bot-teste.sh` | `./start-bot.sh`       |
| **Número**   | Seu (+5524981058194)   | Cliente (a definir)    |
| **Resposta** | Fixa e simples         | IA complexa (Arcee.ai) |
| **Objetivo** | Testar conexão         | Atender leads          |
| **IA**       | ❌ Não usa             | ✅ Arcee.ai + OpenAI   |
| **Sessão**   | `.wwebjs_auth_teste/`  | `.wwebjs_auth/`        |

---

## ⚠️ IMPORTANTE:

### **NÃO rode os 2 bots ao mesmo tempo no MESMO número!**

❌ **ERRADO:**

```bash
# Terminal 1
./start-bot-teste.sh    # Conecta com seu número

# Terminal 2
./start-bot.sh          # Tenta conectar com seu número também
```

✅ **CERTO - Opção 1:**

```bash
# Testa seu número
./start-bot-teste.sh    # Conecta com +5524981058194
```

✅ **CERTO - Opção 2:**

```bash
# Testa com número da Ana Cláudia
./start-bot.sh          # Conecta com número dela
```

✅ **CERTO - Opção 3:**

```bash
# Testa os 2, mas números diferentes
# Terminal 1
./start-bot-teste.sh    # +5524981058194

# Terminal 2 (outro Mac ou depois)
./start-bot.sh          # Número da Ana Cláudia
```

---

## 🧪 Roteiro de teste sugerido:

### **Teste 1: Mensagem de texto**

1. Peça para alguém te mandar: "Oi Rodrigo"
2. Bot responde automaticamente
3. ✅ Funciona!

### **Teste 2: Mensagem em grupo**

1. Alguém te marca em grupo
2. Bot **NÃO** responde (ignora grupos)
3. ✅ Correto!

### **Teste 3: Você mesmo envia mensagem**

1. Você manda mensagem para alguém
2. Bot **NÃO** responde (ignora suas mensagens)
3. ✅ Correto!

### **Teste 4: Áudio**

1. Alguém te manda áudio
2. Bot responde automaticamente
3. ✅ Funciona!

### **Teste 5: Assumir conversa**

1. Bot responde automaticamente
2. Você envia mensagem manual pelo celular
3. Bot **NÃO** interfere mais naquela conversa
4. ✅ Você assumiu!

---

## 🔧 Troubleshooting:

### ❌ Bot não inicia

```bash
# Delete a sessão e tente novamente
rm -rf .wwebjs_auth_teste
./start-bot-teste.sh
```

### ❌ Bot responde em grupos

- Não deveria! Verifique o código em `src/bot-teste.js`
- Procure por: `if (msg.from.includes('@g.us'))`

### ❌ Bot responde suas próprias mensagens

- Não deveria! Verifique: `if (msg.fromMe)`

### ❌ Quer mudar a mensagem

Edite `src/bot-teste.js`, linha:

```javascript
const AUTO_REPLY = `Oi! Sou o assistente...`;
```

---

## 📝 Logs úteis:

O bot mostra no terminal:

- ✅ De quem veio a mensagem
- ✅ Número completo
- ✅ Tipo de mensagem (texto/áudio/mídia)
- ✅ Conteúdo (se for texto)
- ✅ Horário
- ✅ Confirmação de resposta enviada

---

## 🎯 Quando usar cada bot:

### **Use `start-bot-teste.sh` quando:**

- ✅ Quer testar se conexão WhatsApp funciona
- ✅ Quer ver logs em tempo real
- ✅ Quer testar no SEU número primeiro
- ✅ Quer validar que ignora grupos

### **Use `start-bot.sh` quando:**

- ✅ For colocar em produção com cliente
- ✅ Precisar de IA complexa (Arcee.ai)
- ✅ For teste final com Ana Cláudia

---

## 💡 Dicas:

1. **Sempre teste com bot-teste primeiro** antes de colocar IA complexa
2. **Monitore o terminal** para ver o que acontece
3. **Teste todos os cenários** (texto, áudio, grupo, etc)
4. **Valide que ignora grupos** - importante!
5. **Pode deixar rodando** enquanto trabalha em outra coisa

---

## 🎉 Resultado esperado:

**Antes:**

```
Amigo: Oi Rodrigo!
[Nada acontece...]
```

**Depois (com bot rodando):**

```
Amigo: Oi Rodrigo!
Bot: Oi! Sou o assistente do Rodrigo (em treinamento 🤖).
     Já avisei ele, aguarde que logo ele responde! 😊
```

---

**Pronto para testar!** 🚀

Qualquer dúvida, é só chamar!
