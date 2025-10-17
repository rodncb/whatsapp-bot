# 🧪 TESTES DE AGENDAMENTO COM VALIDAÇÃO DE HORÁRIO

**Data:** 16/10/2025 - 15:30  
**Status:** ✅ IMPLEMENTADO E RODANDO  
**Versão do Bot:** whatsbot-ana - Restart #7

---

## ✅ Checklist de Funcionalidades

### 1. Detecção de Agendamento

- [x] Bot detecta "agendar", "marcar", "visita", "ir aí", etc
- [x] Pula qualificação automaticamente
- [x] Muda stage para "agendamento"
- [x] Responde com pergunta de horário

### 2. Variações de Resposta

- [x] AGENDAMENTO_PERGUNTA_HORARIO_VARIANTS (4 variações)
- [x] Escolhe aleatoriamente (não repete sempre)
- [x] Todas mencionam horário de funcionamento

### 3. Parser de Horários

Detecta corretamente:

- [ ] "às 14h" → 14
- [ ] "às 3 da tarde" → 15
- [ ] "14:30" ou "14h30" → 14:30
- [ ] "8 da manhã" → 8
- [ ] "9 da noite" → 21

### 4. Parser de Dias

Detecta corretamente:

- [ ] "hoje" → dia de hoje
- [ ] "amanhã" → próximo dia
- [ ] "segunda", "terça", etc
- [ ] "sábado" → identifica como weekend

### 5. Validação de Horário

✅ **Regras Implementadas:**

- Seg-Sexta: 9h-18h
- Sábado: 9h-12h
- Domingo: FECHADO

**Cenários Válidos:**

- [ ] Segunda às 10h ✅
- [ ] Quinta às 16h ✅
- [ ] Sábado às 11h ✅

**Cenários Inválidos - 1ª Rejeição:**

- [ ] Sábado às 18h → "Sábado não temos à noite. Você teria disponibilidade para uma manhã de sábado..."
- [ ] Segunda às 8h → "A gente abre às 9h e fecha às 18h..."
- [ ] Domingo qualquer hora → "Infelizmente domingo não funcionamos..."

**Cenários Escalação - 2ª Rejeição:**

- [ ] Cliente propõe sábado 18h
- [ ] Bot rejeita e oferece alternativas
- [ ] Cliente insiste em sábado 18h NOVAMENTE
- [ ] Bot aceita proposta e marca como "waiting_for_ana"
- [ ] **Ana recebe notificação automática** com escalação

### 6. Confirmação de Agendamento

- [ ] Horário válido → Confirma imediatamente
- [ ] Salva em conversation.context (scheduledDay, scheduledHour)
- [ ] Notifica Ana automaticamente
- [ ] Mensagem: "Perfeito! 🎉 Anotado aqui: [dia] às [hora]h"
- [ ] Stage muda para "agendamento_confirmado"

---

## 🧪 Testes Manualmente

### Teste 1: Fluxo Perfeito (Válido)

```
Cliente: "Quero agendar uma visita"
Bot: [Pergunta horário - variação aleatória]
Cliente: "Sábado às 11h"
Bot: "Perfeito! 🎉 Anotado aqui: sábado às 11h..."
Ana: [Recebe notificação silenciosa]
```

**Status:** ⏳ PENDENTE

### Teste 2: Sábado Tarde (1ª Rejeição)

```
Cliente: "Quero agendar"
Bot: [Pergunta horário]
Cliente: "Sábado às 18h"
Bot: "Sábado não temos à noite..."
Cliente: [Aguarda resposta]
```

**Status:** ⏳ PENDENTE

### Teste 3: Sábado Tarde (Escalação)

```
Cliente: "Quero agendar"
Bot: [Pergunta horário]
Cliente: "Sábado às 18h"
Bot: [1ª rejeição - oferece alternativas]
Cliente: "Tá, mas pode ser sábado às 18 mesmo?"
Bot: [Aceita e marca para Ana]
Ana: [Recebe: "⚠️ ESCALAÇÃO DE AGENDAMENTO - Cliente insistiu em horário fora do funcionamento"]
```

**Status:** ⏳ PENDENTE

### Teste 4: Segunda De Manhã Cedo

```
Cliente: "Quero agendar segunda"
Bot: [Pergunta horário]
Cliente: "Segunda às 8h"
Bot: "A gente abre às 9h e fecha às 18h... Você poderia vir segunda em um horário entre 9h e 18h?"
```

**Status:** ⏳ PENDENTE

### Teste 5: Domingo (Inválido)

```
Cliente: "Quero agendar domingo"
Bot: [Pergunta horário]
Cliente: "Domingo às 15h"
Bot: "Infelizmente domingo não funcionamos. Mas temos disponibilidade segunda a sexta (9h-18h) ou sábado de manhã (até 12h). Qual seria melhor?"
```

**Status:** ⏳ PENDENTE

---

## 📊 Métricas de Teste

| Cenário             | Expected      | Actual | Status |
| ------------------- | ------------- | ------ | ------ |
| Parser "às 14h"     | 14            | ?      | ⏳     |
| Parser "3 da tarde" | 15            | ?      | ⏳     |
| Sábado 11h          | ✅ Válido     | ?      | ⏳     |
| Sábado 18h          | ❌ Inválido   | ?      | ⏳     |
| Domingo             | ❌ Inválido   | ?      | ⏳     |
| 2ª rejeição → Ana   | ✅ Notificada | ?      | ⏳     |

---

## 🔧 Código Alterado

### `src/message-handler.js`

**Linhas 16-139:** Funções de parsing

- `parseTimeFromMessage()` - Parser de horários
- `parseDayFromMessage()` - Parser de dias
- `getDayName()` - Retorna nome do dia
- `isTimeValidForScheduling()` - Valida contra schedule

**Linhas 160-175:** Inicialização com novos campos

- `scheduleAttempts` - Contador de tentativas
- `scheduledDay` - Dia agendado
- `scheduledHour` - Hora agendada
- `requiresManualHandling` - Flag para Ana

**Linhas 264-335:** Lógica de validação

- Detecta dia e hora
- Valida se está dentro do horário funcionamento
- 1ª rejeição com oferecimento de alternativas
- 2ª rejeição com escalação e notificação Ana

**Linhas 248-254:** Variações de resposta

- Escolhe aleatoriamente de AGENDAMENTO_PERGUNTA_HORARIO_VARIANTS

### `src/prompts.js`

**Linhas 313-335:** Respostas de agendamento

- `AGENDAMENTO_PERGUNTA_HORARIO` - Resposta padrão
- `AGENDAMENTO_PERGUNTA_HORARIO_VARIANTS` - 4 variações adicionadas

---

## 📝 Notas Importantes

1. **Escalação Silenciosa**: Quando cliente insiste 2x, Ana é notificada mas cliente não sabe
2. **Persistência de Estado**: scheduleAttempts persiste na RAM durante a conversa
3. **Notificação Ana**: Inclui `reason` e `contactInfo` estruturados
4. **Stage "waiting_for_ana"**: Indica que cliente precisa de atendimento manual

---

## ⚠️ Observações de Teste

- Verificar logs do bot ao receber mensagens
- Confirmar que Ana recebe notificações no segundo "não"
- Validar que responses variam (não repetem sempre)
- Confirmar que 2ª tentativa de sábado 18h não é aceita mas escalada
