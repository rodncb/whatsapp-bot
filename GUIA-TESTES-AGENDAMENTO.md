# 🧪 INSTRUÇÕES PARA TESTAR A VALIDAÇÃO DE AGENDAMENTO

**Data:** 16 de outubro de 2025  
**Bot:** whatsbot-ana (online, restart #7)  
**Requisito:** Cliente ou simulação de conversa via WhatsApp

---

## 🚀 Como Testar

### Pré-requisito

- Bot deve estar online: `pm2 status` → whatsbot-ana ONLINE ✅

### Teste 1: Detecção + Pergunta Dinâmica

1. Envie para o bot: **"Quero agendar uma visita"**
2. **Resultado esperado:**
   - Bot pula qualificação automaticamente
   - Responde com pergunta de horário (uma das 4 variações)
   - Menciona: "segunda a sexta 9h-18h, sábado até meio-dia"

### Teste 2: Horário Válido ✅

1. Bot pergunta: "Qual dia e horário seria melhor pra você?"
2. Você responde: **"Sábado às 11h"**
3. **Resultado esperado:**
   - Bot: "Perfeito! 🎉 Anotado aqui: sábado às 11h..."
   - Ana recebe notificação silenciosa
   - Conversa encerra fluxo de agendamento

### Teste 3: Sábado Tarde (1ª Rejeição) ⚠️

1. Bot pergunta: "Qual dia e horário seria melhor pra você?"
2. Você responde: **"Sábado às 18h"**
3. **Resultado esperado:**
   - Bot REJEITA: "Sábado não temos à noite. 😅\n\nNós atendemos sábado de manhã (até 12h). Você teria disponibilidade para uma manhã de sábado ou um dia da semana?"
   - Oferece alternativas
   - Aguarda nova resposta

### Teste 4: Sábado Tarde (Escalação) 🚨

1. Bot fez 1ª rejeição (vide Teste 3)
2. Você insiste: **"Mas pode ser sábado às 18 mesmo?"**
3. **Resultado esperado:**
   - Bot aceita aparentemente: "Anotado"
   - **MAS** marca para escalação
   - Ana recebe: "⚠️ ESCALAÇÃO DE AGENDAMENTO - Cliente insistiu em sábado 18h"
   - Você nunca fica ciente

### Teste 5: Domingo (Inválido) 🚫

1. Bot pergunta: "Qual dia e horário seria melhor pra você?"
2. Você responde: **"Domingo às 15h"**
3. **Resultado esperado:**
   - Bot: "Infelizmente domingo não funcionamos. 😅\n\nMas temos disponibilidade segunda a sexta (9h-18h) ou sábado de manhã (até 12h). Qual seria melhor?"

### Teste 6: Segunda De Manhã Cedo

1. Bot pergunta: "Qual dia e horário seria melhor pra você?"
2. Você responde: **"Segunda às 8h"**
3. **Resultado esperado:**
   - Bot: "A gente abre às 9h e fecha às 18h. Você teria disponibilidade para esse horário?"

---

## 📱 Variações para Testar Parser de Horários

O bot deve entender todos esses formatos:

```
"às 14h"               → 14h ✓
"às 3 da tarde"        → 15h ✓
"14h30"                → 14h30 ✓
"14:30"                → 14:30 ✓
"8 da manhã"           → 08h ✓
"9 da noite"           → 21h ✓
"nas 15"               → 15h ✓
```

---

## 📊 Verificação de Logs

### Para acompanhar em tempo real:

```bash
pm2 logs whatsbot-ana --lines 50
```

**Procure por estas mensagens:**

- `🎯 Cliente mencionou agendamento - pulando qualificação!`
- `⚠️ Cliente [ID] insistiu 2x em horário inválido. Marcando para Ana.`
- `📢 Ana notificada silenciosamente!`

---

## ✅ Checklist de Validação

| Teste                           | Status | Notas                  |
| ------------------------------- | ------ | ---------------------- |
| 1. Detecção + Variação          | [ ]    | Resposta varia?        |
| 2. Horário válido (sábado 11h)  | [ ]    | Ana notificada?        |
| 3. Rejeição (sábado 18h)        | [ ]    | Ofereceu alternativas? |
| 4. Escalação (2ª insistência)   | [ ]    | Ana foi notificada?    |
| 5. Domingo inválido             | [ ]    | Rejeitou corretamente? |
| 6. Segunda 8h (fora do horário) | [ ]    | Ofereceu alternativas? |

---

## 🐛 Troubleshooting

### Bot não responde

```bash
pm2 restart whatsbot-ana
pm2 logs whatsbot-ana
```

### Bot aceita sábado 18h sem rejeitar

- Verifique se parseDayFromMessage está detectando "sábado"
- Verifique se parseTimeFromMessage está extraindo "18"
- Logs: `pm2 logs whatsbot-ana`

### Ana não recebe notificação na 2ª insistência

- Verificar se `scheduleAttempts` está incrementando
- Verificar se `shouldNotifyOwner` está true
- Testar manualmente com Ana (5522999055098)

---

## 🎯 Validação Final

Para confirmar tudo está funcional:

1. ✅ Enviar "agendar" → Pula qualificação
2. ✅ Enviar "sábado 18h" → Rejeita
3. ✅ Enviar "sábado 18h" NOVAMENTE → Escalação silenciosa
4. ✅ Ana recebe notificação com contexto completo

**Se todos ✅ → PRONTO PARA PRODUÇÃO**

---

## 📝 Notas

- Cada conversa tem seu próprio `scheduleAttempts` (não interfere com outras)
- Dados persistem na RAM durante a conversa
- Escalação é silenciosa (cliente não sabe)
- Toda notificação Ana inclui resumo do cliente (nome, renda, idade, etc)

---

**Última atualização:** 16/10/2025 15:51  
**Próximo teste agendado:** Com cliente real (Ana Cláudia)
