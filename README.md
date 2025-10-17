# 🤖 WhatsBot IA - Agente Imobiliário Inteligente

Bot de WhatsApp com Inteligência Artificial para qualificação automática de leads imobiliários.

## 🎯 O que o bot faz?

- ✅ Atende leads 24/7 no WhatsApp
- ✅ Qualifica automaticamente (renda, idade, tipo de trabalho)
- ✅ Responde dúvidas sobre o imóvel
- ✅ Solicita documentos para análise de crédito
- ✅ Trata objeções ("tá caro", "vou pensar")
- ✅ Alerta você quando lead está pronto para fechar
- ✅ Tom amigável com emojis (personalidade Ana Cláudia)

## 🔒 Segurança

- ✅ API Keys protegidas no arquivo `.env`
- ✅ Arquivo `.env` **nunca é commitado no Git**
- ✅ Sessões do WhatsApp isoladas localmente
- ✅ Dados de conversas apenas na sua máquina

## 🤖 Regras de Comportamento do Bot - Ana Cláudia

**Data:** 15 de outubro de 2025  
**Versão:** 2.0 - Modo Inteligente

---

## 📋 Resumo das Regras

O bot agora opera com **3 regras de segurança** para não interferir em conversas que não deve:

### ✅ Quando o Bot RESPONDE:

1. **Contato NOVO** (sem histórico no banco de dados)
2. **Mensagens diretas** (não-grupo)
3. **Ana NÃO participou** dessa conversa hoje

### ❌ Quando o Bot NÃO RESPONDE:

1. **Cliente antigo** (já tem histórico de mensagens)
2. **Ana já conversou** com esse contato hoje
3. **Mensagens de GRUPO** (sempre ignora)

---

## 🎭 Comportamento do Bot

### Identidade

- Bot **sempre** se apresenta como **Ana Cláudia**
- **NUNCA** revela que é um bot ou assistente virtual
- Cliente não percebe que está falando com IA

### Objetivo

1. **Qualificar o lead:**
   - Nome
   - Tipo de trabalho (CLT/Autônomo)
   - Renda familiar
   - Idade
2. **Quando lead qualificado:**
   - Bot **silenciosamente** notifica Ana no **22 99905-5098**
   - Bot **continua respondendo** normalmente
   - Ana real **assume quando puder**
   - Cliente **não sabe** que houve troca

### Respostas sobre Imóveis

Bot é **sempre genérico**:

✅ **Respostas corretas:**

- "Trabalho com diversos imóveis nessa região"
- "Tenho várias opções dentro dessa faixa de preço"
- "Após entender seu perfil, vou apresentar as melhores opções"
- "Preciso avaliar suas necessidades para indicar o imóvel ideal"

❌ **NÃO fazer:**

- Dar endereços específicos
- Prometer imóveis que não existem
- Dar detalhes técnicos (número de quartos, metragem, etc.)
- Falar valores específicos de imóveis

**Estratégia:** Qualifica primeiro, Ana mostra imóveis depois.

---

## 🔔 Sistema de Notificações

### Quando Ana é Notificada:

Quando o lead está **qualificado** (aceitou fazer análise de crédito ou enviou documentos), o bot envia uma mensagem **silenciosa** para:

**📱 Celular da Ana:** 22 99905-5098

**Formato da notificação:**

```
🎯 LEAD QUALIFICADO!

[Motivo da qualificação]

📋 Dados do Cliente:
👤 Nome: [nome]
📱 WhatsApp: [número]
💼 Trabalho: [CLT/Autônomo]
💰 Renda: [valor]
🎂 Idade: [idade]
📨 Mensagens: [quantidade]
🕐 Início: [horário]

⚡ Cliente aguardando! Assuma quando puder.

💡 O cliente NÃO sabe que houve troca de atendente.
```

### Importante:

- Cliente **nunca vê** essa notificação

## � Sistema de Follow-up Automático

## 📋 Visão Geral

Sistema inteligente que **detecta automaticamente** quando um cliente promete enviar documentos ou informações, e **envia lembretes às 19h todo dia** para quem está devendo.

## 🎯 Como Funciona

### 1. **Detecção Automática**

O bot detecta frases como:

- "Vou enviar"
- "Mando depois"
- "Chegando em casa te envio"
- "Posso fazer isso mais tarde"
- "Envio quando puder"
- "Logo mando"

### 2. **Marca como Pendente**

Quando detecta, o bot:

- ✅ Marca o contato como "aguardando documentos"
- 📅 Agenda follow-up automático para o dia seguinte às 19h
- 📊 Registra no banco de dados

### 3. **Envia Lembrete Automático**

