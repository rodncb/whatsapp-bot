# 📝 CASO #3 - FLUXO DE AGENDAMENTO DE VISITA

**Data:** 16/10/2025 - 14:45  
**Solicitante:** Ana Cláudia (feedback de cliente real)  
**Status:** ✅ Implementado  
**Última Atualização:** 16/10/2025 - 14:50 (Adicionado atendimento sábado até meio-dia)

---

## 🎯 O PROBLEMA

### Situação Atual (Incorreta):

1. Cliente diz: "Quero agendar uma visita"
2. Bot volta para perguntas de qualificação (renda, idade, trabalho)
3. Cliente fica frustrado: "Não, eu quero agendar uma visita JÁ"
4. Bot insiste nas mesmas perguntas de novo
5. Cliente desanima

### Por que acontece:

Bot segue fluxo linear rígido:

```
Qualificação → Documentos → Agendamento
```

Mas cliente já pode estar decidido em qualquer ponto e só quer **agendar a visita**.

---

## ✅ A SOLUÇÃO DESEJADA

### Nova Regra:

**Se cliente menciona "agendar", "visita", "ir aí", "passar aí", etc:**

1. ✅ **IGNORE** as perguntas de qualificação pendentes
2. ✅ **VÁ DIRETO** para agendamento
3. ✅ Pergunte: "Qual o melhor horário pra você essa semana?"
4. ✅ OU: "Poderia ser amanhã às 10h?"
5. ✅ Confirme: "Ok, te aguardo [DIA] às [HORA]. Se puder, leve seus documentos pessoais! 📄"
6. ✅ **DEPOIS** da visita agendada, cale-se (Ana assume)

### Por que funciona:

- Cliente já decidiu = não precisa mais qualificar
- Presença física = pode extrair docs ao vivo
- Não assusta = pedido mínimo (só "leve seus docs")
- Direto = sem perguntas desnecessárias

---

## 📋 FLUXO ESPERADO

### Exemplo Real:

```
Cliente: "Oi, eu gostaria de agendar uma visita com vocês"

Bot (ANTIGO - ERRADO):
"Perfeito! Qual sua renda familiar aproximada?"

Bot (NOVO - CORRETO):
"Ótimo! Qual dia e horário seria melhor pra você essa semana? 😊"

Cliente: "Amanhã às 14h"

Bot:
"Perfeito! Anotado aqui: amanhã às 14h. Te aguardo!
Se puder, leve seus documentos pessoais (RG e CPF).
A Ana vai te enviar o endereço para confirmar! 📄"

[FIM - Ana assume]
```

---

## 🔑 PALAVRAS-CHAVE PARA DETECTAR

Quando cliente usar qualquer uma destas expressões, **PULE PARA AGENDAMENTO**:

✅ "agendar"
✅ "agendar visita"
✅ "marcar"
✅ "marcar visita"
✅ "ir aí"
✅ "passar aí"
✅ "ir pessoalmente"
✅ "presencialmente"
✅ "quero ir aí"
✅ "gostaria de ir aí"
✅ "quer agendar"
✅ "quer marcar"
✅ "quando posso ir"
✅ "que horário vocês atendem"
✅ "quanto custa" (se já está agendando, responda e agende)

---

## 💬 RESPOSTAS SUGERIDAS

### Se cliente quer agendar (simples):

```
Ótimo! Qual dia e horário seria melhor pra você?
Atendemos de segunda a sexta, das 9h às 18h, e sábado até meio-dia. 😊
```

### Se cliente sugere horário específico:

```
Perfeito! Amanhã às 10h está reservado pra você! ✅
Se puder, leve seus documentos pessoais (RG e CPF).
A Ana vai te enviar o endereço e confirmar certinho com você. 📄
```

### Após confirmar visita:

```
Ok, te aguardo [DIA] às [HORA]!
Se conseguir, traz seus documentos pessoais - facilita bastante! 📄
A Ana vai entrar em contato pra confirmar. 😊
```

---

## ⚙️ IMPLEMENTAÇÃO TÉCNICA

### Onde mexer:

- `src/prompts.js` - Adicionar nova seção de regras
- `src/message-handler.js` - Detectar palavras-chave
- `src/bot.js` - Salvar agendamento

