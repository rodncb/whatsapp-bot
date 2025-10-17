const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
require("dotenv").config();

const audioHandler = require("./audio-handler");
const conversationMemory = require("./conversation-memory");

// Configurações
const BOT_NAME = "Transcritor de Áudio (Rodrigo)";

// Verifica se suporte a áudio está habilitado
const AUDIO_ENABLED = audioHandler.isAudioEnabled();
if (AUDIO_ENABLED) {
  console.log("🎤 Suporte a ÁUDIO HABILITADO (OpenAI Whisper)");
} else {
  console.log(
    "⚠️  ERRO: OPENAI_API_KEY não configurada! Este bot PRECISA de transcrição."
  );
}

// Configuração do cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./.wwebjs_auth_teste", // Sessão separada do bot principal
  }),
  puppeteer: {
    headless: true,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
  },
});

// Eventos do WhatsApp
client.on("qr", (qr) => {
  console.log(
    "\n🔐 ESCANEIE O QR CODE ABAIXO COM SEU WHATSAPP (+5524981058194):\n"
  );
  qrcode.generate(qr, { small: true });
  console.log(
    "\n📱 Abra o WhatsApp → Aparelhos Conectados → Conectar Aparelho\n"
  );
});

client.on("authenticated", () => {
  console.log("🔓 Autenticação realizada com sucesso!");
});

client.on("auth_failure", (msg) => {
  console.error("❌ Falha na autenticação:", msg);
  console.log("💡 Tente deletar a pasta .wwebjs_auth_teste e reconectar");
});

client.on("disconnected", (reason) => {
  console.log("⚠️  Bot desconectado:", reason);
  console.log("🔄 Tentando reconectar...");
});

