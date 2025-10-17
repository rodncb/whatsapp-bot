const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const ArceeAIAgent = require("./ai-agent");
const MessageHandler = require("./message-handler");
const audioHandler = require("./audio-handler");
const conversationMemory = require("./conversation-memory");
const followUpManager = require("./follow-up-manager");

// Configurações
const OWNER_PHONE = process.env.OWNER_PHONE || "552299871594"; // Ana Cláudia
const BOT_NAME = process.env.BOT_NAME || "Ana Cláudia";
const ANA_REAL_PHONE = "5522999055098@c.us"; // Celular da Ana real para notificações
const MESSAGE_DELAY = 30000; // 30 segundos para aguardar múltiplas mensagens

// Lista de administradores (bot NÃO responde se qualquer um deles participar da conversa)
const ADMIN_PHONES = [
  "5522999055098@c.us", // Ana Cláudia
  "5522999388505@c.us", // Thiago
];

// Lista de quem recebe relatório diário às 19h (inclui admins + outros)
// Lista de quem recebe relatório diário às 19h (pode ser configurada via .env)
// Exemplo .env: REPORT_RECIPIENTS="5522999055098@c.us,5522999388505@c.us"
const REPORT_RECIPIENTS = (
  process.env.REPORT_RECIPIENTS ||
  "5522999055098@c.us,5522999388505@c.us,5524981058194@c.us"
)
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

// Sistema de debounce para agrupar mensagens
const pendingMessages = new Map(); // Armazena mensagens pendentes por chatId

// Rastreia mensagens recém-enviadas pelo bot (para não duplicar no message_create)
const recentBotMessages = new Set();

// Verifica se suporte a áudio está habilitado
const AUDIO_ENABLED = audioHandler.isAudioEnabled();
if (AUDIO_ENABLED) {
  console.log("🎤 Suporte a ÁUDIO HABILITADO (OpenAI Whisper)");
} else {
  console.log(
    "📝 Modo TEXTO apenas (configure OPENAI_API_KEY para habilitar áudio)"
  );
}

console.log("\n⚠️  BOT DE PRODUÇÃO - Ana Cláudia");
console.log("📱 Número: +55 22 99871-5947");
console.log("🎯 Modo: Conversação humanizada (Arcee.ai)");
console.log("❌ SEM respostas automáticas - Tudo via IA\n");
console.log("🔒 REGRAS DE SEGURANÇA:");
console.log("  ✅ Só responde contatos NOVOS (sem histórico)");
console.log("  ✅ Não responde se Ana já conversou hoje");
console.log("  ✅ Nunca responde mensagens de GRUPO\n");

// Inicializa componentes
const aiAgent = new ArceeAIAgent();
const messageHandler = new MessageHandler(aiAgent);

// Configuração do cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./.wwebjs_auth",
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
    defaultViewport: null,
    // Increase connect/launch timeout to 60s to avoid intermittent Timeouts on macOS
    timeout: 60000,
  },
});

// Eventos do WhatsApp
client.on("qr", (qr) => {
  console.log("\n🔐 ESCANEIE O QR CODE ABAIXO COM O WHATSAPP:\n");
  qrcode.generate(qr, { small: true });
  console.log(
    "\n📱 Abra o WhatsApp → Aparelhos Conectados → Conectar Aparelho\n"
  );
});

client.on("ready", () => {
  console.log("\n✅ Bot conectado com sucesso!");
  console.log(`🤖 ${BOT_NAME} está online e pronto para atender!`);
  console.log("📊 Aguardando mensagens...\n");
  console.log("=".repeat(50));

  // Inicia sistema de follow-up (roda às 19h todo dia)
  // Após enviar follow-ups, envia relatório diário
  followUpManager.startFollowUpJob(client, sendDailyReport);

  // Limpa conversas antigas a cada 24h
  setInterval(() => {
    messageHandler.cleanOldConversations();
  }, 24 * 60 * 60 * 1000);
});

client.on("authenticated", () => {
  console.log("🔓 Autenticação realizada com sucesso!");
});

client.on("auth_failure", (msg) => {
  console.error("❌ Falha na autenticação:", msg);
  console.log("💡 Tente deletar a pasta .wwebjs_auth e reconectar");
});

client.on("disconnected", (reason) => {
  console.log("⚠️  Bot desconectado:", reason);
  console.log("🔄 Tentando reconectar...");
});

