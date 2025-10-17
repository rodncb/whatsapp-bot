# 🎯 FLUXO DE AGENDAMENTO - VERSÃO FINAL (v2)

**Status:** ✅ Restart #9 Online  
**Data:** 16/10/2025 16:05

---

## 📊 Diagrama Visual do Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│ CLIENTE QUER AGENDAR                                        │
│ "Quero agendar uma visita"                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ BOT PULA QUALIFICAÇÃO        │
        │ Stage: greeting → agendamento│
        └──────────────────┬───────────┘
                          │
                          ▼
        ┌──────────────────────────────────────────┐
        │ BOT PERGUNTA (com variação aleatória):   │
        │ "Qual dia e horário seria melhor?"       │
        │ "Seg-sex 9h-18h, sábado até meio-dia"   │
        └──────────────────┬───────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │ CLIENTE RESPONDE COM HORÁRIO      │
        └────────┬────────────────────┬─────┘
                 │                    │
        ┌────────▼────────┐  ┌───────▼──────────┐
        │ HORÁRIO VÁLIDO  │  │ HORÁRIO INVÁLIDO │
        │ (seg-sex,       │  │ (fora do         │
        │  sábado até 12h)│  │  funcionamento)  │
        └────────┬────────┘  └───────┬──────────┘
                 │                    │
         ┌───────▼────────┐   ┌──────▼─────────────────┐
         │ PRIMEIRA VEZ?  │   │ scheduleAttempts += 1  │
         │                │   │                        │
         │ SIM → CONFIRMA │   │ [scheduleAttempts = 1] │
         │      AGENDAMENTO   │                        │
         │                │   │ BOT REJEITA:           │
         │ Stage:         │   │ "Sábado não temos à    │
         │ agendamento_   │   │  noite. Você poderia   │
         │ confirmado     │   │  vir de manhã?"        │
         │                │   │                        │
         │ Ana notificada │   │ Stage: waiting_for_ana │
         │ (silencioso)   │   │                        │
         │                │   │ ✋ SEM notificar Ana   │
         └────────────────┘   └──────┬─────────────────┘
                                     │
                         ┌───────────┴───────────┐
                         │ CLIENTE RESPONDE      │
                         │ NOVAMENTE             │
                         └───────┬───────────┬───┘
                                 │           │
                    ┌────────────▼───┐   ┌──▼──────────────┐
                    │ HORÁRIO VÁLIDO │   │ HORÁRIO INVÁLIDO│
                    │ (oferecido)    │   │ (INSISTE no     │
                    │                │   │  mesmo inválido)│
                    │ CONFIRMA       │   │                 │
                    │ AGENDAMENTO    │   │ scheduleAttempts│
                    │                │   │ = 2             │
                    │ Ana notificada │   │                 │
                    │ (silencioso)   │   │ 🚨 ESCALAÇÃO    │
                    └────────────────┘   │                 │
                                        │ BOT REJEITA     │
                                        │ NOVAMENTE:      │
                                        │ "Sábado não     │
                                        │  temos à noite.."
                                        │                 │
                                        │ Ana NOTIFICADA: │
                                        │ "⚠️ ESCALAÇÃO  │
                                        │  Cliente insistiu│
                                        │  2x em sábado 13h│
                                        │  Marcar para    │
                                        │  manual handling"│
                                        │                 │
                                        │ Stage:          │
                                        │ waiting_for_ana │
                                        │                 │
                                        │ ✅ Ana notificada
                                        └─────────────────┘
```

---

## 🔄 Estados da Conversa

| Stage                           | Descrição                             | scheduleAttempts | Ana Notificada? |
| ------------------------------- | ------------------------------------- | ---------------- | --------------- |
| `agendamento`                   | Esperando resposta de horário         | 0                | ❌ Não          |
| `waiting_for_ana` (1ª rejeição) | Cliente rejeitou, oferece alternativa | 1                | ❌ **Não**      |
| `waiting_for_ana` (2ª rejeição) | Cliente insistiu 2x, escalação        | 2                | ✅ **Sim**      |
| `agendamento_confirmado`        | Horário válido confirmado             | N/A              | ✅ **Sim**      |

---

## 💬 Exemplos de Resposta (O Cliente VÊ)

### Cenário 1: Cliente acerta na 1ª ✅

```
Cliente: "Quero agendar sábado às 11h"
Bot: "Perfeito! 🎉 Anotado aqui: sábado às 11h
      Se conseguir, leva seus documentos pessoais (RG e CPF)
      Vou te enviar o endereço. Até lá! 😊"

⚠️ Cliente acha que está falando com Ana o tempo todo
✅ Ana é notificada silenciosamente
```

### Cenário 2: Cliente erra, corrige na 2ª ✅

```
Cliente: "Pode ser sábado às 13h?"
Bot: "Sábado não temos disponibilidade à noite. 😅
      Nós atendemos sábado de manhã (até 12h).
      Você teria disponibilidade para uma manhã de sábado
      ou um dia da semana (segunda a sexta, 9h-18h)?
      Qual seria melhor pra você?"

Cliente: "Tá, sábado às 11h então"
Bot: "Perfeito! 🎉 Anotado: sábado às 11h..."

✅ Resolvido na 2ª tentativa
✅ Ana é notificada com agendamento
```

### Cenário 3: Cliente INSISTE em inválido ⚠️

```
Cliente: "Pode ser sábado às 13h?"
Bot: "Sábado não temos à noite. Você teria
      disponibilidade para uma manhã de sábado
      ou um dia da semana?"

⚠️ scheduleAttempts = 1
✋ Ana NÃO é notificada

Cliente: "Mas pode ser sábado às 13 mesmo?"
Bot: "Sábado não temos disponibilidade à noite..."

⚠️ scheduleAttempts = 2
🚨 Ana AGORA recebe: "⚠️ ESCALAÇÃO - Cliente insistiu 2x..."
```

---

## 🎯 Pontos-Chave

✅ **Educado:** 1ª rejeição oferece alternativas gentilmente  
✅ **Persistente:** Só escalona após 2 tentativas inválidas  
✅ **Transparente:** Cliente nunca sabe que não está falando com Ana  
✅ **Eficiente:** Se cliente aceita alternativa, confirma na hora

---

## 🧪 Como Testar

Copie e cole para testar com o bot:

**Teste 1 (Válido):**

```
"quero agendar"
"sábado às 11h"
```

**Teste 2 (Rejeição + Aceita Alternativa):**

```
"quero agendar"
"sábado às 13h"
[Bot oferece alternativa]
"tá, sábado às 11h"
```

**Teste 3 (Insistência 2x):**

```
"quero agendar"
"sábado às 13h"
[Bot oferece alternativa]
"mas pode ser 13 mesmo?"
[Bot escalona para Ana silenciosamente]
```

---

## 📌 Última Atualização

- **v1:** Validação básica + escalação na 1ª rejeição ❌
- **v2:** Escalação na 2ª rejeição + sem mencionar Ana ✅

**Status:** 🟢 Online e testado com cliente real
