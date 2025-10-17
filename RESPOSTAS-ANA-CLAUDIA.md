# ✅ Respostas da Ana Cláudia - Configuração do Bot

**Data:** 14 de outubro de 2025  
**Status:** ✅ Respostas Recebidas

---

## 1️⃣ PROCESSO ATUAL

### Primeira mensagem que Ana envia:

```
Olá, tudo bem? Você clicou em nosso anúncio para saber mais informações sobre o
financiamento de imóveis, correto?

Me chamo Ana Cláudia, sou da Novo Lar Negócios Imobiliários e farei seu atendimento,
qual seu nome?
```

**Objetivo:** Confirmar interesse e obter o nome do cliente.

---

## 2️⃣ DOCUMENTAÇÃO

### Documentos solicitados (ORDEM):

**1ª SOLICITAÇÃO (simplificada):**

- ✅ RG e CPF
- ✅ Último contra-cheque (se CLT)
- ✅ Extrato bancário de 3 meses (se autônomo - não precisa contra-cheque)

**⚠️ IMPORTANTE:** Pedir APENAS esses 2-3 documentos primeiro!

- Lista grande sempre atrapalha a comunicação
- Demais documentos são pedidos depois

### Como o bot deve processar:

1. Cliente envia foto do documento
2. Bot lê a imagem (Arcee.ai)
3. Bot extrai: nome, CPF, renda
4. Bot confirma: "Vi aqui que seu nome é João Silva, CPF 123.456.789-00, certo?"
5. Salva no banco de dados
6. Notifica Ana quando documentação completa

---

## 3️⃣ PERGUNTAS MAIS COMUNS

### A) "Qual valor da entrada?"

**Resposta da Ana:**

```
Então, para sabermos valor de entrada e parcela, é necessário fazer uma análise
de crédito para saber quanto a Caixa vai liberar pra você.

Com a análise conseguimos também calcular o seu subsídio, o seu desconto.
Você trabalha de carteira assinada ou autônomo?
```

### B) "Onde é essa casa?"

**Resposta da Ana:**

```
Então, temos casas em vários locais da Cidade, a que você viu fica próxima ao
condomínio Alphaville, localização muito boa.

Você já chegou a fazer alguma análise na Caixa para compra de algum imóvel?
```

### C) "Qual o valor da casa?"

**Resposta da Ana:**

```
Então, o valor é 222 mil, mas não sai por esse valor, vai sair muito menos,
pois além do desconto que temos pela construtora, tem o desconto do subsídio,
pelo Minha Casa Minha Vida.

Hoje você trabalha de carteira assinada ou autônomo?
```

**📌 PADRÃO IDENTIFICADO:**

- Sempre direciona para análise de crédito
- Sempre pergunta: CLT ou autônomo?
- Enfatiza subsídio/desconto como vantagem

---

## 4️⃣ CRITÉRIOS DE DESQUALIFICAÇÃO

### ❌ LEAD NÃO QUALIFICADO:

- **Renda familiar abaixo de R$ 2.000**
- **Idade acima de 60 anos**

**Ação do bot:**

- Agradecer educadamente
- Não prosseguir com análise
- Não notificar Ana

---

## 5️⃣ URGÊNCIA E NOTIFICAÇÕES

### ⚡ Quando notificar Ana IMEDIATAMENTE:

- ✅ Cliente **informou** que quer fazer análise de crédito
- ✅ Cliente **aceitou** fazer análise de crédito
- ✅ Cliente enviou documentação completa

**Tempo de resposta ideal:** IMEDIATO

---

## 6️⃣ TOM DE COMUNICAÇÃO

### Estilo:

- ✅ **Próximo/Amigável**
- ✅ **Pode usar emojis** (moderadamente)
- ✅ **Linguagem acessível** (não muito formal)
- ✅ **Humanizado** (como Ana fala na vida real)

### Exemplo real da Ana:

```
"Então, o valor é 222 mil, mas não sai por esse valor, vai sair muito menos,
pois além do desconto que temos pela construtora, tem o desconto do subsídio,
pelo Minha Casa Minha Vida. 😊

Hoje você trabalha de carteira assinada ou autônomo?"
```

---

## 7️⃣ MATERIAIS

### O que Ana envia hoje:

- ✅ **Fotos dos imóveis** (principais)
- ❌ Não tem PDF/apresentação formal
- ❌ Não tem simulador de crédito

**Ação:** Bot pode pedir à Ana as fotos quando cliente demonstrar interesse.

---

## 8️⃣ HORÁRIOS

### Cobertura:

