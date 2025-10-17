const axios = require("axios");
require("dotenv").config();

const { SYSTEM_PROMPT } = require("./prompts");

class ArceeAIAgent {
  constructor() {
    this.arceeApiKey = process.env.ARCEE_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.arceeApiUrl = "https://api.arcee.ai/v1/chat/completions";
    this.openaiApiUrl = "https://api.openai.com/v1/chat/completions";

    if (!this.arceeApiKey) {
      console.warn("⚠️  ARCEE_API_KEY não encontrada - usando apenas OpenAI");
    }

    if (!this.openaiApiKey) {
      console.warn(
        "⚠️  OPENAI_API_KEY não encontrada - usando apenas Arcee.ai"
      );
    }

    if (!this.arceeApiKey && !this.openaiApiKey) {
      throw new Error(
        "⚠️  Nenhuma API Key configurada! Configure ARCEE_API_KEY ou OPENAI_API_KEY"
      );
    }
  }

  /**
   * Envia mensagem para o agente de IA e recebe resposta
   * Tenta Arcee.ai primeiro, se falhar usa OpenAI como fallback
   * @param {Array} conversationHistory - Histórico da conversa
   * @param {Object} userContext - Contexto do usuário (nome, renda, etc)
   * @param {string} dbContext - Contexto anterior da conversa do BD
   * @returns {Promise<string>} Resposta da IA
   */
  async getResponse(conversationHistory, userContext = {}, dbContext = "") {
    // Tenta Arcee.ai primeiro
    if (this.arceeApiKey) {
      try {
        console.log("🔄 Tentando Arcee.ai...");
        const response = await this.callArceeAI(
          conversationHistory,
          userContext,
          dbContext
        );
        console.log("✅ Arcee.ai respondeu com sucesso!");
        return response;
      } catch (error) {
        console.error("❌ Arcee.ai falhou:", error.message);

        // Se OpenAI está disponível, tenta como fallback
        if (this.openaiApiKey) {
          console.log("🔄 Tentando OpenAI como fallback...");
          try {
            const response = await this.callOpenAI(
              conversationHistory,
              userContext,
              dbContext
            );
            console.log("✅ OpenAI respondeu com sucesso!");
            return response;
          } catch (openaiError) {
            console.error("❌ OpenAI também falhou:", openaiError.message);
            return "Desculpe, estou com um probleminha técnico agora. Pode aguardar um momento? Em breve vou conseguir te responder! 😊";
          }
        } else {
          // Sem OpenAI disponível, retorna fallback
          return "Desculpe, estou com um probleminha técnico agora. Pode aguardar um momento? Em breve vou conseguir te responder! 😊";
        }
      }
    }

    // Se não tem Arcee.ai, usa OpenAI diretamente
    if (this.openaiApiKey) {
      try {
        console.log("🔄 Usando OpenAI...");
        const response = await this.callOpenAI(
          conversationHistory,
          userContext,
          dbContext
        );
        console.log("✅ OpenAI respondeu com sucesso!");
        return response;
      } catch (error) {
        console.error("❌ OpenAI falhou:", error.message);
        return "Desculpe, estou com um probleminha técnico agora. Pode aguardar um momento? Em breve vou conseguir te responder! 😊";
      }
    }

    // Nenhuma API disponível
    return "Desculpe, estou com um probleminha técnico agora. Pode aguardar um momento? Em breve vou conseguir te responder! 😊";
  }

