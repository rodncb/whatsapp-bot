# ✅ Checklist de Implementação - Bot Ana Cláudia

**Data:** 14 de outubro de 2025  
**Status:** Em progresso

---

## 📝 IMPLEMENTAÇÃO DE CÓDIGO

### ✅ Concluído:

- [x] **src/prompts.js** - Atualizado com tom e respostas da Ana

  - Tom casual/amigável
  - Respostas para perguntas comuns (entrada, localização, preço)
  - Respostas para objeções ("tá caro", "vou pensar")
  - Mensagens de desqualificação (renda, idade)
  - Pedidos de documentos separados (CLT vs autônomo)
  - Mensagens de ajuda com documentos

- [x] **src/message-handler.js** - Lógica de qualificação

  - Contador de tentativas de coleta de documentos
  - Detecta dificuldade do cliente
  - Desqualificação automática (renda < 2k, idade > 60)
  - Flag `acceptedAnalysis` para controlar fluxo
  - Notifica Ana quando cliente tem dificuldade (3 tentativas)

- [x] **Sistema de memória** - Funcionando
  - Salva todas mensagens no BD
  - Contexto recuperado para IA
  - Integrado nos dois bots

### ⏳ Pendente:

- [ ] **src/ai-agent.js** - Extrair informações

  - Melhorar extração de nome
  - Detectar tipo de trabalho (CLT/autônomo)
  - Extrair renda
  - Extrair idade
  - Detectar aceitação de análise de crédito

- [ ] **src/bot.js** - Processar imagens (documentos)

  - Detectar quando mensagem tem imagem
  - Enviar imagem para Arcee.ai (vision)
  - Extrair dados: nome, CPF, renda
  - Confirmar dados com cliente
  - Salvar no BD
  - Notificar Ana quando docs completos

- [ ] **Notificações para Ana**

  - Definir método (WhatsApp? SMS? Email?)
  - Implementar função de notificação
  - Testar notificações

- [ ] **Testes**
  - Simular 10 conversas diferentes
  - Testar desqualificação
  - Testar coleta de documentos
  - Testar contador de tentativas

---

## 🎯 PRÓXIMAS ETAPAS

### 1️⃣ Melhorar ai-agent.js (extração de informações)

**Tempo estimado:** 30 min

Atualizar métodos:

- `extractInfo()` - extrair nome, renda, idade, tipo trabalho
- `detectsCreditAnalysisIntent()` - detectar aceitação

### 2️⃣ Implementar leitura de imagens

**Tempo estimado:** 1h

Arcee.ai Vision API:

- Detectar mensagem com imagem
- Enviar para API com prompt específico
- Extrair: nome, CPF, renda
- Confirmar com cliente

### 3️⃣ Sistema de notificações

**Tempo estimado:** 30 min

Opções:

1. WhatsApp (enviar para número do Rodrigo/Ana)
2. Email
3. SMS
4. Webhook

### 4️⃣ Testes completos

**Tempo estimado:** 1-2h

Cenários:

- Lead qualificado + docs
- Lead com dificuldade
- Desqualificação por renda
- Desqualificação por idade
- Objeção "tá caro"
- Objeção "vou pensar"

---

## 📋 INFORMAÇÕES PENDENTES

- [ ] Confirmar celular Ana (+55 22 99871-5947) amanhã
- [ ] Confirmar quantos imóveis trabalhar
- [ ] Definir método de notificação preferido

---

## 🚀 QUANDO ESTIVER PRONTO

1. Testar com 10 simulações
2. Ajustar conforme necessário
3. Confirmar celular Ana
4. Escanear QR Code do WhatsApp dela
5. Iniciar com PM2: `pm2 start ecosystem.config.js --only ana-claudia`
6. Ana monitora por 7 dias
7. Ajustes em tempo real
8. Liberar 100%

---

**Progresso geral:** 40% ████░░░░░░

**Atualizado por:** Rodrigo Bezerra  
**Próxima ação:** Melhorar ai-agent.js (extração de informações)