- ✅ **Bot cobre 24 horas por dia**
- ✅ Ana quer atender **clientes já qualificados pelo bot**
- ✅ Ana pode atender **em qualquer horário** (quando notificada)

**Não há horário comercial definido** - Bot sempre ativo.

---

## 9️⃣ OBJEÇÕES

### "Tá caro"

**Resposta da Ana:**

```
Só conseguimos saber o preço real através da análise de crédito, pois você
pode ganhar um subsídio muito bom, sua parcela vai ser menor que um aluguel.

Podemos fazer uma análise de crédito sem compromisso?
```

### "Vou pensar"

**Resposta da Ana:**

```
Não prefere pensar sabendo o valor real de parcela, quem sabe sua parcela
fica menor do que seu aluguel?

Podemos fazer uma análise de crédito sem compromisso?
```

**📌 PADRÃO:**

- Sempre oferecer análise de crédito "sem compromisso"
- Comparar com aluguel (gatilho mental)
- Enfatizar subsídio/desconto

---

## 🔟 EXPECTATIVA DE SUCESSO

### O que Ana considera sucesso:

1. ✅ **Leads qualificados** - Perfil de renda adequado (R$ 2.000+)
2. ✅ **Eliminar não-respondedores** - Filtrar quem não responde
3. ✅ **Filtrar perfil inadequado** - Idade, renda, etc.
4. ✅ **Receber leads prontos** - Com interesse confirmado

**Meta:** Ana só recebe notificação de leads que REALMENTE têm perfil e interesse.

---

## 📊 IMÓVEL PRINCIPAL (Referência)

### Casa próxima ao Alphaville:

- **Valor:** R$ 222.000
- **Localização:** Próximo ao condomínio Alphaville
- **Programa:** Minha Casa Minha Vida (tem subsídio)
- **Desconto:** Construtora + Subsídio = valor final muito menor

---

## 🎯 FLUXO IDEAL DE QUALIFICAÇÃO

```
1. Cliente chega via anúncio
   ↓
2. Bot: "Olá! Você clicou no anúncio sobre financiamento, correto? Qual seu nome?"
   ↓
3. Bot: "Você trabalha de carteira assinada ou é autônomo?"
   ↓
4. Bot: "Qual sua renda familiar aproximada?"
   ↓
   ├─ Se < R$ 2.000 ou > 60 anos → Desqualifica educadamente
   └─ Se OK → Continua
   ↓
5. Bot: "Ótimo! Para sabermos sua parcela e subsídio, podemos fazer uma análise sem compromisso?"
   ↓
   ├─ Cliente recusa → Contorna objeção (parcela menor que aluguel)
   └─ Cliente aceita → Continua coleta de documentos
   ↓
6. Cliente aceita análise ✅
   ↓
7. Bot: "Perfeito! Preciso de 2 documentos: RG/CPF e último contra-cheque. Pode enviar?"
   ↓
8. Bot tenta coletar documentos (até 3 tentativas)
   ↓
   ├─ Cliente envia → Bot lê, confirma dados, salva no BD → NOTIFICA ANA ⚡
   │   (Ana recebe: nome, CPF, renda, documentos completos)
   │
   └─ Cliente com dificuldade (após 2-3 mensagens sem enviar)
       → NOTIFICA ANA para assumir conversa ⚡
       (Ana recebe: nome, renda, "Cliente teve dificuldade com documentos")
```

### ⚠️ REGRAS DE NOTIFICAÇÃO:

**Notificar Ana IMEDIATAMENTE quando:**

1. ✅ Cliente aceita análise E envia documentos (lead completo)
2. ✅ Cliente aceita análise MAS tem dificuldade após 2-3 msgs (Ana assume)

---

## ✅ PRÓXIMAS AÇÕES

- [ ] **CONFIRMAR:** Celular da Ana (+55 22 99871-5947) - verificar amanhã ⚠️
- [ ] Atualizar `src/prompts.js` com tom e respostas da Ana
- [ ] Configurar filtros de desqualificação (renda < 2k, idade > 60)
- [ ] Implementar fluxo de análise de crédito
- [ ] Implementar contador de tentativas de coleta de documentos (max 2-3)
- [ ] Testar leitura de documentos (imagens)
- [ ] Adicionar respostas para objeções ("tá caro", "vou pensar")
- [ ] Configurar notificação quando cliente aceitar análise
- [ ] Configurar notificação quando cliente tiver dificuldade com docs
- [ ] Testar bot com simulações antes de ativar
- [ ] **Período de teste: 7 dias** com Ana monitorando

---

**Preparado por:** Rodrigo Bezerra  
**Próximo passo:** Implementar configurações no código
