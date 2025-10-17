# 📊 COMO USAR O SISTEMA DE RELATÓRIOS

**Cliente:** Ana Cláudia (Novo Lar Negócios Imobiliários)  
**Data:** 16 de outubro de 2025

---

## 🎯 O QUE É O RELATÓRIO DIÁRIO?

O bot gera automaticamente um relatório com as principais métricas do dia:

- Total de contatos que conversaram
- Quantos não responderam ainda
- Quantos enviaram documentos (RG, CPF, contracheque)
- Quantos pararam de responder (1-7 dias atrás)
- Agendamentos marcados
- Conversas que você assumiu manualmente

---

## 📱 COMO SOLICITAR O RELATÓRIO

### Via WhatsApp (Modo Manual)

1. Abra o WhatsApp do bot (seu número de atendimento)
2. Envie uma das mensagens:
   - "relatório"
   - "relatorio"
   - "Relatório"
   - "RELATÓRIO"
3. O bot vai gerar e enviar automaticamente no mesmo chat

### Automático (19h todo dia)

O bot envia automaticamente às **19h** para:

- Ana Cláudia: `5522999055098`
- Thiago: `5522999388505`
- Rodrigo (dev): `5524981058194`

---

## 📊 EXEMPLO DE RELATÓRIO LIMPO (SEM DADOS)

Quando não houver movimentação no dia:

```
📊 RELATÓRIO DIÁRIO - 16/10/2025

📈 RESUMO GERAL
👥 Total de Contatos: 0
📩 Não Responderam: 0
📄 Enviaram Docs: 0
⏸️ Pararam de Responder: 0
📅 Agendamentos: 0
👤 Ana Assumiu: 0
```

**Observação:** Só mostra o resumo. Limpo e direto ao ponto.

---

## 📊 EXEMPLO DE RELATÓRIO COM DADOS

Quando houver movimentação:

```
📊 RELATÓRIO DIÁRIO - 16/10/2025

📈 RESUMO GERAL
👥 Total de Contatos: 8
📩 Não Responderam: 3
📄 Enviaram Docs: 2
⏸️ Pararam de Responder: 1
📅 Agendamentos: 1
👤 Ana Assumiu: 2

❌ NÃO RESPONDERAM:
1. João Silva
2. Maria Santos
3. 5522998765432

📄 ENVIARAM DOCUMENTOS:
1. Pedro Costa
2. Carla Oliveira

⏸️ PARARAM DE RESPONDER:
1. Roberto Alves (3d atrás)

📅 AGENDAMENTOS:
1. 5522997654321
   📆 20/10/2025 às 14:00
   Status: confirmado

👤 ANA ASSUMIU:
1. João Silva
2. Pedro Costa
```

**Observação:** Detalhes só aparecem quando há dados. Nada de seções vazias poluindo.

---

## 🔍 O QUE SIGNIFICA CADA MÉTRICA?

### 👥 Total de Contatos

- Quantos contatos únicos conversaram no dia
- **Exclui:** Mensagens da própria Ana

### 📩 Não Responderam

- Clientes que o bot enviou mensagem mas nunca responderam
- **Útil para:** Identificar leads frios que não deram retorno

### 📄 Enviaram Docs

- Clientes que enviaram documentos (RG, CPF, contracheque, extratos)
- **Não inclui:** Áudios (são transcritos mas não contam como documento)
- **Útil para:** Ver quem está pronto para análise de crédito

### ⏸️ Pararam de Responder

- Clientes que conversaram mas não respondem há 1-7 dias
- **Útil para:** Follow-up, reengajar leads mornos
- Mostra há quantos dias não responde

### 📅 Agendamentos

- Visitas/reuniões marcadas pelos clientes
- Mostra data, hora e status
- **Útil para:** Planejar agenda

### 👤 Ana Assumiu

- Conversas onde Ana (você) entrou manualmente para responder
- **Útil para:** Saber quais leads você está tratando pessoalmente

---

## ✅ QUEM PODE SOLICITAR RELATÓRIOS?

Apenas números autorizados:

- ✅ Ana Cláudia: `5522999055098`
- ✅ Thiago: `5522999388505`

**Outros números:** Bot não responde comando "relatório"

---

## 🧪 COMO TESTAR

### Teste 1: Relatório Vazio (agora)

1. Envie "relatório" via WhatsApp
2. Deve receber apenas o resumo com zeros
3. Sem seções de detalhes (limpo)

### Teste 2: Relatório com Dados (depois)

1. Espere alguns clientes conversarem
2. Espere alguns enviarem docs
3. Ana entre em 1-2 conversas manualmente
4. Envie "relatório" novamente
5. Verá os detalhes aparecendo

### Teste 3: Relatório Automático (19h)

1. Não precisa fazer nada
2. Às 19h você receberá automaticamente
3. Vai chegar no WhatsApp como mensagem normal

---

## ⚙️ CONFIGURAÇÕES TÉCNICAS

**Horário do relatório automático:** 19h (BR/Brasília)  
**Database usado:** `conversations-ana.db`  
**Período analisado:** Últimas 24h (do dia anterior)  
**Status:** ✅ Sistema operacional e seguro

---

## 🔒 SEGURANÇA E PRIVACIDADE

✅ **Database limpo** - Zero dados pessoais do desenvolvedor  
✅ **Separação total** - Bot de teste não contamina seus dados  
✅ **Acesso restrito** - Só números autorizados veem relatórios  
✅ **Dados reais** - Apenas seus clientes aparecem

---

## ❓ PERGUNTAS FREQUENTES

### Por que o relatório está vazio?

É normal se não houver conversas no período. O bot só registra novos contatos a partir de agora (database foi limpo hoje 16/10 às 11h).

### Quando vou ver dados reais?

Conforme clientes conversarem com o bot, os dados vão aparecer naturalmente. Teste enviando uma mensagem você mesma e depois peça o relatório.

### Posso pedir relatório de ontem?

O relatório sempre mostra as últimas 24h. Se pedir hoje, mostra dados de ontem.

### O que acontece se eu pedir às 10h?

Vai mostrar dados de 00h até 23:59 de ontem (dia anterior).

### Posso mudar o horário do relatório automático?

Sim! Entre em contato com o desenvolvedor (Rodrigo) para ajustar.

---

## 📞 SUPORTE

**Desenvolvedor:** Rodrigo Bezerra  
**WhatsApp:** +55 24 98105-8194  
**Email:** (adicionar se necessário)

**Dúvidas sobre:**

- Como usar o relatório
- Métricas que não entendeu
- Sugestões de melhoria
- Problemas técnicos

---

## 📝 HISTÓRICO DE ATUALIZAÇÕES

**16/10/2025 - 11:00**

- ✅ Database limpo (zero contaminação)
- ✅ Formato de relatório simplificado
- ✅ Detalhes só aparecem quando houver dados
- ✅ Sistema testado e operacional

---

**🎉 Pronto para usar! Teste enviando "relatório" via WhatsApp agora mesmo.**
