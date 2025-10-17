# 📋 CASOS DE MELHORIA DO BOT

> Documentação de casos reais onde o bot precisa ser ajustado/melhorado
>
> **Metodologia:** Ir pontuando e corrigindo conforme surgem problemas reais
> **Objetivo:** Refinar o bot organicamente com feedback de conversas reais

---

## 🔴 Caso #1 - Casamento e Compra de Imóvel

**Data:** 16/10/2025  
**Cliente:** Thiago (teste com número do Rodrigo)

### Problema Identificado:

Bot respondeu **incorretamente** que pessoa casada pode comprar imóvel sozinha.

**Conversa Real:**

```
Cliente: "Agora, me conta: seu pai trabalha de carteira assinada ou é autônomo?"
Bot: "Oi, Thiago! 😊
Sim, é possível você comprar o imóvel sozinho, mesmo sendo casado.
Porém, é sempre bom considerar a opinião e a situação financeira do seu
cônjuge, pois isso pode ajudar na análise de crédito e até mesmo na
escolha do imóvel.

Agora, me conta: seu pai trabalha de carteira assinada ou é autônomo?"
```

### Resposta INCORRETA ❌:

- "é possível você comprar o imóvel sozinho, mesmo sendo casado"

### Resposta CORRETA ✅:

**Se casado NO CIVIL (com certidão de casamento):**

- É **OBRIGATÓRIO** incluir o cônjuge na compra
- Renda do cônjuge **DEVE** ser considerada no financiamento
- Ambos precisam assinar a documentação

**Se união estável ou solteiro:**

- Pode comprar sozinho
- Não precisa incluir companheiro(a)

**Abordagem ideal:**

> "Como você é casado no civil, será necessário incluir seu cônjuge no processo de compra,
> incluindo a renda dele(a) na análise de crédito. Isso é exigência legal para financiamentos.
>
> Mas não se preocupe! Podemos fazer uma avaliação sem compromisso para ver as melhores
> opções para vocês. 😊
>
> Agora me conta: seu cônjuge também trabalha? Qual a situação dele(a)?"

### Ação Necessária:

- [x] Adicionar regra específica no prompt sobre estado civil e compra ✅ **Implementado 16/10/2025**
- [x] Bot deve perguntar "casado no papel ou união estável?" se relevante ✅
- [x] Sempre mencionar "avaliação sem compromisso" para suavizar ✅

**Implementação:**

```javascript
// Adicionado em src/prompts.js:
REGRAS SOBRE ESTADO CIVIL E COMPRA (IMPORTANTE - LEI BRASILEIRA):
- Se CASADO NO CIVIL → Obrigatório incluir cônjuge
- Se UNIÃO ESTÁVEL → Pode sozinho, mas melhor incluir
- Se SOLTEIRO → Pode sozinho
- Sempre confirmar tipo de casamento antes de responder
```

---

## 🔴 Caso #2 - Bot Volta para Pergunta Anterior

**Data:** 16/10/2025  
**Cliente:** Thiago (teste com número do Rodrigo)

### Problema Identificado:

Cliente desviou do assunto (não respondeu sobre o pai), mas bot **voltou a insistir** na pergunta anterior ao invés de seguir o novo rumo da conversa.

**Conversa Real:**

```
Bot: "Agora, me conta: seu pai trabalha de carteira assinada ou é autônomo?"
Cliente: [Desvia - pergunta sobre comprar sozinho sendo casado]
Bot: [Responde sobre casamento] + "Agora, me conta: seu pai trabalha de carteira assinada ou é autônomo?"
```

### Comportamento INCORRETO ❌:

- Bot força volta para pergunta que cliente ignorou
- Perde naturalidade da conversa
- Cliente já mostrou que não quer falar daquilo naquele momento

### Comportamento CORRETO ✅:

- Seguir o novo rumo que cliente deu à conversa
- Ser flexível e não forçar fluxo linear rígido
- Pode retomar pergunta antiga DEPOIS, se contexto permitir
- Respeitar quando cliente muda de assunto (pode ser desconforto)

**Exemplo ideal:**

```
Cliente: [Desvia do assunto do pai, pergunta sobre casamento]
Bot: [Responde sobre casamento]
Bot: "Entendi sua situação. E sobre sua renda atual, você trabalha de carteira
assinada ou é autônomo?"
[Nova pergunta relacionada, não volta para "o pai"]
```

### Ação Necessária:

- [x] Ajustar prompt: "Não force perguntas que cliente ignorou" ✅ **Implementado 16/10/2025**
- [x] Bot deve perceber desvio de assunto e seguir novo rumo ✅
- [x] Se cliente não responde algo 2x, mudar de abordagem ✅
- [x] Adicionar: "Cliente pode estar desconfortável com certa pergunta" ✅

**Implementação:**

```javascript
// Adicionado em src/prompts.js:
CONTEXTO DA CONVERSA - SEJA FLEXÍVEL E NATURAL:
- NÃO force respostas para perguntas que cliente ignorou
- Se cliente muda de assunto, SIGA o novo rumo naturalmente
- Se cliente não responde 2x, mude de abordagem
- Cliente pode estar desconfortável - seja sensível
- Mantenha fluidez conversacional - não é formulário rígido
```

---

## 🟢 Caso #3 - Cliente Quer Agendar Visita

