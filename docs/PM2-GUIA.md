# 🚀 Guia PM2 - WhatsBot

## O que é PM2?
Gerenciador de processos Node.js que mantém o bot rodando em background, com auto-restart se cair.

## ✅ Vantagens:
- ✅ Bot continua rodando mesmo se fechar o terminal
- ✅ Auto-restart se der erro/crash
- ✅ Logs salvos automaticamente
- ✅ Monitora uso de memória/CPU
- ✅ Pode rodar vários bots ao mesmo tempo

---

## 📋 Comandos principais:

### Iniciar bot de teste:
```bash
pm2 start ecosystem.config.js
```

### Ver status:
```bash
pm2 status
```

### Ver logs em tempo real:
```bash
pm2 logs whatsbot-teste
```

### Parar bot:
```bash
pm2 stop whatsbot-teste
```

### Reiniciar bot:
```bash
pm2 restart whatsbot-teste
```

### Deletar bot do PM2:
```bash
pm2 delete whatsbot-teste
```

### Ver uso de CPU/memória:
```bash
pm2 monit
```

---

## 🔄 Auto-iniciar ao ligar o Mac:

```bash
# Salva configuração atual
pm2 save

# Configura auto-start no boot
pm2 startup
# (Execute o comando que aparecer na tela)
```

---

## 📊 Ver informações detalhadas:

```bash
pm2 show whatsbot-teste
```

---

## 📝 Arquivos de log:

Os logs ficam salvos em:
- **Output (normal):** `logs/bot-teste-out.log`
- **Erros:** `logs/bot-teste-error.log`

Ver logs salvos:
```bash
cat logs/bot-teste-out.log
tail -f logs/bot-teste-out.log  # Seguir em tempo real
```

---

## ⚠️ Dicas importantes:

1. **Para escanear QR Code pela primeira vez:**
   - Use o script normal: `./start-bot-teste.sh`
   - Depois que conectar, pode usar PM2

2. **PM2 vs Script normal:**
   - **Script normal:** Ver QR Code, debug interativo
   - **PM2:** Produção, rodar em background

3. **Múltiplos bots:**
   - Pode adicionar o bot de produção no `ecosystem.config.js`
   - Cada um roda independente

---

## 🆘 Problemas comuns:

### Bot não inicia:
```bash
pm2 logs whatsbot-teste --lines 50
```

### Consumindo muita memória:
```bash
pm2 restart whatsbot-teste
```

### Limpar logs antigos:
```bash
pm2 flush
```

---

## 🎯 Workflow recomendado:

### Primeira vez (escanear QR):
```bash
./start-bot-teste.sh
# Ctrl+C depois de conectar
```

### Depois (rodar em background):
```bash
pm2 start ecosystem.config.js
pm2 save
```

### Verificar se está rodando:
```bash
pm2 status
```

---

## 📱 Exemplo de uso:

```bash
# Inicia bot
pm2 start ecosystem.config.js

# Verifica status
pm2 status

# Vê logs
pm2 logs whatsbot-teste

# Sai de casa (bot continua rodando!)
# ...
# Volta pra casa

# Verifica se ainda está rodando
pm2 status

# Vê o que aconteceu
pm2 logs whatsbot-teste --lines 100
```

---

**Mais comandos:** https://pm2.keymetrics.io/docs/usage/quick-start/