// Processa mensagens recebidas
client.on("message", async (msg) => {
  try {
    // ========================================
    // FILTRO PRINCIPAL: Só responde mensagens NOVAS
    // ========================================

    // Ignora mensagens antigas (antes do bot conectar)
    if (!botReady) {
      return;
    }

    // Ignora mensagens que chegaram há mais de 30 segundos
    const messageTimestamp = msg.timestamp * 1000;
    const now = Date.now();
    const thirtySecondsAgo = now - 30000;

    if (messageTimestamp < thirtySecondsAgo) {
      console.log("🚫 Mensagem antiga ignorada (antes do bot conectar)");
      return;
    }

    // ========================================
    // FILTROS: O que IGNORAR
    // ========================================

    // 1. Ignora mensagens de GRUPOS
    if (msg.from.includes("@g.us")) {
      console.log("🚫 Mensagem de GRUPO ignorada");
      return;
    }

    // 2. Ignora STATUS
    if (msg.from === "status@broadcast") {
      return;
    }

    // 3. Ignora mensagens PRÓPRIAS (suas)
    if (msg.fromMe) {
      console.log("🚫 Mensagem PRÓPRIA ignorada (você mesmo)");
      return;
    }

    // 4. Ignora NOTIFICAÇÕES automáticas (boas-vindas, templates, etc)
    if (
      msg.type === "notification" ||
      msg.type === "notification_template" ||
      msg.type === "gp2" ||
      msg.isStatus
    ) {
      console.log("🚫 Notificação automática ignorada");
      return;
    }

    // 5. Ignora se NÃO for ÁUDIO (este bot SÓ processa áudios)
    if (msg.type !== "ptt" && msg.type !== "audio") {
      console.log(`🚫 Ignorado (não é áudio): ${msg.type}`);
      return;
    }

    // ========================================
    // PROCESSA MENSAGEM (sempre processa, decide depois se responde)
    // ========================================

    const chatId = msg.from;
    const contact = await msg.getContact();
    const contactName = contact.pushname || contact.name || chatId;

    console.log("\n" + "=".repeat(50));
    console.log(`📩 Mensagem de: ${contactName}`);
    console.log(`📱 Número: ${chatId}`);
    console.log(`📝 Tipo: ${msg.type}`);

    // ========================================
    // VERIFICA SE VOCÊ JÁ PARTICIPOU DA CONVERSA HOJE
    // ========================================
    let youSentMessageToday = false;
    try {
      const chat = await msg.getChat();
      const messages = await chat.fetchMessages({ limit: 50 }); // Últimas 50 mensagens

      // Pega data de hoje (apenas dia/mês/ano, sem hora)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Procura se você mandou alguma mensagem hoje
      youSentMessageToday = messages.some((m) => {
        const messageDate = new Date(m.timestamp * 1000);
        messageDate.setHours(0, 0, 0, 0);

        return m.fromMe && messageDate.getTime() === today.getTime();
      });

      if (youSentMessageToday) {
        console.log(
          "� [MODO SILENCIOSO] Você já participou dessa conversa HOJE"
        );
        console.log("📝 Bot vai processar mas NÃO vai responder");
      }
    } catch (error) {
      console.log("⚠️  Erro ao verificar histórico:", error.message);
      // Em caso de erro, assume que não participou (melhor responder)
      youSentMessageToday = false;
    }

    // ========================================
    // SALVA MENSAGEM DO CLIENTE NO BD
    // ========================================
    const messageContent = msg.body || `[${msg.type}]`;
    conversationMemory.saveMessage(
      chatId,
      contactName,
      msg.type,
      messageContent,
      false, // não é do bot
      msg.timestamp
    );

    // ========================================
    // PROCESSA ÁUDIO (se habilitado)
    // ========================================
    if (msg.type === "ptt" || msg.type === "audio") {
      console.log("🎤 Áudio recebido");

      if (AUDIO_ENABLED) {
        // ÁUDIO HABILITADO: Transcreve com OpenAI Whisper
        try {
          console.log("🔄 Transcrevendo áudio com OpenAI Whisper...");

          const chat = await msg.getChat();

          // Só mostra "digitando" se for responder
          if (!youSentMessageToday) {
            await chat.sendStateTyping();
          }

          // Transcreve o áudio
          const transcription = await audioHandler.processWhatsAppAudio(msg);

          console.log(`💬 Transcrição: ${transcription}`);
          console.log(`🕐 Horário: ${new Date().toLocaleString("pt-BR")}`);

          // Salva transcrição no BD
          conversationMemory.saveMessage(
            chatId,
            contactName,
            "audio_transcribed",
            transcription,
            false, // é do cliente (transcrição)
            msg.timestamp
          );

          // Se você já participou da conversa hoje, NÃO responde
          if (youSentMessageToday) {
            console.log("✅ Transcrição salva no banco e logs");
            console.log("🚫 Bot NÃO respondeu (você já participou hoje)");
            console.log("=".repeat(50) + "\n");
            return;
          }

          // Simula tempo de digitação
          const typingTime = Math.random() * 1000 + 1000;
          await new Promise((resolve) => setTimeout(resolve, typingTime));

          // Envia resposta automática para ÁUDIO
          const replyAudio = getRandomReply(true);
          await msg.reply(replyAudio);

          // Salva resposta do bot no BD
          conversationMemory.saveMessage(
            chatId,
            "Assistente do Rodrigo",
            "text",
            replyAudio,
            true, // é do bot
            Date.now() / 1000
          );

          console.log(`🤖 Resposta automática enviada!`);
          console.log("=".repeat(50) + "\n");
          return;
        } catch (audioError) {
          console.error("❌ Erro ao processar áudio:", audioError.message);

          // Só responde com erro se for conversa nova
          if (!youSentMessageToday) {
            await msg.reply(
              "Desculpe, tive um probleminha ao processar seu áudio. Aguarde que o Rodrigo vai te responder em breve!"
            );
          }
          return;
        }
      } else {
        // ÁUDIO DESABILITADO: Pede para enviar texto (só em conversas novas)
        console.log("⚠️  Áudio não habilitado");

        if (!youSentMessageToday) {
          await msg.reply(getRandomReply(false));
          console.log(`🤖 Resposta automática enviada!`);
        } else {
          console.log("🚫 Bot NÃO respondeu (você já participou hoje)");
        }

        console.log("=".repeat(50) + "\n");
        return;
      }
    }

    // ========================================
    // PROCESSA TEXTO
    // ========================================

    if (msg.body) {
      console.log(`💬 Conteúdo: ${msg.body}`);
    } else if (msg.type === "ptt" || msg.type === "audio") {
      console.log(`💬 Conteúdo: [ÁUDIO]`);
    } else if (msg.hasMedia) {
      console.log(`💬 Conteúdo: [MÍDIA: ${msg.type}]`);
    }

    console.log(`🕐 Horário: ${new Date().toLocaleString("pt-BR")}`);

    // Se você já participou da conversa hoje, NÃO responde
    if (youSentMessageToday) {
      console.log("✅ Mensagem salva no banco e logs");
      console.log("🚫 Bot NÃO respondeu (você já participou hoje)");
      console.log("=".repeat(50) + "\n");
      return;
    }

    // Indicador de digitação (parece mais humano)
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    // Simula tempo de digitação (1-2 segundos)
    const typingTime = Math.random() * 1000 + 1000;
    await new Promise((resolve) => setTimeout(resolve, typingTime));

    // Envia resposta automática para TEXTO
    const replyText = getRandomReply(false);
    await msg.reply(replyText);

    // Salva resposta do bot no BD
    conversationMemory.saveMessage(
      chatId,
      "Assistente do Rodrigo",
      "text",
      replyText,
      true, // é do bot
      Date.now() / 1000
    );

    console.log(`🤖 Resposta automática enviada!`);
    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error("❌ Erro ao processar mensagem:", error);

    try {
      await msg.reply(
        "Ops! Tive um probleminha aqui. Aguarde que o Rodrigo vai te responder em breve!"
      );
    } catch (replyError) {
      console.error("❌ Erro ao enviar mensagem de erro:", replyError);
    }
  }
});

// Tratamento de erros globais
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\n⚠️  Encerrando bot de teste...");
  await client.destroy();
  console.log("✅ Bot de teste encerrado com sucesso!");
  process.exit(0);
});

// Variável para controlar quando o bot está pronto
let botReady = false;

// Rastreia último timestamp de resposta do bot por chat (evita loop)
const lastBotReply = new Map(); // chatId -> timestamp

// Marca bot como pronto após conectar
client.on("ready", () => {
  botReady = true;
  console.log("\n✅ Bot de TESTE conectado com sucesso!");
  console.log(`🤖 ${BOT_NAME} está online!`);
  console.log("📊 Aguardando mensagens...\n");
  console.log("⚠️  BOT DE TESTE: Responde todas mensagens automaticamente");
  console.log("💬 Respostas: Variam entre 3 opções (texto/áudio)");
  console.log("=".repeat(50));
});

// Inicia o bot
console.log("🚀 Iniciando Bot de TESTE...");
console.log(`🤖 Nome: ${BOT_NAME}`);
console.log(`📱 Número: +5524981058194`);
console.log("\n⚠️  MODO TESTE: Responde TODAS mensagens automaticamente");
console.log("💬 Respostas: Variam aleatoriamente (3 opções)");
console.log("\n⏳ Aguardando QR Code...\n");

client.initialize();
