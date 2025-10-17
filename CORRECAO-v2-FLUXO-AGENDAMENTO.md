# 🔧 CORREÇÃO v2: FLUXO DE AGENDAMENTO CORRIGIDO

**Data:** 16 de outubro de 2025 - 16:05  
**Versão:** whatsbot-ana Restart #9  
**Status:** ✅ IMPLEMENTADO

---

## 🐛 Bugs Corrigidos

### Bug #1: Escalação Prematura

**Problema:** Bot escalava para Ana na 1ª tentativa inválida
**Solução:** Agora só escalona na 2ª tentativa inválida

### Bug #2: Menção de "Ana vai entrar em contato"

**Problema:** Bot dizia "A Ana vai te enviar o endereço", expondo que há transferência
**Solução:** Trocado para "Vou te enviar o endereço" (parece ser Ana o tempo todo)

---

## ✅ Fluxo Correto (3 Tentativas)

### 1ª Tentativa - Horário Inválido ❌

```
Cliente: "pode ser às 13 no sábado?"
         ↓
Bot analisa: sábado 13h (INVÁLIDO - sábado só até 12h)
         ↓
Bot rejeita: "Sábado não temos à noite. Você teria disponibilidade para
             uma manhã de sábado ou um dia da semana?"
         ↓
Stage → "waiting_for_ana"
scheduleAttempts = 1
         ↓
✋ NÃO notifica Ana (apenas oferece alternativa)
```

### 2ª Tentativa - Ainda Inválido ⚠️

```
Cliente: "pode ser mesmo assim? sábado às 13?"
         ↓
Bot analisa: sábado 13h NOVAMENTE (AINDA INVÁLIDO)
         ↓
scheduleAttempts = 2
         ↓
Bot rejeita NOVAMENTE: "Sábado não temos à noite..."
         ↓
🚨 AGORA SIM escalona para Ana silenciosamente
         ↓
✅ Ana recebe notificação:
   "⚠️ ESCALAÇÃO DE AGENDAMENTO
    Cliente insistiu 2x em horário fora do funcionamento
    Último horário: sábado às 13h"
```

### ✅ Tentativa Válida (Em Qualquer Momento)

```
Cliente: "tá, sábado às 11 então?"
         ↓
Bot analisa: sábado 11h (VÁLIDO ✅)
         ↓
Bot confirma: "Perfeito! 🎉 Anotado aqui: sábado às 11h
              Se conseguir, leva seus documentos pessoais (RG e CPF)
              Vou te enviar o endereço. Até lá! 😊"
         ↓
Stage → "agendamento_confirmado"
         ↓
✅ Ana notificada: "📅 VISITA AGENDADA! Cliente marcou para: sábado às 11h"
```

---

## 📝 Mudanças no Código

### `src/message-handler.js` (Linhas 283-345)

**ANTES:**

```javascript
if (conversation.context.scheduleAttempts >= 2) {
  // Escalona direto para Ana
  result.shouldNotifyOwner = true;
  result.reason = "...";
}
```

**DEPOIS:**

```javascript
if (conversation.context.scheduleAttempts >= 2) {
  // SÓ AGORA escalona (2ª tentativa)
  conversation.context.stage = "waiting_for_ana";
  return result com shouldNotifyOwner = true;
} else {
  // 1ª tentativa: apenas rejeita
  conversation.context.stage = "waiting_for_ana";
  return result com shouldNotifyOwner = false;
}
```

### `src/prompts.js`

**Removidas menções de "Ana vai":**

- ✅ `ATTENDANCE_CONFIRMED`: "Vou te enviar o endereço..." (não "A Ana vai")
- ✅ `LOCATION_INFO`: "Vou te passar o endereço..." (não "A Ana vai")
- ✅ `AGENDAMENTO_CONFIRMACAO`: "Vou te enviar..." (não "A Ana vai")
- ✅ `AGENDAMENTO_JA_AGENDADO`: "Vou entrar em contato..." (não "A Ana vai")

---

## 🎯 Resultado Final

| Cenário               | Antes        | Depois                 |
| --------------------- | ------------ | ---------------------- |
| Sábado 13h (1ª vez)   | Escalava Ana | Oferece alternativa    |
| Sábado 13h (2ª vez)   | Escalava Ana | Escalava Ana (correto) |
| Sábado 11h (válido)   | Confirmava   | Confirmava ✅          |
| Mensagem "Ana vai..." | ❌ Sim       | ✅ Removido            |

---

## 📊 Testes Recomendados

1. **Teste 1: Primeira rejeição**

   - Cliente: "sábado às 13"
   - Bot: Rejeita e oferece alternativas
   - Verificação: ❌ NÃO notifica Ana

2. **Teste 2: Insistência 2ª vez**

   - Cliente: "mas pode ser 13 mesmo?"
   - Bot: Rejeita novamente
   - Verificação: ✅ NOTIFICA Ana

3. **Teste 3: Cliente concorda com alternativa**

   - Cliente (após 1ª rejeição): "tá, sábado às 11 então"
   - Bot: Confirma imediatamente
   - Verificação: ✅ NOTIFICA Ana com agendamento

4. **Teste 4: Linguagem é transparente**
   - Bot nunca diz "Ana vai" ou "vou transferir"
   - Sempre parece ser Ana desde início
   - Verificação: ✅ Cliente acha que está falando com Ana o tempo todo

---

## 🚀 Status de Deploy

- Bot: **whatsbot-ana** ✅ Online (Restart #9)
- Memory: 46.6mb
- Pronto para: Testes com cliente real

---

**Próximo passo:** Teste com cliente (validar 4 cenários acima)