// ========================================
// CAPTURA MENSAGENS ENVIADAS PELA ANA (de qualquer dispositivo)
// ========================================
client.on("message_create", async (msg) => {
  try {
    // Só processa se for mensagem enviada pela Ana (fromMe = true)
    if (!msg.fromMe) return;

    // Ignora grupos
    if (msg.to.includes("@g.us")) return;

    // Ignora status
    if (msg.to === "status@broadcast") return;

    const chatId = msg.to; // Para mensagens enviadas, o destinatário está em 'to'

    // Cria identificador único baseado no conteúdo
    const msgContent = (msg.body || `[${msg.type}]`).substring(0, 100);
    const msgId = `${chatId}_${msgContent}`;

    // Verifica se é uma mensagem recém-enviada pelo bot (ignora)
    if (recentBotMessages.has(msgId)) {
      console.log(`🤖 [IGNORADO] Mensagem do bot detectada, pulando...`);
      recentBotMessages.delete(msgId); // Remove após verificar
      return;
    }

    const contact = await client.getContactById(chatId);
    const contactName = contact.pushname || contact.name || chatId;

    console.log(
      `💬 [ANA HUMANA] Enviou ${msg.type} para: ${contactName} (${chatId})`
    );

    // Baixa e transcreve áudio se necessário
    let messageContent = msg.body || `[${msg.type}]`;

    if (msg.type === "ptt" || msg.type === "audio") {
      try {
        console.log(`🎤 Baixando áudio da Ana...`);
        const media = await msg.downloadMedia();

        if (media) {
          // Salva áudio temporariamente
          const audioPath = path.join(
            __dirname,
            "..",
            "temp",
            `ana_audio_${Date.now()}.ogg`
          );
          fs.writeFileSync(audioPath, media.data, "base64");

          // Transcreve usando OpenAI Whisper
          const audioHandler = require("./audio-handler");
          const transcription = await audioHandler.transcribeAudio(audioPath);

          if (transcription) {
            messageContent = transcription;
            console.log(
              `✅ Áudio da Ana transcrito: "${transcription.substring(
                0,
                50
              )}..."`
            );
          }

          // Remove arquivo temporário
          fs.unlinkSync(audioPath);
        }
      } catch (error) {
        console.error(`❌ Erro ao processar áudio da Ana:`, error.message);
        messageContent = "[áudio da Ana]";
      }
    }

    // Salva mensagem da Ana no banco
    conversationMemory.saveMessage(
      chatId,
      "Ana (Humana)",
      msg.type,
      messageContent,
      false, // NÃO é do bot
      msg.timestamp,
      {
        leadSource: "direct",
        isAdLead: false,
        fromAdmin: true,
        adminPhone: "5522999055098",
      }
    );

    console.log(`✅ Mensagem da Ana salva no banco para: ${contactName}`);
  } catch (error) {
    console.error("❌ Erro ao processar mensagem da Ana:", error);
  }
});

