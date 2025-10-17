// Módulo para transcrição de áudios do WhatsApp usando OpenAI Whisper
// Ativado automaticamente quando OPENAI_API_KEY estiver no .env

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
require("dotenv").config();

/**
 * Verifica se o suporte a áudio está habilitado
 * @returns {boolean}
 */
function isAudioEnabled() {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Transcreve áudio usando OpenAI Whisper API
 *
 * Custo: ~$0.006 por minuto de áudio
 *
 * @param {string} audioPath - Caminho do arquivo de áudio
 * @returns {Promise<string>} Texto transcrito
 */
async function transcribeAudio(audioPath) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY não configurada no .env");
    }

    console.log(`🎤 Transcrevendo áudio: ${path.basename(audioPath)}`);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(audioPath));
    formData.append("model", "whisper-1");
    formData.append("language", "pt"); // Português do Brasil
    formData.append("response_format", "json");

    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        timeout: 30000, // 30 segundos
      }
    );

    const transcription = response.data.text.trim();
    console.log(`✅ Áudio transcrito: "${transcription.substring(0, 100)}..."`);

    return transcription;
  } catch (error) {
    console.error("❌ Erro ao transcrever áudio:", error.message);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Dados:", error.response.data);
    }

    throw error;
  }
}

/**
 * Processa áudio do WhatsApp e retorna transcrição
 *
 * @param {Message} msg - Mensagem do WhatsApp
 * @returns {Promise<string>} Texto transcrito
 */
async function processWhatsAppAudio(msg) {
  let tempPath = null;

  try {
    console.log("🎤 Processando áudio do WhatsApp...");

    // 1. Baixa o áudio do WhatsApp
    const media = await msg.downloadMedia();

    if (!media) {
      throw new Error("Não foi possível baixar o áudio");
    }

    // 2. Salva temporariamente
    // Cria pasta temp se não existir
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    tempPath = path.join(tempDir, `audio_${Date.now()}.ogg`);
    fs.writeFileSync(tempPath, media.data, { encoding: "base64" });

    console.log(`📁 Áudio salvo temporariamente: ${tempPath}`);

    // 3. Transcreve usando OpenAI Whisper
    const transcription = await transcribeAudio(tempPath);

    // 4. Remove arquivo temporário
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
      console.log("🗑️  Arquivo temporário removido");
    }

    return transcription;
  } catch (error) {
    console.error("❌ Erro ao processar áudio WhatsApp:", error.message);

    // Garante que remove arquivo temp mesmo em caso de erro
    if (tempPath && fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.error("⚠️  Erro ao limpar arquivo temp:", cleanupError.message);
      }
    }

    throw error;
  }
}

module.exports = {
  isAudioEnabled,
  transcribeAudio,
  processWhatsAppAudio,
};

// ============================================
// COMO USAR NO BOT.JS:
// ============================================
/*

const audioHandler = require('./audio-handler');

client.on('message', async (msg) => {
  // ... código existente ...

  // Se for áudio
  if (msg.type === 'ptt' || msg.type === 'audio') {
    console.log('🎤 Áudio recebido, transcrevendo...');
    
    try {
      // Transcreve o áudio
      const transcription = await audioHandler.processWhatsAppAudio(msg);
      
      // Processa como se fosse texto normal
      const response = await messageHandler.handleMessage(chatId, transcription);
      await msg.reply(response.reply);
      
      if (response.shouldNotifyOwner) {
        await notifyAna(response.reason, response.contactInfo, chatId);
      }
      
    } catch (error) {
      await msg.reply('Desculpe, não consegui entender seu áudio. Pode digitar sua mensagem? 😊');
    }
    
    return;
  }

  // ... resto do código ...
});

*/

// ============================================
// ADICIONAR NO .env:
// ============================================
/*

# OpenAI API Key (para transcrição de áudios)
OPENAI_API_KEY=sua_openai_api_key_aqui

*/

// ============================================
// ADICIONAR NO package.json:
// ============================================
/*

"dependencies": {
  ...
  "form-data": "^4.0.0"
}

*/