  /**
   * Chama a API Arcee.ai
   */
  async callArceeAI(conversationHistory, userContext = {}, dbContext = "") {
    try {
      // Monta o contexto adicional baseado no que sabemos do usuário
      let contextPrompt = SYSTEM_PROMPT;

      // Adiciona contexto do histórico do BD se disponível
      if (dbContext) {
        contextPrompt += `\n\nHISTÓRICO ANTERIOR DA CONVERSA:\n${dbContext}`;
      }

      if (userContext.name) {
        contextPrompt += `\n\nNOME DO CLIENTE: ${userContext.name}`;
      }
      if (userContext.workType) {
        contextPrompt += `\nTIPO DE TRABALHO: ${userContext.workType}`;
      }
      if (userContext.income) {
        contextPrompt += `\nRENDA: R$ ${userContext.income}`;
      }
      if (userContext.age) {
        contextPrompt += `\nIDADE: ${userContext.age} anos`;
      }
      if (userContext.stage) {
        contextPrompt += `\nETAPA ATUAL: ${userContext.stage}`;
      }

      const messages = [
        { role: "system", content: contextPrompt },
        ...conversationHistory,
      ];

      const response = await axios.post(
        this.arceeApiUrl,
        {
          model: "arcee-agent",
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${this.arceeApiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 segundos
        }
      );

      // Verifica se veio conteúdo válido
      const bodyEmpty =
        response &&
        (response.data === null ||
          response.data === undefined ||
          response.data === "" ||
          (typeof response.data === "object" &&
            Object.keys(response.data).length === 0));
      if (bodyEmpty) {
        console.warn("⚠️ Arcee.ai retornou body vazio ou inválido");
        try {
          console.warn("⚠️ Arcee status:", response.status);
          console.warn(
            "⚠️ Arcee headers:",
            JSON.stringify(response.headers || {}).slice(0, 2000)
          );
          console.warn(
            "⚠️ Arcee body snippet:",
            JSON.stringify(response.data).slice(0, 2000)
          );
        } catch (e) {
          console.warn("⚠️ Erro ao serializar resposta da Arcee");
        }
        throw new Error("Resposta inválida da API Arcee.ai (body vazio)");
      }

      if (
        response.data &&
        response.data.choices &&
        response.data.choices.length > 0
      ) {
        return response.data.choices[0].message.content.trim();
      }

      throw new Error("Resposta inválida da API Arcee.ai");
    } catch (error) {
      if (error.response) {
        console.error("📊 Arcee Status:", error.response.status);
        console.error(
          "📝 Arcee Dados:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
      throw error;
    }
  }

  /**
   * Chama a API OpenAI como fallback
   */
  async callOpenAI(conversationHistory, userContext = {}, dbContext = "") {
    try {
      // Monta o contexto adicional baseado no que sabemos do usuário
      let contextPrompt = SYSTEM_PROMPT;

      // Adiciona contexto do histórico do BD se disponível
      if (dbContext) {
        contextPrompt += `\n\nHISTÓRICO ANTERIOR DA CONVERSA:\n${dbContext}`;
      }

      if (userContext.name) {
        contextPrompt += `\n\nNOME DO CLIENTE: ${userContext.name}`;
      }
      if (userContext.workType) {
        contextPrompt += `\nTIPO DE TRABALHO: ${userContext.workType}`;
      }
      if (userContext.income) {
        contextPrompt += `\nRENDA: R$ ${userContext.income}`;
      }
      if (userContext.age) {
        contextPrompt += `\nIDADE: ${userContext.age} anos`;
      }
      if (userContext.stage) {
        contextPrompt += `\nETAPA ATUAL: ${userContext.stage}`;
      }

      const messages = [
        { role: "system", content: contextPrompt },
        ...conversationHistory,
      ];

      const response = await axios.post(
        this.openaiApiUrl,
        {
          model: "gpt-4o-mini", // Modelo mais barato e rápido
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 segundos
        }
      );

      if (
        response.data &&
        response.data.choices &&
        response.data.choices.length > 0
      ) {
        return response.data.choices[0].message.content.trim();
      }

      throw new Error("Resposta inválida da API OpenAI");
    } catch (error) {
      if (error.response) {
        console.error("📊 OpenAI Status:", error.response.status);
        console.error(
          "📝 OpenAI Dados:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
      throw error;
    }
  }

  /**
   * Verifica se a mensagem indica interesse em fazer análise de crédito
   * @param {string} message - Mensagem do usuário
   * @returns {boolean}
   */
  detectsCreditAnalysisIntent(message) {
    const keywords = [
      "quero fazer análise",
      "fazer análise",
      "aceito",
      "vamos fazer",
      "pode fazer",
      "quero sim",
      "sim, quero",
      "bora",
      "vamo",
      "quero saber o valor",
    ];

    const messageLower = message.toLowerCase();
    return keywords.some((keyword) => messageLower.includes(keyword));
  }

  /**
   * Extrai informações estruturadas da conversa
   * @param {string} message - Mensagem do usuário
   * @param {Object} currentContext - Contexto atual
   * @returns {Object} Contexto atualizado
   */
  extractInfo(message, currentContext = {}) {
    const messageLower = message.toLowerCase();
    const newContext = { ...currentContext };

    // Detecta tipo de trabalho
    if (
      messageLower.includes("carteira assinada") ||
      messageLower.includes("clt") ||
      messageLower.includes("registrado")
    ) {
      newContext.workType = "CLT";
    } else {
      // Detecta servidor público com várias variantes (concursado, prefeitura, governo, municipal, estadual, federal)
      const servidorRegex =
        /(servidor\s*p[uú]blico|servidor|concursad[oa]|prefeitura|munic[ip]al|estadual|federal|governo|concursado)/i;
      if (servidorRegex.test(messageLower)) {
        newContext.workType = "SERVIDOR_PUBLICO";
      } else if (
        messageLower.includes("autônomo") ||
        messageLower.includes("autonomo") ||
        messageLower.includes("por conta")
      ) {
        newContext.workType = "AUTONOMO";
      }
    }

    // Detecta valores de renda (ex: "2000", "R$ 2.000", "dois mil")
    const rendaMatch = message.match(/(?:r\$?\s*)?(\d+\.?\d*)/i);
    if (rendaMatch && !currentContext.income) {
      const valor = parseFloat(
        rendaMatch[1].replace(".", "").replace(",", ".")
      );
      if (valor > 100 && valor < 100000) {
        // Validação básica
        // Detecta se o usuário mencionou que o valor é LÍQUIDA (net)
        const mentionsNet =
          /liquida|líquida|liquido|líquido|neto|líquido/i.test(messageLower);
        if (mentionsNet) {
          // Marca que a renda informada é líquida e que precisamos confirmar a BRUTA
          newContext.income = valor;
          newContext.income_is_net = true;
          newContext.income_confirmed = false; // aguardando confirmação do bruto
        } else {
          newContext.income = valor;
          newContext.income_is_net = false;
          newContext.income_confirmed = true; // já temos a renda (assumida bruta)
        }
      }
    }

    // Detecta idade
    const idadeMatch = message.match(/(\d{2})\s*anos?/i);
    if (idadeMatch) {
      newContext.age = parseInt(idadeMatch[1]);
    }

    return newContext;
  }
}

module.exports = ArceeAIAgent;