// Processa mensagens recebidas
client.on("message", async (msg) => {
  try {
    // ========================================
    // REGRA 1: IGNORA GRUPOS SEMPRE
    // ========================================
    if (msg.from.includes("@g.us")) {
      console.log("🚫 Mensagem de GRUPO ignorada");
      return;
    }

    // Ignora status
    if (msg.from === "status@broadcast") {
      return;
    }

    const chatId = msg.from;
    const contact = await msg.getContact();
    const contactName = contact.pushname || contact.name || chatId;

    // ========================================
    // SALVA MENSAGENS DA ANA (fromMe) NO BANCO
    // ========================================
    if (msg.fromMe) {
      // Identifica qual admin está respondendo
      let adminPhone = null;
      for (const phone of ADMIN_PHONES) {
        // A mensagem é da Ana se foi enviada do número do bot
        if (phone === "5522999055098") {
          // Número da Ana admin
          adminPhone = phone;
          break;
        }
      }

      // Salva a mensagem da Ana no banco
      const messageContent = msg.body || `[${msg.type}]`;
      conversationMemory.saveMessage(
        chatId,
        "Ana (Humana)", // Nome que identifica como humana
        msg.type,
        messageContent,
        false, // NÃO é do bot, é da humana Ana
        msg.timestamp,
        {
          leadSource: "direct",
          isAdLead: false,
          fromAdmin: true,
          adminPhone: adminPhone,
        }
      );

      console.log(`👤 Ana → ${contactName} (${msg.type})`);
      return; // Não processa resposta automática
    }

    // ========================================
    // REGRA 1.5: ADMINISTRADORES - Responde sobre STATUS/FLUXO
    // ========================================
    if (ADMIN_PHONES.includes(chatId)) {
      console.log(`👨‍� Mensagem de ADMINISTRADOR: ${contactName} (${chatId})`);

      // Responde sobre status/fluxo do bot
      await handleAdminMessage(msg, chatId, contactName);
      return;
    }

    // ========================================
    // REGRA 2: VERIFICA SE É CONTATO NOVO
    // ========================================
    const hasHistory = conversationMemory.hasConversationHistory(chatId);

    // ========================================
    // REGRA 3: VERIFICA SE ALGUM ADMIN JÁ CONVERSOU (neste chat)
    // ========================================
    let adminParticipatedToday = false;
    let participantAdmin = null;

    for (const adminPhone of ADMIN_PHONES) {
      if (conversationMemory.userSentMessageToday(chatId, adminPhone)) {
        adminParticipatedToday = true;
        participantAdmin = adminPhone;
        break;
      }
    }

    // ========================================
    // DETECTA LEAD DO FACEBOOK
    // ========================================
    const isAdLead = conversationMemory.isFromFacebookAd(msg.body);
    const leadSource = isAdLead ? "facebook_ad" : "direct";

    // ========================================
    // DECISÃO INTELIGENTE: BOT DEVE RESPONDER?
    // ========================================
    let shouldBotRespond = true;
    let skipReason = "";

    // REGRA 1: Se for mensagem do ANÚNCIO → SEMPRE RESPONDE (ignora histórico)
    if (isAdLead) {
      shouldBotRespond = true;
      console.log(
        `🎯 [LEAD FB] ${contactName} (${msg.type}) - Bot vai responder`
      );
    }
    // REGRA 2: Se NÃO for anúncio → Verifica histórico e participação de admin
    else {
      // Se tem histórico E admin participou → NÃO RESPONDE
      if (hasHistory && adminParticipatedToday) {
        shouldBotRespond = false;
        skipReason = `Admin já conversou hoje`;
      }
      // Se tem histórico mas admin NÃO participou → RESPONDE
      else if (hasHistory && !adminParticipatedToday) {
        shouldBotRespond = true;
        console.log(
          `✅ ${contactName} (${msg.type}) - Bot ativo (sem admin hoje)`
        );
      }
      // Se NÃO tem histórico (novo) → RESPONDE
      else if (!hasHistory) {
        shouldBotRespond = true;
        console.log(`✅ ${contactName} (${msg.type}) - Contato novo`);
      }
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
      msg.timestamp,
      {
        leadSource,
        isAdLead,
      }
    );

    // ========================================
    // SISTEMA DE FOLLOW-UP: Detecta se cliente prometeu algo
    // ========================================
    if (msg.body) {
      const pendingAction = followUpManager.detectPendingAction(msg.body);
      if (pendingAction) {
        console.log(`📋 Detectado: ${pendingAction.description}`);
        followUpManager.markAsPending(
          chatId,
          pendingAction.type,
          pendingAction.description
        );
      }
    }

    // Se recebeu documento/imagem, limpa pendência E notifica Ana
    if (msg.type === "image" || msg.type === "document") {
      followUpManager.clearPendingIfFulfilled(chatId, msg.type);

      // Cliente enviou documento! Possível OCR se habilitado
      console.log(
        `📄 ${contactName} enviou documento (${msg.type}) - processando...`
      );

      const chat = await msg.getChat();

      // Mensagem de confirmação padrão (mantemos a mesma para o cliente)
      const confirmMsg = `Perfeito! Recebi seu documento. 📄✅\n\nVou analisar e te retorno em breve com mais informações sobre seu financiamento! 😊`;

      // Se OCR está habilitado, tente extrair texto antes de responder ao cliente (opção A)
      const ENABLE_OCR =
        (process.env.ENABLE_OCR || "false").toLowerCase() === "true";

      let ocrSummary = null;
      if (ENABLE_OCR) {
        try {
          const ocrHandler = require("./ocr-handler");
          console.log("📷 OCR: baixando mídia...");
          const media = await msg.downloadMedia();
          if (media && media.data) {
            const buffer = Buffer.from(media.data, "base64");
            const mimeType = media.mimetype || "image/jpeg";

            // Chama OCR síncrono (Arcee -> OpenAI fallback)
            const ocrResult = await ocrHandler.extractTextFromMedia(
              buffer,
              mimeType
            );

            if (ocrResult && ocrResult.success) {
              const snippet = String(ocrResult.text).substring(0, 400);
              ocrSummary = `OCR: provider=${ocrResult.provider}; snippet=${snippet}`;
              console.log(`📷 OCR OK: provider=${ocrResult.provider}`);

              // Salva resultado OCR como mensagem no DB (resumo)
              conversationMemory.saveMessage(
                chatId,
                BOT_NAME,
                "text",
                `OCR (${ocrResult.provider}): ${snippet}`,
                true,
                Math.floor(Date.now() / 1000)
              );
            } else {
              console.log("📷 OCR: nenhum texto extraído");
              ocrSummary = `OCR: nenhum texto extraído`;
            }
          } else {
            console.log("📷 OCR: não foi possível baixar mídia");
            ocrSummary = "OCR: erro ao baixar mídia";
          }
        } catch (ocrError) {
          console.error("❌ Erro durante OCR:", ocrError.message || ocrError);
          ocrSummary = `OCR: erro (${ocrError.message || "unknown"})`;
        }
      }

      // Decide comportamento quando OCR falhar: NÃO RESPONDER AO CLIENTE, apenas notificar Ana.
      const ocrFailed =
        ENABLE_OCR &&
        (!ocrSummary ||
          ocrSummary.includes("nenhum texto extraído") ||
          ocrSummary.includes("erro"));

      if (!ocrFailed) {
        // Responde ao cliente apenas quando OCR foi bem-sucedido ou OCR não está habilitado
        try {
          await chat.sendStateTyping();
          await new Promise((resolve) => setTimeout(resolve, 1500));
          await msg.reply(confirmMsg);

          // Salva resposta do bot
          conversationMemory.saveMessage(
            chatId,
            BOT_NAME,
            "text",
            confirmMsg,
            true,
            Math.floor(Date.now() / 1000)
          );
        } catch (replyError) {
          console.error("❌ Erro ao enviar resposta ao cliente:", replyError);
        }
      } else {
        // Quando OCR falha, não enviamos nada ao cliente (silencioso). Ana já será notificada abaixo.
        console.log(
          `🔕 OCR falhou para ${chatId} — não será enviada mensagem ao cliente; Ana será notificada.`
        );
      }

      // Notifica Ana (humana) sobre documento recebido, incluindo resumo OCR se houver
      try {
        let notifyMsg = `📄 *DOCUMENTO RECEBIDO!*\n\nCliente: ${contactName}\nTipo: ${
          msg.type === "image" ? "Imagem/Foto" : "Documento"
        }`;
        if (ocrSummary) {
          notifyMsg += `\n\n${ocrSummary}`;
        }
        notifyMsg += `\n\n⚠️ BOT ENCERRADO - Assuma o atendimento!`;

        await client.sendMessage(ANA_REAL_PHONE, notifyMsg);
        console.log("📢 Ana notificada sobre documento recebido!");
      } catch (error) {
        console.error("❌ Erro ao notificar Ana:", error);
      }

      // IMPORTANTE: Retorna aqui para NÃO processar mais nada
      return;
    }

    // Se recebeu áudio, limpa pendência (mas continua processando normalmente)
    if (msg.type === "ptt") {
      followUpManager.clearPendingIfFulfilled(chatId, msg.type);
    }

    // ========================================
    // SE BOT NÃO DEVE RESPONDER: APENAS SALVA E SAI
    // ========================================
    if (!shouldBotRespond) {
      console.log(`🔕 ${contactName} - ${skipReason} (msg salva, bot inativo)`);
      return;
    }

    // ========================================
    // SISTEMA DE DEBOUNCE: AGUARDA 30s PARA AGRUPAR MENSAGENS
    // ========================================

    // Se já existe timer para este chat, cancela o anterior
    if (pendingMessages.has(chatId)) {
      clearTimeout(pendingMessages.get(chatId).timer);
      console.log(`⏱️  Timer anterior cancelado, reiniciando contagem de 30s`);
    }

    // Cria/atualiza entrada de mensagens pendentes
    const existingData = pendingMessages.get(chatId) || {
      messages: [],
      isAdLead: isAdLead,
    };
    existingData.messages.push({
      type: msg.type,
      body: messageContent,
      timestamp: msg.timestamp,
      msg: msg,
    });
    // Mantém o isAdLead se alguma mensagem for do anúncio
    if (isAdLead) {
      existingData.isAdLead = true;
    }

    // Cria novo timer de 30 segundos
    const timer = setTimeout(async () => {
      console.log(
        `⏰ 30 segundos passaram, processando ${existingData.messages.length} mensagem(ns)`
      );

      // Remove do map
      pendingMessages.delete(chatId);

      // Agrupa todas as mensagens em uma string
      const allMessages = existingData.messages.map((m) => m.body).join("\n");

      console.log(`📦 Mensagens agrupadas:\n${allMessages}`);

      // Pega a última mensagem para reply
      const lastMsg =
        existingData.messages[existingData.messages.length - 1].msg;

      // Agora processa normalmente com TODAS as mensagens agrupadas
      await processMessage(
        lastMsg,
        chatId,
        contactName,
        allMessages,
        existingData.isAdLead
      );
    }, MESSAGE_DELAY);

    // Salva o timer
    existingData.timer = timer;
    pendingMessages.set(chatId, existingData);

    console.log(`⏳ Aguardando 30 segundos para processar mensagens...`);
    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error("❌ Erro ao processar mensagem:", error);
  }
});

