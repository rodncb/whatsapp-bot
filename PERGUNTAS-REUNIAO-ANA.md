# 📋 Perguntas para Reunião - Ana Cláudia

**Data da reunião:** 14 / 10 / 2025  
**Horário:** Respondido por escrito  
**Participantes:** Rodrigo Bezerra, Ana Cláudia

**Status:** ✅ Respostas recebidas e consolidadas em `RESPOSTAS-ANA-CLAUDIA.md`

---

## 🎯 OBJETIVO DA REUNIÃO

Entender o processo de vendas atual e definir configurações finais do bot para maximizar conversão de leads.

**✅ OBJETIVO ALCANÇADO** - Respostas consolidadas no arquivo `RESPOSTAS-ANA-CLAUDIA.md`

---

## 1️⃣ HORÁRIO DE ATENDIMENTO

**✅ RESPONDIDO**

**Pergunta:** O bot deve responder 24 horas ou apenas em horário comercial?

- [x] **24/7** - Bot responde sempre, inclusive madrugada/finais de semana
- [ ] **Horário comercial** - Apenas em dias/horários específicos

**Resposta:** Bot cobre 24 horas. Ana atende clientes já qualificados em qualquer horário.

---

## 2️⃣ PORTFÓLIO DE IMÓVEIS

**⚠️ PARCIALMENTE RESPONDIDO**

**Imóvel principal mencionado:**

- Casa próxima ao Alphaville
- Valor: R$ 222.000
- Programa: Minha Casa Minha Vida (com subsídio)

**Materiais disponíveis:**

- [x] Fotos dos imóveis

**Faltam definir:**

- [ ] Quantos imóveis no total
- [ ] Outras localizações
- [ ] Faixa de valores completa

---

## 3️⃣ PERFIL DO CLIENTE IDEAL

**✅ RESPONDIDO**

**Renda familiar mínima:** R$ 2.000 (abaixo disso = desqualificado)

**Idade:** Até 60 anos (acima = desqualificado)

**Forma de pagamento:**

- [x] Financiamento bancário (Caixa + Minha Casa Minha Vida)

---

## 4️⃣ PROCESSO DE VENDAS ATUAL

**✅ RESPONDIDO**

**Primeira mensagem:**

```
Olá, tudo bem? Você clicou em nosso anúncio para saber mais informações sobre o
financiamento de imóveis, correto?

Me chamo Ana Cláudia, sou da Novo Lar Negócios Imobiliários e farei seu atendimento,
qual seu nome?
```

**Objetivo:** Confirmar interesse + obter nome do cliente.

---

## 5️⃣ PRINCIPAIS DÚVIDAS DOS CLIENTES

**✅ RESPONDIDO**

1. **"Qual valor da entrada?"** → Direciona para análise de crédito
2. **"Onde é essa casa?"** → Alphaville + pergunta se já fez análise antes
3. **"Qual o valor da casa?"** → R$ 222k mas sai mais barato com subsídio

**Ver respostas completas em:** `RESPOSTAS-ANA-CLAUDIA.md`

---

## 6️⃣ PRINCIPAIS OBJEÇÕES

**✅ RESPONDIDO**

**"Tá caro":**

```
Só conseguimos saber o preço real através da análise de crédito, pois você
pode ganhar um subsídio muito bom, sua parcela vai ser menor que um aluguel.
Podemos fazer uma análise de crédito sem compromisso?
```

**"Vou pensar":**

```
Não prefere pensar sabendo o valor real de parcela, quem sabe sua parcela
fica menor do que seu aluguel?
Podemos fazer uma análise de crédito sem compromisso?
```

**Padrão:** Sempre oferecer análise "sem compromisso" + comparar com aluguel.

---

## 7️⃣ CRITÉRIOS DE QUALIFICAÇÃO

**✅ RESPONDIDO**

**Desqualificação imediata:**

- [x] Renda familiar < R$ 2.000
- [x] Idade > 60 anos

**Notificar Ana imediatamente quando:**

- [x] Cliente aceita análise E envia documentos completos (lead pronto)
- [x] Cliente aceita análise MAS tem dificuldade após 2-3 msgs (Ana assume conversa)

**⚠️ FLUXO:**

1. Cliente aceita fazer análise → Bot coleta documentos
2. Se cliente envia docs → Bot lê, confirma, salva → Notifica Ana ✅
3. Se cliente não envia após 2-3 tentativas → Notifica Ana para assumir ⚡

**💡 IMPORTANTE:** O bot tem capacidade de ler imagens/documentos!

- Cliente envia foto → Bot extrai dados (nome, CPF, renda)
- Bot confirma informações com cliente
- Salva tudo no banco de dados
- Notifica você quando documentação estiver completa

---

## 8️⃣ LEADS NÃO QUALIFICADOS

**✅ RESPONDIDO**

**Ação:** Bot agradece educadamente e não prossegue.

**Leads não qualificados:**

- [x] Renda < R$ 2.000
- [x] Idade > 60 anos
- [x] Não responde perguntas de qualificação

**Ana NÃO é notificada** nestes casos.

---

## 9️⃣ TOM DE COMUNICAÇÃO

**✅ RESPONDIDO**

**Tom preferido:**

- [x] Casual (Você, linguagem simples e acessível)
- [x] Próximo/Amigável

**Uso de emojis:**

