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

## 📋 Pré-requisitos

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