Às **19h todo dia**, o bot:

- 🔍 Verifica quem está devendo documentos
- 📤 Envia mensagem de lembrete amigável
- ✅ Marca como enviado

### 4. **Remove Pendência**

Quando cliente envia:

- 📄 Documento
- 🖼️ Imagem
- 🎤 Áudio

O bot **automaticamente remove a pendência** e para de cobrar.

## 📱 Mensagem de Follow-up

```
Oi [Nome]! 😊

Tudo bem? Passando aqui pra lembrar dos documentos que você ia me enviar!

Quando tiver um tempinho, me manda:
📄 RG e CPF
📄 Contracheque (se CLT) ou Extrato bancário (se autônomo)

Assim a gente consegue dar andamento na sua análise de crédito! 🏠✨

Qualquer dúvida, estou por aqui! 😊
```

## ⚙️ Configuração

### Horário do Follow-up

O follow-up roda **às 19h** todo dia (horário de Brasília).

Para alterar o horário, edite em `src/follow-up-manager.js`:

```javascript
'0 19 * * *', // Às 19h todo dia
```

Exemplos de horários:

- `'0 18 * * *'` - 18h todo dia
- `'0 20 * * *'` - 20h todo dia
- `'0 12 * * *'` - 12h (meio-dia) todo dia
- `'0 9,19 * * *'` - 9h e 19h todo dia

### Banco de Dados

Tabelas utilizadas:

**contacts**

- `follow_up_status` - Status: 'pending', 'awaiting_documents', 'completed'

**follow_ups**

- `id` - ID único
- `phone_number` - Número do contato
- `scheduled_date` - Data/hora agendada
- `follow_up_type` - Tipo: 'awaiting_documents'
- `status` - Status: 'pending', 'sent', 'completed'
- `message_sent` - Se foi enviado (0 ou 1)
- `sent_at` - Quando foi enviado

## 🧪 Como Testar

## � Sistema de Fallback Automático - Arcee.ai → OpenAI

**Data:** 15/10/2025 09:55  
**Versão:** 1.0

---

## 📋 Como Funciona

O bot agora tenta **duas APIs de IA** automaticamente:

### 1ª Tentativa: Arcee.ai 🎯

- API principal
- Mais específica para o domínio
- Se funcionar: usa a resposta ✅

### 2ª Tentativa: OpenAI (GPT-4o-mini) 🔄

- API de backup
- **Só é chamada se Arcee.ai falhar**
- Modelo rápido e barato (~$0.15 por milhão de tokens)
- Se funcionar: usa a resposta ✅

### Fallback Final: Mensagem de Erro 💬

- Só acontece se **ambas** falharem
- Resposta: "Desculpe, estou com um probleminha técnico..."

---

## 🎬 Fluxo de Execução

```
Cliente envia mensagem
    ↓
Bot tenta Arcee.ai
    ├─ Sucesso? → Responde com Arcee.ai ✅
    └─ Falhou?
        ↓
    Bot tenta OpenAI (fallback)
        ├─ Sucesso? → Responde com OpenAI ✅
        └─ Falhou? → Mensagem de erro ❌
```

---

## 📊 Logs no Terminal

### Quando Arcee.ai funciona:

```
🔄 Tentando Arcee.ai...
✅ Arcee.ai respondeu com sucesso!
🤖 Resposta enviada: Ótimo! Qual seu nome?
```

### Quando Arcee.ai falha mas OpenAI funciona:

```
🔄 Tentando Arcee.ai...
❌ Arcee.ai falhou: Resposta inválida da API
🔄 Tentando OpenAI como fallback...
✅ OpenAI respondeu com sucesso!
🤖 Resposta enviada: Ótimo! Qual seu nome?
```

### Quando ambas falham:

```
🔄 Tentando Arcee.ai...
❌ Arcee.ai falhou: Resposta inválida da API
🔄 Tentando OpenAI como fallback...
❌ OpenAI também falhou: Network timeout
🤖 Resposta enviada: Desculpe, estou com um probleminha...
```

---

## 💰 Custo Estimado

### Arcee.ai

- Custo: Variável (conforme plano)
- Uso: Primeira opção sempre

### OpenAI GPT-4o-mini (Fallback)

- **Input:** $0.150 / 1M tokens
- **Output:** $0.600 / 1M tokens
- **Exemplo:** 100 mensagens/dia = ~$1-3/mês
- **Só cobra se Arcee.ai falhar**

### Economia:

- Se Arcee.ai funcionar: R$0 extra
- Se Arcee.ai falhar: Custo mínimo do OpenAI
- **Sempre melhor que perder o lead!** 🎯

---

## �📋 Pré-requisitos