// Função auxiliar para processar mensagem (extraída do event listener)
async function processMessage(
  msg,
  chatId,
  contactName,
  messageContent,
  isFromAd = false
) {
  try {
    const chat = await msg.getChat();

    // ========================================
    // PROCESSA ÁUDIO (se habilitado)
    // ========================================
    if (msg.type === "ptt" || msg.type === "audio") {
      if (AUDIO_ENABLED) {
        // ÁUDIO HABILITADO: Transcreve com OpenAI Whisper
        try {
          console.log(`🎤 ${contactName} enviou áudio - Transcrevendo...`);

          const chat = await msg.getChat();
          await chat.sendStateTyping();

          // Transcreve o áudio
          const transcription = await audioHandler.processWhatsAppAudio(msg);

          console.log(`� Transcrição: "${transcription.substring(0, 60)}..."`);

          // Salva transcrição no BD
          conversationMemory.saveMessage(
            chatId,
            contactName,
            "audio_transcribed",
            transcription,
            false, // é do cliente (transcrição)
            msg.timestamp
          );

          // Busca contexto da conversa anterior
          const context = conversationMemory.getContextForAI(chatId, 10);

          // Processa como texto normal com Arcee.ai
          await chat.sendStateTyping();
          const response = await messageHandler.handleMessage(
            chatId,
            transcription,
            context,
            isFromAd
          );

          // Simula tempo de digitação
          const typingTime = Math.random() * 2000 + 1000;
          await new Promise((resolve) => setTimeout(resolve, typingTime));

          // Registra mensagem do bot antes de enviar (para evitar duplicação no message_create)
          const msgContent = response.reply.substring(0, 100);
          const msgId = `${chatId}_${msgContent}`;
          recentBotMessages.add(msgId);
          setTimeout(() => recentBotMessages.delete(msgId), 3000); // Remove após 3s

          await msg.reply(response.reply);
          console.log(
            `🤖 Bot → ${contactName}: "${response.reply.substring(0, 60)}..."`
          );

          // Salva resposta do bot no BD
          conversationMemory.saveMessage(
            chatId,
            BOT_NAME,
            "text",
            response.reply,
            true, // é do bot
            Date.now() / 1000
          );

          // Notifica Ana se lead qualificado
          if (response.shouldNotifyOwner) {
            await notifyAna(
              response.reason,
              response.contactInfo,
              chatId,
              contactName
            );
          }
        } catch (audioError) {
          console.error("❌ Erro ao processar áudio:", audioError.message);

          const audioErrorMsg =
            "Desculpe, tive um probleminha ao processar seu áudio. Pode digitar sua mensagem? 😊";
          const msgId = `${chatId}_${audioErrorMsg.substring(0, 100)}`;
          recentBotMessages.add(msgId);
          setTimeout(() => recentBotMessages.delete(msgId), 3000);

          await msg.reply(audioErrorMsg);
        }
      } else {
        // ÁUDIO DESABILITADO: Pede para enviar texto
        console.log("⚠️  Áudio não habilitado, pedindo texto");

        const noAudioMsg = `Oi! 😊 

Recebi seu áudio, mas para te atender melhor, você pode digitar sua mensagem? 

Assim consigo te responder mais rápido! 📝`;
        const msgId = `${chatId}_${noAudioMsg.substring(0, 100)}`;
        recentBotMessages.add(msgId);
        setTimeout(() => recentBotMessages.delete(msgId), 3000);

        await msg.reply(noAudioMsg);
      }

      console.log("=".repeat(50) + "\n");
      return;
    }

    // ========================================
    // PROCESSA TEXTO (Arcee.ai)
    // ========================================
    console.log(`💬 Conteúdo agrupado: ${messageContent}`);
    console.log(`🕐 Horário: ${new Date().toLocaleString("pt-BR")}`);

    // Busca contexto da conversa anterior
    const context = conversationMemory.getContextForAI(chatId, 10);
    console.log(
      `📚 Contexto (primeiras 200 chars): ${context.substring(0, 200)}...`
    );

    // Indicador de digitação
    await chat.sendStateTyping();

    // Processa mensagem com IA (usando messageContent que pode conter várias mensagens)
    const response = await messageHandler.handleMessage(
      chatId,
      messageContent,
      context,
      isFromAd
    );

    // Simula tempo de digitação humano (1-3 segundos)
    const typingTime = Math.random() * 2000 + 1000;
    await new Promise((resolve) => setTimeout(resolve, typingTime));

    // Registra mensagem do bot antes de enviar (para evitar duplicação no message_create)
    const msgContent = response.reply.substring(0, 100);
    const msgId = `${chatId}_${msgContent}`;
    recentBotMessages.add(msgId);
    setTimeout(() => recentBotMessages.delete(msgId), 3000); // Remove após 3s

    // Envia resposta
    await msg.reply(response.reply);
    console.log(
      `🤖 Bot → ${contactName}: "${response.reply.substring(0, 60)}..."`
    );

    // Salva resposta do bot no BD
    conversationMemory.saveMessage(
      chatId,
      BOT_NAME,
      "text",
      response.reply,
      true, // é do bot
      Date.now() / 1000
    );

    // Notifica Ana se lead qualificado
    if (response.shouldNotifyOwner) {
      await notifyAna(
        response.reason,
        response.contactInfo,
        chatId,
        contactName
      );
    }

    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error(
      "❌ Erro ao processar mensagem na função processMessage:",
      error
    );

    try {
      const errorMsg =
        "Desculpe, tive um probleminha aqui. Pode repetir sua mensagem? 😊";

      // Registra mensagem do bot antes de enviar
      const msgId = `${msg.from}_${errorMsg.substring(0, 100)}`;
      recentBotMessages.add(msgId);
      setTimeout(() => recentBotMessages.delete(msgId), 3000);

      await msg.reply(errorMsg);
    } catch (replyError) {
      console.error("❌ Erro ao enviar mensagem de erro:", replyError);
    }
  }
}

