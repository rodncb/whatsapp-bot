const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const audioHandler = require("./audio-handler");

// Configurações
const BOT_NAME = "Bot Transcrição (Rodrigo)";

// Cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "transcricao-rodrigo", // ID diferente para não conflitar
  }),
  puppeteer: {
    headless: true,
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

// Verifica se suporte a áudio está habilitado
const AUDIO_ENABLED = audioHandler.isAudioEnabled();

console.log("\n" + "=".repeat(50));
console.log(`⚠️  ${BOT_NAME}`);
console.log("🎤 Modo: APENAS TRANSCRIÇÃO DE ÁUDIOS");
console.log("❌ NÃO RESPONDE - Só transcreve e loga");
console.log("=".repeat(50) + "\n");

if (!AUDIO_ENABLED) {
  console.error("❌ Suporte a áudio NÃO está habilitado!");
  console.error("💡 Configure OPENAI_API_KEY no .env");
  process.exit(1);
}

// Gera QR Code para autenticação
client.on("qr", (qr) => {
  console.log("📱 Escaneie este QR Code com seu WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("🔓 Autenticação realizada com sucesso!");
});

client.on("auth_failure", (msg) => {
  console.error("❌ Falha na autenticação:", msg);
  console.log(
    "💡 Tente deletar a pasta .wwebjs_auth_transcricao-rodrigo e reconectar"
  );
});

client.on("ready", () => {
  console.log("\n" + "=".repeat(50));
  console.log("✅ Bot de Transcrição conectado!");
  console.log("🎤 Aguardando áudios para transcrever...");
  console.log("📊 Logs serão salvos em: logs/transcricoes.log");
  console.log("=".repeat(50) + "\n");
});

client.on("disconnected", (reason) => {
  console.log("⚠️  Bot desconectado:", reason);
  console.log("🔄 Tentando reconectar...");
});

// Processa APENAS áudios recebidos
client.on("message", async (msg) => {
  try {
    // Ignora grupos
    if (msg.from.includes("@g.us")) {
      return;
    }

    // Ignora status
    if (msg.from === "status@broadcast") {
      return;
    }

    // Ignora mensagens próprias
    if (msg.fromMe) {
      return;
    }

    // Só processa áudios (ptt = Push To Talk)
    if (msg.type !== "ptt" && msg.type !== "audio") {
      return;
    }

    const chatId = msg.from;
    const contact = await msg.getContact();
    const contactName = contact.pushname || contact.name || chatId;

    console.log("\n" + "=".repeat(50));
    console.log(`🎤 ÁUDIO RECEBIDO`);
    console.log(`👤 De: ${contactName}`);
    console.log(`📱 Número: ${chatId}`);
    console.log(`⏰ Horário: ${new Date().toLocaleString("pt-BR")}`);

    try {
      console.log("⏳ Baixando áudio...");
      const media = await msg.downloadMedia();

      if (!media) {
        console.log("❌ Não foi possível baixar o áudio");
        return;
      }

      // Salva áudio temporariamente
      const audioPath = path.join(
        __dirname,
        "..",
        "temp",
        `audio_${Date.now()}.ogg`
      );
      fs.writeFileSync(audioPath, media.data, "base64");
      console.log("✅ Áudio baixado!");

      // Transcreve
      console.log("🔄 Transcrevendo com OpenAI Whisper...");
      const transcription = await audioHandler.transcribeAudio(audioPath);

      if (transcription) {
        console.log("\n📝 TRANSCRIÇÃO:");
        console.log("─".repeat(50));
        console.log(transcription);
        console.log("─".repeat(50));

        // Salva em arquivo de log
        const logDir = path.join(__dirname, "..", "logs");
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }

        const logFile = path.join(logDir, "transcricoes.log");
        const logEntry = `
[${new Date().toISOString()}]
De: ${contactName} (${chatId})
Transcrição: ${transcription}
${"=".repeat(70)}

`;
        fs.appendFileSync(logFile, logEntry, "utf8");
        console.log("💾 Transcrição salva em: logs/transcricoes.log");
      } else {
        console.log("❌ Não foi possível transcrever o áudio");
      }

      // Remove arquivo temporário
      fs.unlinkSync(audioPath);
      console.log("🗑️  Arquivo temporário removido");
    } catch (error) {
      console.error("❌ Erro ao processar áudio:", error.message);
    }

    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error("❌ Erro geral:", error);
  }
});

// Tratamento de erros
process.on("unhandledRejection", (error) => {
  console.error("❌ Erro não tratado:", error);
});

process.on("SIGINT", () => {
  console.log("\n⚠️  Encerrando bot de transcrição...");
  client.destroy();
  process.exit(0);
});

// Inicializa o bot
console.log("🚀 Iniciando Bot de Transcrição...");
client.initialize();