1. **Node.js 18+** instalado

   - Verifique: `node --version`
   - Se não tiver, baixe em: https://nodejs.org/

2. **Conta Arcee.ai** com API Key

   - ✅ Você já tem: `jDQfL...`

3. **WhatsApp do cliente** disponível para conectar

## 🚀 Instalação - PASSO A PASSO

### 1️⃣ Instalar dependências

Abra o terminal nesta pasta e rode:

```bash
npm install
```

Isso vai instalar:

- `whatsapp-web.js` - Conexão com WhatsApp
- `qrcode-terminal` - Mostra QR Code no terminal
- `axios` - Chamadas HTTP para Arcee.ai
- `dotenv` - Carrega variáveis de ambiente

**Tempo estimado:** 2-3 minutos

### 2️⃣ Configurar seu número de telefone

Edite o arquivo `.env` e atualize a linha:

```env
OWNER_PHONE=5511999999999
```

Troque `5511999999999` pelo **SEU número de WhatsApp** (código do país + DDD + número).

Exemplo: Se seu número é (21) 98765-4321:

```env
OWNER_PHONE=5521987654321
```

### 3️⃣ Iniciar o bot

```bash
npm start
```

Você vai ver:

- Mensagens de inicialização
- Um **QR Code** no terminal

### 4️⃣ Conectar o WhatsApp do cliente

1. O cliente abre o WhatsApp dele
2. Vai em **Aparelhos Conectados** (ou **WhatsApp Web**)
3. Clica em **Conectar Aparelho**
4. Escaneia o QR Code mostrado no seu terminal
5. ✅ **Pronto!** Bot está conectado!

## 📱 Como testar

1. Peça para alguém (ou use outro número seu) mandar uma mensagem para o WhatsApp do cliente
2. O bot vai responder automaticamente
3. Siga o fluxo de qualificação
4. Quando disser "quero fazer análise", **você receberá um alerta** no seu WhatsApp!

## 🎮 Comandos disponíveis

```bash
npm start          # Inicia o bot
npm run dev        # Inicia com auto-reload (desenvolvimento)
```

## 📊 Monitoramento

O terminal vai mostrar em tempo real:

- 📩 Mensagens recebidas
- 🤖 Respostas enviadas
- 🚨 Alertas de leads quentes
- ❌ Erros (se houver)

## ⚠️ Importante - Mantenha rodando

- **Deixe o terminal aberto** enquanto o bot estiver ativo
- **Seu Mac precisa estar ligado** (pode estar em standby/sleep)
- **Precisa ter internet** conectada
- Se fechar o terminal, o bot para

## 🛠️ Troubleshooting

### ❌ Erro: "ARCEE_API_KEY não encontrada"

- Certifique-se que o arquivo `.env` existe
- Verifique se a API Key está correta no `.env`

### ❌ Erro ao gerar QR Code

- Delete a pasta `.wwebjs_auth`
- Rode `npm start` novamente

### ❌ Bot não responde

- Verifique se o terminal ainda está rodando
- Verifique sua conexão com a internet
- Veja se há erros no terminal

### ❌ IA respondendo mal

- As respostas melhoram com o tempo
- Você pode ajustar os prompts em `src/prompts.js`

## 📁 Estrutura do projeto

```
whatsbot/
├── src/
│   ├── bot.js              # Bot principal (inicia aqui)
│   ├── ai-agent.js         # Integração com Arcee.ai
│   ├── message-handler.js  # Lógica de conversação
│   └── prompts.js          # Personalidade da Ana Cláudia
├── .env                    # ⚠️ SENSÍVEL - Suas credenciais
├── .env.example            # Modelo do .env
├── .gitignore             # Protege arquivos sensíveis
├── package.json           # Dependências
└── README.md              # Este arquivo
```

## 🔧 Personalizações

### Mudar o nome do bot

Edite `.env`:

```env
BOT_NAME=Seu Nome Aqui
```

### Ajustar personalidade

Edite `src/prompts.js` - campo `SYSTEM_PROMPT`

### Mudar critérios de qualificação

Edite `src/message-handler.js` - função `checkDisqualification()`

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs no terminal
2. Veja a seção **Troubleshooting** acima
3. Delete `.wwebjs_auth` e tente reconectar

## 🎯 Próximos passos (Fase 2)

Após validação dos 7 dias:

- 🌐 Plataforma web para gerenciar
- 📊 Dashboard com métricas
- 👥 Multi-clientes
- ☁️ Deploy em servidor (24/7 sem seu Mac ligado)

---

**Versão:** 1.0.0 - MVP Local  
**Status:** Pronto para teste! 🚀