/**
 * Responde administradores com informações sobre status/fluxo do bot
 */
async function handleAdminMessage(msg, chatId, contactName) {
  try {
    const messageBody = (msg.body || "").toLowerCase();

    console.log(`📊 Admin perguntou: ${msg.body}`);

    let response = "";

    // Detecta perguntas sobre status
    if (
      messageBody.includes("status") ||
      messageBody.includes("como está") ||
      messageBody.includes("ativo")
    ) {
      const stats = conversationMemory.getStats
        ? conversationMemory.getStats()
        : {};
      response = `🤖 *STATUS DO BOT*

✅ Bot está ONLINE e funcionando!
📱 Número: Ana Cláudia (22 99871-5947)
🔄 Sistema de Follow-up: ATIVO (19h todo dia)

📊 *Estatísticas:*
💬 Total de conversas hoje: ${stats.todayConversations || "N/A"}
👥 Leads qualificados: ${stats.qualifiedLeads || "N/A"}
⏰ Última atualização: ${new Date().toLocaleString("pt-BR")}

🎯 *Regras Ativas:*
✅ Só responde contatos NOVOS
✅ Ignora se admin participou
✅ Debounce 30s (agrupa mensagens)
✅ Follow-up automático às 19h

Tudo funcionando! 🚀`;
    }
    // Detecta perguntas sobre atendimento/fluxo
    else if (
      messageBody.includes("atendimento") ||
      messageBody.includes("fluxo")
    ) {
      response = `📋 *FLUXO DE ATENDIMENTO*

1️⃣ Cliente envia mensagem
2️⃣ Bot aguarda 30s (agrupa múltiplas msgs)
3️⃣ Responde UMA VEZ com contexto completo

🎯 *Qualificação:*
- Pega nome
- Pergunta sobre análise de crédito prévia
- Explica MCMV
- Coleta: tipo de trabalho, renda, idade
- Oferece análise sem compromisso
- Pede documentos

✅ *Renda baixa:* Oferece soluções (compor renda, renda informal)
✅ *Autônomo:* Contexto sobre Caixa + explicação
✅ *Promete documentos:* Cria follow-up para 19h

Tudo rodando normal! 😊`;
    }
    // Detecta perguntas sobre leads/clientes
    else if (
      messageBody.includes("leads") ||
      messageBody.includes("clientes") ||
      messageBody.includes("pendentes")
    ) {
      const pending = followUpManager.getPendingFollowUps
        ? followUpManager.getPendingFollowUps()
        : [];
      response = `👥 *LEADS E FOLLOW-UPS*

📊 Follow-ups pendentes: ${pending.length}

${
  pending.length > 0
    ? pending
        .map(
          (f, i) =>
            `${i + 1}. ${f.name || f.phone_number}\n   📋 ${
              f.follow_up_type
            }\n   📅 Agendado: ${new Date(f.scheduled_date).toLocaleString(
              "pt-BR"
            )}`
        )
        .join("\n\n")
    : "✅ Nenhum follow-up pendente no momento!"
}

🔔 Próximo envio: Hoje às 19:00`;
    }
    // Relatório diário
    else if (
      messageBody.includes("relatório") ||
      messageBody.includes("relatorio")
    ) {
      response = await generateDailyReport();
    }
    // Resposta genérica
    else {
      response = `👨‍💼 Olá ${contactName}!

Sou o bot da Ana Cláudia e estou funcionando! 😊

Você pode me perguntar sobre:
• *status* - Ver se estou ativo
• *atendimento* ou *fluxo* - Como funciona
• *leads* ou *pendentes* - Follow-ups agendados
• *relatório* - Relatório de ontem

Como posso ajudar? 🤖`;
    }

    // Registra mensagem do bot antes de enviar
    const msgId = `${msg.from}_${response.substring(0, 100)}`;
    recentBotMessages.add(msgId);
    setTimeout(() => recentBotMessages.delete(msgId), 3000);

    await msg.reply(response);

    // Salva resposta do bot no banco de dados
    conversationMemory.saveMessage(
      msg.from,
      "Ana Cláudia",
      "text",
      response,
      true, // é do bot
      Date.now() / 1000
    );

    console.log(`✅ Resposta admin enviada para ${contactName}`);
    console.log(`📤 Conteúdo: ${response.substring(0, 200)}...`);
  } catch (error) {
    console.error("❌ Erro ao responder admin:", error);
  }
}

