const axios = require("axios");
require("dotenv").config();

/**
 * Extrai texto de um buffer de mídia usando Arcee (primeiro) e OpenAI (fallback).
 * Retorna { success, provider, text, raw }
 */
async function extractTextFromMedia(buffer, mimeType = "image/jpeg") {
  const base64 = buffer.toString("base64");

  // Helper para resposta padrão
  const noneResult = {
    success: false,
    provider: "none",
    text: null,
    raw: null,
  };

  // Tenta Arcee.ai primeiro
  const arceeKey = process.env.ARCEE_API_KEY;
  const forceOpenAIFirst =
    (process.env.FORCE_OPENAI_OCR || "false").toLowerCase() === "true";

  if (forceOpenAIFirst) {
    console.log(
      "⚠️ FORCE_OPENAI_OCR=true -> Pulando Arcee e usando OpenAI como primário para OCR"
    );
  }

  if (arceeKey && !forceOpenAIFirst) {
    // tenta Arcee com retry simples
    let attempts = 0;
    const maxAttempts = 2;
    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log("📷 OCR: tentando Arcee.ai...");

        // NOTE: endpoint /v1/vision/ocr é um placeholder; ajuste se necessário
        const arceeUrl =
          process.env.ARCEE_VISION_URL || "https://api.arcee.ai/v1/vision/ocr";

        const resp = await axios.post(
          arceeUrl,
          {
            image_base64: base64,
            mime_type: mimeType,
          },
          {
            headers: {
              Authorization: `Bearer ${arceeKey}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            timeout: 30000,
          }
        );

        // Diagnose empty/invalid responses explicitly
        const bodyEmpty =
          resp &&
          (resp.data === null ||
            resp.data === undefined ||
            resp.data === "" ||
            (typeof resp.data === "object" &&
              Object.keys(resp.data).length === 0));
        if (resp && !bodyEmpty) {
          // Tenta extrair texto de campo comum
          const text =
            resp.data.text || resp.data.result || JSON.stringify(resp.data);
          console.log("📷 OCR: Arcee retornou resultado");
          return {
            success: true,
            provider: "arcee",
            text: String(text),
            raw: resp.data,
          };
        }

        // Caso o corpo seja vazio ou inválido, logar detalhes para diagnóstico e seguir para fallback
        console.warn("⚠️ OCR Arcee: resposta vazia ou inválida (body empty)");
        try {
          console.warn("⚠️ OCR Arcee: status=", resp.status);
          const headersSnippet = JSON.stringify(resp.headers || {}).slice(
            0,
            2000
          );
          console.warn("⚠️ OCR Arcee: headers:", headersSnippet);
          const bodySnippet = JSON.stringify(resp.data).slice(0, 2000);
          console.warn("⚠️ OCR Arcee: body snippet:", bodySnippet);
        } catch (e) {
          console.warn(
            "⚠️ OCR Arcee: falha ao serializar resposta para diagnóstico"
          );
        }
        break; // se deu certo, sai do loop
      } catch (error) {
        console.error(
          "❌ OCR Arcee falhou (tentativa",
          attempts,
          "):",
          error.message || error
        );
        if (error.response) {
          try {
            const snippet = JSON.stringify(error.response.data).slice(0, 2000);
            console.error("❌ OCR Arcee response snippet:", snippet);
          } catch (e) {
            console.error("❌ OCR Arcee response (non-json)");
          }
        }

        if (attempts < maxAttempts) {
          const backoff = attempts * 1000;
          console.log(`⏳ Retentando Arcee em ${backoff}ms...`);
          await new Promise((r) => setTimeout(r, backoff));
          continue;
        }
        // continua para fallback
      }
    }
  }

  // Fallback: OpenAI (se tiver chave)
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      console.log("📷 OCR: tentando OpenAI Vision fallback...");

      // NOTE: endpoint usado aqui é genérico e pode precisar de ajuste conforme sua integração OpenAI
      const openaiUrl =
        process.env.OPENAI_VISION_URL || "https://api.openai.com/v1/responses";

      // Monta um prompt simples pedindo para extrair texto da imagem (envia base64 como input)
      const payload = {
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: "Por favor, extraia todo o texto legível deste documento.",
              },
              {
                type: "input_image",
                image_base64: base64,
                mime_type: mimeType,
              },
            ],
          },
        ],
      };

      const resp = await axios.post(openaiUrl, payload, {
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });

      if (resp && resp.data) {
        const text =
          resp.data.output_text ||
          resp.data.output?.[0]?.content ||
          JSON.stringify(resp.data);
        console.log("📷 OCR: OpenAI retornou resultado");
        return {
          success: true,
          provider: "openai",
          text: String(text),
          raw: resp.data,
        };
      }
    } catch (error) {
      console.error("❌ OCR OpenAI falhou:", error.message || error);
      if (error.response) {
        try {
          const snippet = JSON.stringify(error.response.data).slice(0, 2000);
          console.error("❌ OCR OpenAI response snippet:", snippet);
        } catch (e) {
          console.error("❌ OCR OpenAI response (non-json)");
        }
      }
    }
  }

  return noneResult;
}

module.exports = {
  extractTextFromMedia,
};
