# 💬 Script de Exemplo - Conversa Bot Ana Cláudia

**Para:** Ana Cláudia  
**Objetivo:** Demonstrar como será a conversa do bot com clientes  
**Status:** Versão inicial para aprovação

---

## 🎯 CENÁRIO 1: Lead Qualificado (Aprovado)

### Cliente chega via anúncio:

**🤖 Bot (Ana):**

```
Olá, tudo bem? 😊

Você clicou em nosso anúncio para saber mais informações sobre o
financiamento de imóveis, correto?

Me chamo Ana Cláudia, sou da Novo Lar Negócios Imobiliários e farei
seu atendimento. Qual seu nome?
```

**👤 Cliente:**

```
Oi! Sou João Silva
```

**🤖 Bot:**

```
Prazer em conhecer você, João! 😊

Para te ajudar melhor, você trabalha de carteira assinada ou é autônomo?
```

**👤 Cliente:**

```
Carteira assinada
```

**🤖 Bot:**

```
Perfeito! E qual a renda familiar aproximada? (pode ser um valor aproximado)
```

**👤 Cliente:**

```
Uns 3.500 reais
```

**🤖 Bot:**

```
Ótimo, João! Com essa renda você pode ter acesso a excelentes condições
no programa Minha Casa Minha Vida. 🏡

A casa que você viu no anúncio é próxima ao Alphaville, no valor de
R$ 222 mil. Mas aqui vai uma boa notícia: com o subsídio do programa
e o desconto da construtora, o valor final sai MUITO mais barato!

Para sabermos o valor real da sua parcela e quanto de desconto você pode
ganhar, podemos fazer uma análise de crédito sem compromisso. O que acha?
```

**👤 Cliente:**

```
Sim, quero fazer!
```

**🤖 Bot:**

```
Excelente decisão! 🎉

Para fazer a análise, preciso de apenas 2 documentos:
1️⃣ RG e CPF (pode ser foto dos dois juntos)
2️⃣ Último contra-cheque

Pode enviar quando quiser! 📸
```

**👤 Cliente:**

```
*envia foto do RG e CPF*
*envia foto do contra-cheque*
```

**🤖 Bot:**

```
Recebi! Deixa eu confirmar os dados... 📋

Vi aqui:
• Nome: João Silva
• CPF: 123.456.789-00
• Renda: R$ 3.500

Está tudo correto?
```

**👤 Cliente:**

```
Sim, certinho!
```

**🤖 Bot:**

```
Perfeito! Seus documentos foram salvos com sucesso. ✅

A Ana Cláudia já foi notificada e vai entrar em contato com você em breve
para finalizar sua análise de crédito e te passar todos os detalhes do
financiamento!

Você está a um passo do seu imóvel próprio! 🏠✨
```

**📱 [ANA RECEBE NOTIFICAÇÃO]:**

```
🎯 LEAD QUALIFICADO!

Nome: João Silva
CPF: 123.456.789-00
Telefone: 5521999887766
Renda: R$ 3.500
Tipo: Carteira assinada
Status: Documentos completos ✅
Interesse: Casa Alphaville R$ 222k

Ação: Fazer análise de crédito
```

---

## 🎯 CENÁRIO 2: Cliente com Dificuldade (Ana assume)

**[Mesmo início até aceitar fazer análise...]**

**🤖 Bot:**

```
Excelente decisão! 🎉

Para fazer a análise, preciso de apenas 2 documentos:
1️⃣ RG e CPF (pode ser foto dos dois juntos)
2️⃣ Último contra-cheque

Pode enviar quando quiser! 📸
```

**👤 Cliente:**

```
Tá, mas não sei como tirar foto e enviar
```

**🤖 Bot:**

```
Sem problema! É bem simples:

1️⃣ Coloque os documentos em um lugar com boa luz
2️⃣ Clique no 📎 (clipe) aqui no WhatsApp
3️⃣ Escolha "Câmera" ou "Galeria"
4️⃣ Tire a foto ou escolha uma já tirada

Consegue tentar assim?
```

**👤 Cliente:**

```
Ah sim, mas não tá indo... dá erro quando tento enviar
```

**🤖 Bot:**

```
Entendo sua dificuldade! Vou te passar para a Ana Cláudia agora mesmo,
ela vai te ajudar pessoalmente com isso. Só um momentinho! 😊
```

**📱 [ANA RECEBE NOTIFICAÇÃO]:**