/**
 * Notifica Ana quando um lead está qualificado
 * ENVIA DE FORMA SILENCIOSA - Cliente não sabe que houve troca
 */
async function notifyAna(reason, contactInfo, chatId, contactName) {
  try {
    const message = `🎯 *LEAD QUALIFICADO!*

${reason}

📋 *Dados do Cliente:*
👤 Nome: ${contactName}
📱 WhatsApp: ${chatId.replace("@c.us", "")}
💼 Trabalho: ${contactInfo.workType || "Não informado"}
💰 Renda: ${contactInfo.income || "Não informada"}
🎂 Idade: ${contactInfo.age || "Não informada"}
📨 Mensagens: ${contactInfo.messagesCount || 0}
🕐 Início: ${
      contactInfo.startedAt
        ? contactInfo.startedAt.toLocaleString("pt-BR")
        : "Agora"
    }

⚡ *Cliente aguardando! Assuma quando puder.*

💡 *O cliente NÃO sabe que houve troca de atendente.*`;

    await client.sendMessage(ANA_REAL_PHONE, message);
    console.log("📢 Ana notificada silenciosamente!");
  } catch (error) {
    console.error("❌ Erro ao notificar Ana:", error);
  }
}

// Tratamento de erros globais
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  // Não encerra o processo, tenta manter o bot rodando
});

