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
  process.exit(1);
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

// Variável para controlar quando o bot está pronto
let botReady = false;

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

client.on("ready", () => {
  botReady = true;
  console.log("\n✅ Bot TRANSCRITOR conectado com sucesso!");
  console.log(`🤖 ${BOT_NAME} está online!`);
  console.log("📊 Aguardando áudios para transcrever...\n");
  console.log("🚫 MODO TRANSCRIÇÃO: Apenas salva transcrições, NÃO responde");
  console.log("=".repeat(50));
});

// Processa mensagens recebidas
client.on("message", async (msg) => {
  try {
    // ========================================
    // FILTROS INICIAIS
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
      return;
    }

    // Ignora mensagens de GRUPOS
    if (msg.from.includes("@g.us")) {
      return;
    }

    // Ignora STATUS
    if (msg.from === "status@broadcast") {
      return;
    }

    // Ignora mensagens PRÓPRIAS (suas)
    if (msg.fromMe) {
      return;
    }

    // Ignora NOTIFICAÇÕES automáticas
    if (
      msg.type === "notification" ||
      msg.type === "notification_template" ||
      msg.type === "gp2" ||
      msg.isStatus
    ) {
      return;
    }

    // ========================================
    // PROCESSA APENAS ÁUDIOS
    // ========================================

    // Ignora se NÃO for ÁUDIO (este bot SÓ processa áudios)
    if (msg.type !== "ptt" && msg.type !== "audio") {
      return;
    }

    // ========================================
    // TRANSCREVE ÁUDIO (sem responder)
    // ========================================

    const chatId = msg.from;
    const contact = await msg.getContact();
    const contactName = contact.pushname || contact.name || chatId;

    console.log("\n" + "=".repeat(50));
    console.log(`📩 ÁUDIO de: ${contactName}`);
    console.log(`📱 Número: ${chatId}`);
    console.log(`🕐 Horário: ${new Date().toLocaleString("pt-BR")}`);

    try {
      console.log("🔄 Transcrevendo áudio com OpenAI Whisper...");

      // Transcreve o áudio
      const transcription = await audioHandler.processWhatsAppAudio(msg);

      console.log(`✅ Transcrição: ${transcription}`);

      // Salva transcrição no BD
      conversationMemory.saveMessage(
        chatId,
        contactName,
        "audio_transcribed",
        transcription,
        false, // é do cliente (transcrição)
        msg.timestamp
      );

      console.log("💾 Transcrição salva no banco de dados");
      console.log("🚫 Nenhuma resposta enviada (modo transcrição apenas)");
      console.log("=".repeat(50) + "\n");
    } catch (audioError) {
      console.error("❌ Erro ao processar áudio:", audioError.message);
      console.log("=".repeat(50) + "\n");
    }
  } catch (error) {
    console.error("❌ Erro ao processar mensagem:", error);
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
  console.log("\n\n⚠️  Encerrando bot transcritor...");
  await client.destroy();
  console.log("✅ Bot transcritor encerrado com sucesso!");
  process.exit(0);
});

// Inicia o bot
console.log("🚀 Iniciando Bot TRANSCRITOR...");
console.log(`🤖 Nome: ${BOT_NAME}`);
console.log(`📱 Número: +5524981058194`);
console.log("\n🚫 MODO TRANSCRIÇÃO: Apenas salva, NÃO responde");
console.log("\n⏳ Aguardando QR Code...\n");

client.initialize();
