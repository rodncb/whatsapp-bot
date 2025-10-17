# 🔧 Problemas Comuns e Soluções

## ❌ Erro: "Timed out after 30000 ms while trying to connect to the browser"

### Causa:

Puppeteer não consegue encontrar o Chromium.

### Solução:

```bash
npm install puppeteer
```

Isso instala o Chromium necessário automaticamente.

### Se persistir:

1. Delete a pasta node_modules:

   ```bash
   rm -rf node_modules
   ```

2. Reinstale tudo:
   ```bash
   npm install
   ```

---

## ❌ QR Code não aparece

### Solução 1: Aguarde

- Pode demorar 30-60 segundos na primeira vez
- O Chromium precisa baixar na primeira execução

### Solução 2: Reinstale puppeteer

```bash
npm uninstall puppeteer
npm install puppeteer
```

---

## ❌ Erro: "Session closed. Most likely the page has been closed"

### Solução:

Delete a sessão antiga:

```bash
rm -rf .wwebjs_auth
rm -rf .wwebjs_auth_teste
```

Rode novamente.

---

## ❌ Mac dormiu e bot parou

### Solução:

Use sempre os scripts que começam com `./start-`:

- `./start-bot-teste.sh`
- `./start-bot.sh`

Eles usam `caffeinate` para manter o Mac acordado.

---

## ❌ Bot não responde

### Checklist:

1. Terminal ainda está aberto? ✅
2. Bot está conectado? (mensagem "✅ Bot conectado")
3. Mensagem é de grupo? (bot ignora grupos)
4. Mensagem é sua? (bot ignora mensagens próprias)

---

## ❌ Quer reconectar

### Solução:

1. Pare o bot: `Ctrl + C`
2. Delete a sessão:
   ```bash
   rm -rf .wwebjs_auth_teste  # Para bot teste
   # OU
   rm -rf .wwebjs_auth        # Para bot principal
   ```
3. Rode novamente:
   ```bash
   ./start-bot-teste.sh
   ```

---

## 💡 Dicas:

- **Primeira execução demora mais** (baixa Chromium)
- **Aguarde até 2 minutos** na primeira vez
- **Deixe o terminal aberto** sempre
- **Use Wi-Fi estável**

---

## 📞 Ainda com problema?

Mande o erro completo que aparece no terminal!