### Pseudocódigo:

```javascript
// Em src/message-handler.js

const palavrasAgendamento = [
  "agendar",
  "marcar",
  "visita",
  "ir aí",
  "passar aí",
  "presencialmente",
  // ... mais palavras
];

if (mensagemContemPalavraDeAgendamento) {
  // Pule qualificação, vá para agendamento
  conversation.context.stage = "agendamento";
  // Pergunte data/hora
} else {
  // Fluxo normal de qualificação
}
```

### No banco de dados:

- Tabela `appointments` já existe
- Salvar: `phone_number`, `preferred_date`, `preferred_time`, `status`

---

## 📊 STATUS

| Aspecto                    | Descrição                                         |
| -------------------------- | ------------------------------------------------- |
| **Problema**               | Cliente quer agendar, bot volta para qualificação |
| **Solução**                | Detectar palavras-chave, pular para agendamento   |
| **Prioridade**             | ALTA (feedback de cliente real)                   |
| **Implementação**          | Em `src/prompts.js` e `src/message-handler.js`    |
| **Status**                 | ✅ Implementado                                   |
| **Data Solicitação**       | 16/10/2025 - 14:45                                |
| **Data Implementação**     | 16/10/2025 - 14:50                                |
| **Horário de Atendimento** | Seg-Sex 9h-18h + Sábado até 12h                   |

---

## 🆕 ATUALIZAÇÃO - SÁBADO ATÉ MEIO-DIA (16/10/2025 - 14:50)

**Feedback do Cliente:** "Pode incluir aí sábado até meio-dia também..."

**Implementado:** ✅

**Mudanças:**

- Resposta do bot agora menciona: "segunda a sexta, das 9h às 18h, e sábado até meio-dia"
- Atualizado em 3 lugares:
  1. `AGENDAMENTO_PERGUNTA_HORARIO` (resposta de agendamento direto)
  2. `ATTENDANCE_SCHEDULE` (resposta de agendamento por fluxo normal)
  3. Comentário/exemplo no SYSTEM_PROMPT

**Nova resposta:**

```
Ótimo! Qual dia e horário seria melhor pra você?
Atendemos de segunda a sexta, das 9h às 18h, e sábado até meio-dia. 😊
```

---

## 🧪 TESTES NECESSÁRIOS

### Teste 1: Cliente quer agendar direto

```
Cliente: "Oi, gostaria de agendar uma visita"
Bot: Deve ir direto para "Qual dia/hora?"
❌ NÃO deve pedir renda ou qualificação
```

### Teste 2: Cliente pula etapas

```
Cliente: [não respondeu renda]
Cliente: "Prefiro ir presencialmente"
Bot: Deve perguntar dia/hora
❌ NÃO deve perguntar renda/idade
```

### Teste 3: Visita agendada com sucesso

```
Cliente: "Amanhã às 14h"
Bot: Confirma + "Leve seus docs" + FIM
Ana assume o contato
```

### Teste 4: Recusa em agendar

```
Cliente: "Não quero visita presencial"
Bot: Volta para "Prefere WhatsApp?"
```

---

## 📝 NOTAS IMPORTANTES

### ✅ Fazer:

- Salvar agendamento no banco
- Notificar Ana: "Visita agendada para [DIA] às [HORA]"
- Pedir APENAS documentos pessoais (RG, CPF)
- Encerrar conversa de bot após agendamento

### ❌ NÃO fazer:

- Pedir muitos documentos antes da visita
- Perguntar novamente o que já sabe
- Forçar cliente a responder qualificação completa
- Assustar com listas de solicitações

### 💡 Lembrar:

- Presença física = pode extrair documentos ao vivo
- Maioria dos docs são digitais
- Cliente não precisa trazer tudo de primeira
- Ana assume a conversa após agendamento

---

## 📞 COMUNICAÇÃO PARA ANA

> "Implementei a melhoria que você pediu: quando cliente fala 'quero agendar uma visita', o bot não pede mais documentação e vai direto para marcar o horário. Após agendar, o bot para e você assume. Testa com seus próximos clientes!"

---

**Próxima atualização:** Após implementação e validação