- [x] Moderado (quando faz sentido)

**Exemplo real da Ana:**

```
"Então, o valor é 222 mil, mas não sai por esse valor, vai sair muito menos,
pois além do desconto que temos pela construtora, tem o desconto do subsídio,
pelo Minha Casa Minha Vida. 😊

Hoje você trabalha de carteira assinada ou autônomo?"
```

---

## 🔟 FERRAMENTAS E INTEGRAÇÕES

**Pergunta:** Quais ferramentas você usa hoje?

**CRM:**

- [ ] Não uso
- [ ] Uso: ******\_\_\_****** (RD Station, HubSpot, Pipedrive, etc)

**Agendamentos:**

- [ ] Google Calendar
- [ ] Agenda de papel
- [ ] Outro: ******\_\_\_******

**Relatórios/Métricas:**

- [ ] Planilha Excel
- [ ] Ferramenta: ******\_\_\_******
- [ ] Não acompanho

**Pergunta:** Gostaria que o bot se integrasse com alguma ferramenta?

- [ ] Sim - ******\_\_\_******
- [ ] Não, por enquanto está bom

---

## 1️⃣1️⃣ CASOS ESPECIAIS

**Cliente antigo que retorna:**

- [ ] Bot trata como novo
- [ ] Bot identifica e personaliza mensagem
- [ ] Rodrigo assume imediatamente

**Reclamações/Problemas:**

- [ ] Bot tenta resolver
- [ ] Bot escala para Rodrigo imediatamente

**Indicações (cliente indicou amigo):**

- [ ] Bot trata igual aos outros
- [ ] Bot dá atenção especial
- [ ] Bot oferece desconto/cortesia

---

## 1️⃣2️⃣ EXPECTATIVAS E RECEIOS

**Pergunta:** O que você espera do bot?

1. ***
2. ***
3. ***

**Pergunta:** Qual seu maior medo/receio?

- [ ] Bot passar informação errada
- [ ] Bot afastar clientes (muito robótico)
- [ ] Bot não entender pergunta complexa
- [ ] Perder controle do atendimento
- [ ] Outro: ******\_\_\_******

**Como podemos mitigar esses receios?**

---

---

## 1️⃣3️⃣ PERÍODO DE TESTE

**✅ RESPONDIDO**

- [x] Sim, testar por **7 dias** com Ana monitorando todas as conversas

**Detalhes:**

- Ana acompanha em tempo real
- Ajustes conforme necessário
- Após 7 dias: revisar e liberar 100%

---

## 1️⃣4️⃣ SCRIPTS PRONTOS

**Pergunta:** Você tem scripts/mensagens prontas que já usa?

- [ ] Sim (compartilhar comigo)
- [ ] Não, improviso

**Se sim, quais situações?**

- [ ] Primeira mensagem (apresentação)
- [ ] Resposta sobre valores
- [ ] Resposta sobre localização
- [ ] Agendamento de visita
- [ ] Pedido de documentos
- [ ] Outro: ******\_\_\_******

---

## 1️⃣5️⃣ DADOS PARA COLETA

**✅ RESPONDIDO - Documentos iniciais:**

**1ª solicitação (simplificada):**

- [x] RG e CPF
- [x] Último contra-cheque (se CLT)
- [x] Extrato bancário 3 meses (se autônomo)

**⚠️ Bot pede apenas 2-3 documentos primeiro!**

- Lista grande atrapalha comunicação
- Demais documentos são pedidos depois

**Dados a extrair das imagens:**

- [x] Nome completo
- [x] CPF
- [x] Renda (do contra-cheque/extrato)

---

## ✅ PRÓXIMOS PASSOS APÓS REUNIÃO

**Status atualizado:**

1. [x] ~~Ajustar personalidade do bot~~ → Já definido, implementar em `src/prompts.js`
2. [ ] Confirmar quantos imóveis trabalhar (Ana vai informar)
3. [x] ~~Configurar horário~~ → 24/7 (anúncio não para)
4. [x] ~~Scripts de qualificação~~ → Já definidos (renda, idade, análise crédito)
5. [x] ~~Gatilhos de notificação~~ → Já definidos (docs completos OU dificuldade)
6. [x] ~~Testes~~ → Direto em produção nos 7 dias
7. [x] Ajustar respostas → Em tempo real durante os 7 dias
8. [x] Ativar em teste → **Teste = Produção** (7 dias monitorando)
9. [x] Revisar resultados → Análise em tempo real
10. [x] Liberar 100% → Após 7 dias + ajustes finais

**PENDENTE IMPLEMENTAR NO CÓDIGO:**

- [ ] Atualizar `src/prompts.js` com tom e respostas da Ana
- [ ] Implementar filtros de qualificação (renda < 2k, idade > 60)
- [ ] Implementar fluxo de coleta de documentos (2-3 tentativas)
- [ ] Implementar leitura de imagens (RG, CPF, contra-cheque)
- [ ] Implementar notificações para Ana (WhatsApp ou outra forma)
- [ ] Confirmar celular Ana antes de ativar

---

## 📝 ANOTAÇÕES GERAIS

Use este espaço para anotar qualquer coisa importante durante a reunião:

---

---

---

---

---

---

---

---

**Preparado por:** Rodrigo Bezerra  
**Data:** 14 de outubro de 2025  
**Próxima revisão:** Após reunião com Ana Cláudia