// Graceful shutdown
/**
 * Gera relatório diário de leads
 * @param {Date} date - Data do relatório (default: ontem)
 * @returns {string} Relatório formatado
 */
async function generateDailyReport(date = null) {
  try {
    // Se não passar data, usa ONTEM
    const targetDate = date || new Date(Date.now() - 24 * 60 * 60 * 1000);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
    const endTimestamp = Math.floor(endOfDay.getTime() / 1000);

    const dateStr = targetDate.toLocaleDateString("pt-BR");

    // 1. Total de contatos do dia (excluindo Ana Humana)
    const totalContacts = conversationMemory.db
      .prepare(
        `
      SELECT COUNT(DISTINCT phone_number) as count
      FROM conversations
      WHERE timestamp >= ? AND timestamp <= ?
        AND contact_name != 'Ana (Humana)'
    `
      )
      .get(startTimestamp, endTimestamp).count;

    // 2. Contatos que não responderam (bot enviou mas cliente nunca respondeu)
    const noResponse = conversationMemory.db
      .prepare(
        `
      SELECT DISTINCT c1.phone_number, co.name
      FROM conversations c1
      LEFT JOIN contacts co ON c1.phone_number = co.phone_number
      WHERE c1.is_from_bot = 1 
        AND c1.timestamp >= ? AND c1.timestamp <= ?
        AND NOT EXISTS (
          SELECT 1 FROM conversations c2 
          WHERE c2.phone_number = c1.phone_number 
            AND c2.is_from_bot = 0
            AND c2.timestamp >= ?
            AND c2.timestamp <= ?
        )
    `
      )
      .all(startTimestamp, endTimestamp, startTimestamp, endTimestamp);

    // 3. Contatos que enviaram documentos (APENAS imagens e documentos, SEM áudios)
    const sentDocs = conversationMemory.db
      .prepare(
        `
      SELECT DISTINCT phone_number, contact_name
      FROM conversations
      WHERE (message_type IN ('image', 'document'))
        AND is_from_bot = 0
        AND timestamp >= ? AND timestamp <= ?
    `
      )
      .all(startTimestamp, endTimestamp);

    // 4. Contatos que pararam de responder (última msg do CLIENTE > 1 dia atrás, excluindo Ana Humana)
    const stopped = conversationMemory.db
      .prepare(
        `
      SELECT DISTINCT c1.phone_number, co.name,
        MAX(c1.timestamp) as last_message
      FROM conversations c1
      LEFT JOIN contacts co ON c1.phone_number = co.phone_number
      WHERE c1.is_from_bot = 0
        AND c1.contact_name != 'Ana (Humana)'
      GROUP BY c1.phone_number
      HAVING last_message < (strftime('%s', 'now') - 86400)
        AND last_message >= (strftime('%s', 'now') - 604800)
    `
      )
      .all(); // Não precisa de parâmetros, usa timestamp atual

    // 5. Agendamentos do dia
    const appointments = conversationMemory.db
      .prepare(
        `
      SELECT phone_number, preferred_date, preferred_time, status
      FROM appointments
      WHERE datetime(created_at) >= datetime(?, 'unixepoch')
        AND datetime(created_at) <= datetime(?, 'unixepoch')
    `
      )
      .all(startTimestamp, endTimestamp);

    // 6. Ana (humana) assumiu - Pega nome real do contato, não "Ana (Humana)"
    const anaEntrou = conversationMemory.db
      .prepare(
        `
      SELECT DISTINCT c.phone_number, 
        COALESCE(
          (SELECT contact_name FROM conversations 
           WHERE phone_number = c.phone_number 
             AND contact_name != 'Ana (Humana)' 
           LIMIT 1),
          c.phone_number
        ) as contact_name
      FROM conversations c
      WHERE c.contact_name = 'Ana (Humana)'
        AND c.timestamp >= ? AND c.timestamp <= ?
    `
      )
      .all(startTimestamp, endTimestamp);

    // Monta relatório - APENAS RESUMO + DETALHES SE HOUVER DADOS
    let report = `📊 *RELATÓRIO DIÁRIO - ${dateStr}*\n\n`;

    report += `📈 *RESUMO GERAL*\n`;
    report += `👥 Total de Contatos: *${totalContacts}*\n`;
    report += `📩 Não Responderam: *${noResponse.length}*\n`;
    report += `📄 Enviaram Docs: *${sentDocs.length}*\n`;
    report += `⏸️ Pararam de Responder: *${stopped.length}*\n`;
    report += `📅 Agendamentos: *${appointments.length}*\n`;
    report += `👤 Ana Assumiu: *${anaEntrou.length}*\n`;

    // SÓ ADICIONA DETALHES SE HOUVER DADOS (mantém relatório limpo)

    // Detalhes de não responderam
    if (noResponse.length > 0) {
      report += `\n❌ *NÃO RESPONDERAM:*\n`;
      noResponse.forEach((c, i) => {
        report += `${i + 1}. ${c.name || c.phone_number}\n`;
      });
    }

    // Detalhes de docs enviados
    if (sentDocs.length > 0) {
      report += `\n📄 *ENVIARAM DOCUMENTOS:*\n`;
      sentDocs.forEach((c, i) => {
        report += `${i + 1}. ${c.contact_name || c.phone_number}\n`;
      });
    }

    // Detalhes de pararam de responder
    if (stopped.length > 0) {
      report += `\n⏸️ *PARARAM DE RESPONDER:*\n`;

      // Agrupa por nome (se disponível) e lista os telefones associados.
      // Isso evita múltiplas linhas com o mesmo nome quando existem vários números.
      const grouped = new Map();
      for (const c of stopped) {
        const name =
          c.name && String(c.name).trim() ? String(c.name).trim() : null;
        const key = name || c.phone_number;
        if (!grouped.has(key)) {
          grouped.set(key, { phones: new Set(), last_message: 0 });
        }
        const g = grouped.get(key);
        g.phones.add(c.phone_number);
        g.last_message = Math.max(g.last_message || 0, c.last_message || 0);
      }

      // Ordena por última mensagem (mais antigo primeiro)
      const items = Array.from(grouped.entries()).sort(
        (a, b) => a[1].last_message - b[1].last_message
      );

      let idx = 1;
      for (const [key, val] of items) {
        const lastMsgDate = new Date((val.last_message || 0) * 1000);
        const daysAgo = val.last_message
          ? Math.floor(
              (Date.now() - lastMsgDate.getTime()) / (24 * 60 * 60 * 1000)
            )
          : "?";
        const phonesList = Array.from(val.phones).join(", ");
        const display = key ? `${key} (${phonesList})` : phonesList;
        report += `${idx}. ${display} (${daysAgo}d atrás)\n`;
        idx++;
      }
    }

    // Detalhes de agendamentos
    if (appointments.length > 0) {
      report += `\n📅 *AGENDAMENTOS:*\n`;
      appointments.forEach((a, i) => {
        report += `${i + 1}. ${a.phone_number}\n`;
        report += `   📆 ${a.preferred_date} às ${a.preferred_time}\n`;
        report += `   Status: ${a.status}\n`;
      });
    }

    // Ana assumiu
    if (anaEntrou.length > 0) {
      report += `\n👤 *ANA ASSUMIU:*\n`;
      anaEntrou.forEach((c, i) => {
        report += `${i + 1}. ${c.contact_name}\n`;
      });
    }

    report += `---\n_Relatório gerado às ${new Date().toLocaleTimeString(
      "pt-BR"
    )}_`;

    return report;
  } catch (error) {
    console.error("❌ Erro ao gerar relatório:", error);
    return `❌ Erro ao gerar relatório: ${error.message}`;
  }
}