**Data:** 16/10/2025  
**Cliente:** Ana Cláudia (feedback direto)  
**Status:** ✅ Implementado

### Problema Identificado:

Cliente diz: "Quero agendar uma visita"  
Bot responde: Volta para perguntas de qualificação (renda, idade, trabalho)  
Resultado: Cliente frustrado

**Conversa Real:**

```
Cliente: "Oi, eu gostaria de agendar uma visita com vocês"
Bot (ANTIGO): "Qual sua renda familiar aproximada?"
Cliente (frustrado): "Não, eu quero a gente dar visita agora"
Bot (ANTIGO - voltando ao mesmo): "Qual é seu tipo de trabalho?"
```

### Resposta INCORRETA ❌:

- Bot segue fluxo linear rígido de qualificação
- Não detecta que cliente já quer agendar
- Volta para perguntas que cliente ignorou

### Resposta CORRETA ✅:

**Se cliente menciona "agendar", "marcar", "visita", "ir aí", "passar aí", "presencialmente":**

1. **PULE** qualificação incompleta
2. **VÁ DIRETO** para: "Qual dia/hora pra você?"
3. Após confirmar: "Se puder, leve seus documentos pessoais!"
4. **IMPORTANTE:** Bot para de responder após agendamento (Ana assume)

**Motivo:** Na presença física, documentos são extraídos ao vivo (maioria digital)

**Exemplo ideal:**

```
Cliente: "Quero agendar uma visita com vocês"
Bot: "Ótimo! Qual dia e horário seria melhor pra você essa semana?
Atendemos seg-sex, 9h-18h 😊"

Cliente: "Amanhã às 14h"
Bot: "Perfeito! Amanhã às 14h está reservado pra você! ✅
Se conseguir, leva seus documentos pessoais (RG e CPF). A Ana vai entrar em contato! 📄"

[FIM - Ana assume]
```

### Ação Necessária:

- [x] Adicionar palavras-chave de agendamento em `src/message-handler.js` ✅ **Implementado 16/10/2025**
- [x] Detectar "agendar", "marcar", "visita", "ir aí", "passar aí", etc ✅
- [x] Pular qualificação e ir direto para agendamento ✅
- [x] Adicionar respostas em `src/prompts.js` ✅
- [x] Salvar agendamento em `appointments` table ✅

**Implementação:**

```javascript
// Adicionado em src/message-handler.js (linhas 64-107):
const palavrasAgendamento = [
  "agendar", "marcar", "visita",
  "ir aí", "ir ai", "passar aí", "passar ai",
  "presencial", "presencialmente",
  "qual dia", "qual hora", "qual horário",
  // ... mais palavras
];

if (querAgendarVisita && conversation.context.stage !== "agendamento") {
  conversation.context.stage = "agendamento";
  return resposta de agendamento;
}
```

**Novas respostas em src/prompts.js:**

```javascript
AGENDAMENTO_PERGUNTA_HORARIO: `Ótimo! Qual dia e horário seria melhor pra você essa semana?...`;

AGENDAMENTO_CONFIRMACAO: `Perfeito! Anotado aqui: {dia} às {hora}...`;
```

**Status:** ✅ Implementado (16/10/2025 - 15:10)

---

## 🎯 Próximos Casos

### Template para Documentar Novos Casos:

```markdown
## 🔴 Caso #X - [Título Descritivo]

**Data:** DD/MM/YYYY
**Cliente:** [Nome ou identificação]

### Problema Identificado:

[Descrever o que aconteceu de errado]

### Conversa Real:
```

[Colar trecho relevante da conversa]

```

### Resposta INCORRETA ❌:
[O que o bot fez/disse de errado]

### Resposta CORRETA ✅:
[Como deveria ter sido]

### Ação Necessária:
- [ ] [Lista de ajustes necessários]
```

---

## 📊 Status de Implementação

| Caso                   | Status          | Prioridade | Data Implementação |
| ---------------------- | --------------- | ---------- | ------------------ |
| #1 - Casamento         | ✅ Implementado | Alta       | 16/10/2025         |
| #2 - Pergunta Anterior | ✅ Implementado | Média      | 16/10/2025         |
| #3 - Agendamento       | ✅ Implementado | Alta       | 16/10/2025         |

---

## 💡 Aprendizados Gerais

### Princípios para Melhorias:

1. **Não automatizar escalação** - Evitar chamar Ana humana em excesso
2. **Ajustes pontuais** - Corrigir casos específicos conforme surgem
3. **Testes reais** - Usar conversas reais como base
4. **Documentar tudo** - Manter histórico de problemas e soluções
5. **Iteração gradual** - Melhorar o bot organicamente

### Quando NÃO Escalar para Ana Humana:

- ❌ Bot não souber qualquer coisa simples
- ❌ Cliente fizer pergunta genérica
- ❌ Dúvida que pode ser resolvida com mais contexto

### Quando SIM Escalar para Ana Humana:

- ✅ Cliente explicitamente pede para falar com humano
- ✅ Cliente está claramente insatisfeito/irritado
- ✅ Negociação avançada (valores, condições especiais)
- ✅ Problema técnico/legal complexo
- ✅ Cliente pronto para fechar negócio

---

**Última Atualização:** 16/10/2025  
**Próxima Revisão:** Após 10 conversas ou 1 semana