```
⚠️ CLIENTE PRECISA DE AJUDA!

Nome: João Silva
Telefone: 5521999887766
Renda: R$ 3.500
Status: Aceitou análise mas está com dificuldade para enviar documentos

Ação: Ana, assuma a conversa e ajude o cliente! 🚨
```

---

## ❌ CENÁRIO 3: Lead Desqualificado (Renda baixa)

**[Mesmo início...]**

**👤 Cliente:**

```
Ganho uns 1.500
```

**🤖 Bot:**

```
Entendo sua situação, João.

Infelizmente, para o programa de financiamento deste imóvel, a renda
mínima exigida pela Caixa é de R$ 2.000. Com R$ 1.500, não conseguiremos
prosseguir com a análise neste momento. 😔

Mas não desanime! Caso sua renda familiar aumente (você + cônjuge, por
exemplo) ou sua situação mude, estamos sempre à disposição para te ajudar!

Agradeço muito seu interesse e desejo sucesso! 🌟
```

**[Ana NÃO é notificada - lead automaticamente desqualificado]**

---

## ❌ CENÁRIO 4: Lead Desqualificado (Idade acima de 60)

**[Durante a conversa...]**

**🤖 Bot:**

```
E quantos anos você tem, João?
```

**👤 Cliente:**

```
65 anos
```

**🤖 Bot:**

```
Que bom te conhecer, João!

Infelizmente, para este tipo de financiamento, a Caixa tem restrições
de idade (máximo 60 anos). Por conta disso, não conseguiremos prosseguir
com a análise neste momento. 😔

Agradeço muito seu interesse e desejo tudo de bom! 🌟
```

**[Ana NÃO é notificada - lead automaticamente desqualificado]**

---

## 💰 CENÁRIO 5: Objeção "Tá caro"

**[Durante a conversa...]**

**👤 Cliente:**

```
222 mil? Tá muito caro!
```

**🤖 Bot:**

```
Entendo sua preocupação, João! Mas aqui vai uma informação importante:

Só conseguimos saber o preço REAL através da análise de crédito, pois
você pode ganhar um subsídio muito bom! Sua parcela vai ser menor que
um aluguel. 😊

Com a análise conseguimos calcular:
✅ Valor do subsídio (pode chegar a R$ 50-80 mil!)
✅ Desconto da construtora
✅ Parcela real que você vai pagar

O valor de R$ 222 mil é antes de todos esses descontos. Na prática,
você vai pagar BEM menos!

Podemos fazer uma análise de crédito sem compromisso para você ver o
valor real?
```

---

## 🤔 CENÁRIO 6: Objeção "Vou pensar"

**[Durante a conversa...]**

**👤 Cliente:**

```
Vou pensar...
```

**🤖 Bot:**

```
Claro, João! Pensar é importante mesmo. 😊

Mas deixa eu te fazer uma pergunta: não prefere pensar sabendo o valor
REAL da parcela?

Porque hoje você não sabe:
❓ Quanto de subsídio pode ganhar
❓ Qual será sua parcela mensal real
❓ Se vai caber no seu orçamento

Com a análise de crédito (que é rápida e sem compromisso), você toma
uma decisão mais informada. Quem sabe sua parcela fica menor do que
seu aluguel atual?

Posso fazer a análise para você? Assim você pensa com todas as
informações em mãos! 💡
```

---

## 📝 NOTAS PARA ANA:

### ✅ O que está no script:

1. Tom amigável e casual (como Ana pediu)
2. Uso moderado de emojis
3. Foco em direcionar para análise de crédito
4. Contorna objeções automaticamente
5. Desqualifica leads automaticamente (renda/idade)
6. Notifica Ana nos momentos certos

### ⚠️ PARA REVISAR AMANHÃ:

- [ ] Tom está adequado?
- [ ] Frases muito longas ou muito curtas?
- [ ] Faltou perguntar algo importante?
- [ ] Alguma resposta precisa ser ajustada?
- [ ] Ordem das perguntas faz sentido?

### 🔄 AJUSTES POSSÍVEIS:

Se Ana quiser mudar qualquer coisa, é só avisar!

- Mais/menos emojis
- Frases diferentes
- Ordem diferente
- Perguntas adicionais

---

**Preparado por:** Rodrigo Bezerra  
**Data:** 14 de outubro de 2025  
**Próxima revisão:** Após feedback da Ana