/**
 * Envia relatório diário para todos os destinatários
 */
async function sendDailyReport() {
  try {
    console.log("\n📊 ========== ENVIANDO RELATÓRIO DIÁRIO ==========");
    const report = await generateDailyReport();

    // Filtra destinatários: remove duplicados e (se possível) o próprio número do bot
    const botNumber =
      client && client.info && client.info.wid && client.info.wid._serialized
        ? client.info.wid._serialized
        : null;
    const recipientsFiltered = Array.from(
      new Set(REPORT_RECIPIENTS.map((r) => r.trim()))
    ).filter((r) => r && r !== botNumber);

    console.log(
      "📣 Relatório será enviado para:",
      recipientsFiltered.join(", ")
    );

    for (const recipient of recipientsFiltered) {
      try {
        await client.sendMessage(recipient, report);
        console.log(`✅ Relatório enviado para ${recipient}`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`❌ Erro ao enviar para ${recipient}:`, error.message);
      }
    }

    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error("❌ Erro ao enviar relatórios:", error);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\n⚠️  Encerrando bot...");
  await client.destroy();
  console.log("✅ Bot encerrado com sucesso!");
  process.exit(0);
});

// Inicia o bot
console.log("🚀 Iniciando WhatsBot com IA...");
console.log(`🤖 Nome: ${BOT_NAME}`);
console.log(`🏢 Empresa: ${process.env.COMPANY_NAME}`);
console.log("\n⏳ Aguardando QR Code...\n");

client.initialize();
