const {
  GREETING_MESSAGE,
  GREETING_MESSAGE_AD,
  GREETING_MESSAGE_GENERIC,
  RESPONSES,
} = require("./prompts");
const conversationMemory = require("./conversation-memory");

class MessageHandler {
  constructor(aiAgent) {
    this.aiAgent = aiAgent;
    this.conversations = new Map(); // Armazena conversas em memória RAM
  }

  /**
   * ========== VALIDAÇÃO DE HORÁRIOS DE AGENDAMENTO ==========
   * Detecta e valida se horário proposto está dentro do funcionamento
   * Funcionamento: Seg-Sex 9h-18h, Sábado 9h-12h
   */

  /**
   * Extrai horário da mensagem do cliente
   * Detecta: "às 14h", "3 da tarde", "15:30", "nas 18", etc
   * @param {string} message - Mensagem do cliente
   * @returns {Object} {hour, minute, found} ou {found: false}
   */
  parseTimeFromMessage(message) {
    const msg = message.toLowerCase().trim();

    // Padrão 1: "às 14h", "as 14h", "às 14", "às 2 da tarde"
    const pattern1 =
      /(?:às|as|na|no)\s*(?:(\d{1,2})\s*h|\s*(\d{1,2})\s+(?:da\s+(?:manhã|tarde|noite)))/i;
    let match = msg.match(pattern1);
    if (match && match[1]) {
      const hour = parseInt(match[1]);
      return { hour, minute: 0, found: true };
    }

    // Padrão 1B: "só posso as 15", "só posso 15", "das 15" (número solto após preposição)
    const pattern1b = /(?:às|as|das|dos)\s+(\d{1,2})(?:\s|$|h|:)/;
    match = msg.match(pattern1b);
    if (match) {
      const hour = parseInt(match[1]);
      return { hour, minute: 0, found: true };
    }

    // Padrão 2: "14h30", "14:30", "14h"
    const pattern2 = /(\d{1,2})[h:](\d{0,2})/;
    match = msg.match(pattern2);
    if (match) {
      const hour = parseInt(match[1]);
      const minute = match[2] ? parseInt(match[2]) : 0;
      return { hour, minute, found: true };
    }

    // Padrão 3: "3 da tarde" (14h), "8 da manhã", "9 da noite" (21h)
    const pattern3 = /(\d{1,2})\s+(?:da\s+(?:manhã|tarde|noite))/i;
    match = msg.match(pattern3);
    if (match) {
      let hour = parseInt(match[1]);
      if (msg.includes("tarde") && hour < 12) hour += 12;
      if (msg.includes("noite") && hour < 17) hour += 12;
      return { hour, minute: 0, found: true };
    }

    // Padrão 4: Número solto (ex: "15 no sábado", "13 de tarde")
    const pattern4 =
      /\b(\d{1,2})\b\s+(?:no|de|da|no\s+sábado|de\s+tarde|de\s+manhã)/;
    match = msg.match(pattern4);
    if (match) {
      let hour = parseInt(match[1]);
      // Se mensagem contém "tarde", assume que é tarde (add 12 se < 12)
      if (msg.includes("tarde") && hour < 12) hour += 12;
      return { hour, minute: 0, found: true };
    }

    return { found: false };
  }

  /**
   * Detecta qual dia cliente está mencionando
   * @param {string} message - Mensagem do cliente
   * @returns {Object} {day, dayName, isValid}
   */
  parseDayFromMessage(message) {
    const msg = message.toLowerCase().trim();
    const today = new Date();

    // Hoje, amanhã, etc
    if (msg.includes("hoje")) {
      const dayName = this.getDayName(today);
      return { day: today, dayName, isValid: true };
    }
    if (msg.includes("amanhã")) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayName = this.getDayName(tomorrow);
      return { day: tomorrow, dayName, isValid: true };
    }

    // Dias da semana (com e sem acento) - usar \b para evitar falsos positivos (ex: 'quais' -> 'qua')
    const days = [
      { normalized: "segunda", variants: ["segunda", "seg"] },
      { normalized: "terça", variants: ["terça", "terca", "ter"] },
      { normalized: "quarta", variants: ["quarta", "qua"] },
      { normalized: "quinta", variants: ["quinta", "qui"] },
      { normalized: "sexta", variants: ["sexta", "sex"] },
      { normalized: "sábado", variants: ["sábado", "sabado", "sab"] },
      { normalized: "domingo", variants: ["domingo", "dom"] },
    ];

    for (let i = 0; i < days.length; i++) {
      for (let variant of days[i].variants) {
        // cria regex que exige borda de palavra antes e depois do variant
        // também suporta variações com acento removido
        const v = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp("\\b" + v + "\\b", "i");
        if (re.test(msg)) {
          return {
            day: days[i].normalized,
            dayName: days[i].normalized,
            isValid: true,
          };
        }
      }
    }

    // Padrão adicional: "só posso de X", "só consigo X"
    const pattern = /(?:só|so)\s+(?:posso|consigo)\s+(?:de\s+)?(\w+)/;
    const match = msg.match(pattern);
    if (match) {
      const dayMatch = match[1].toLowerCase();
      // Verifica se o match contém algum dia da semana
      for (let i = 0; i < days.length; i++) {
        for (let variant of days[i].variants) {
          if (dayMatch.includes(variant)) {
            return {
              day: days[i].normalized,
              dayName: days[i].normalized,
              isValid: true,
            };
          }
        }
      }
    }

    return { isValid: false };
  }

  /**
   * Retorna nome do dia da semana
   * @param {Date} date
   * @returns {string}
   */
  getDayName(date) {
    const days = [
      "domingo",
      "segunda",
      "terça",
      "quarta",
      "quinta",
      "sexta",
      "sábado",
    ];
    return days[date.getDay()];
  }

  /**
   * Valida se horário está dentro do funcionamento
   * @param {string} dayName - Nome do dia (segunda, terça, etc)
   * @param {number} hour - Hora (0-23)
   * @returns {Object} {isValid, reason, alternatives}
   */
  isTimeValidForScheduling(dayName, hour) {
    const day = dayName.toLowerCase().trim();

    // Segunda a Sexta: 9h-18h
    if (["segunda", "terça", "quarta", "quinta", "sexta"].includes(day)) {
      if (hour >= 9 && hour <= 18) {
        return { isValid: true };
      }
      // Propôs fora do horário
      return {
        isValid: false,
        reason: "schedule_outside_business_hours_weekday",
        alternatives: [10, 12, 14, 16, 17],
      };
    }

    // Sábado: 9h-11h (até meio-dia, mas NÃO às 12h)
    if (day === "sábado" || day === "sabado") {
      if (hour >= 9 && hour < 12) {
        // 9h, 10h, 11h são válidos (NÃO 12h)
        return { isValid: true };
      }
      // Propôs sábado às 12h ou depois
      return {
        isValid: false,
        reason: "schedule_saturday_afternoon",
        alternatives: [9, 10, 11], // Opções válidas no sábado
      };
    }

    // Domingo não funciona
    if (day === "domingo") {
      return {
        isValid: false,
        reason: "schedule_sunday_closed",
        alternatives: [],
      };
    }

    return { isValid: false, reason: "unknown_day" };
  }

  /**
   * Inicializa uma nova conversa
   * @param {string} chatId - ID do chat
   */
  initConversation(chatId) {
    if (!this.conversations.has(chatId)) {
      this.conversations.set(chatId, {
        chatId, // Armazenar chatId para referência
        history: [],
        context: {
          stage: "greeting", // greeting -> qualifying -> collecting_docs -> ready / disqualified -> agendamento -> agendamento_confirmado
          name: null,
          workType: null, // 'clt' ou 'autonomous'
          income: null,
          age: null,
          documents: [],
          documentsAttempts: 0, // Contador de tentativas de coleta
          acceptedAnalysis: false,
          scheduleAttempts: 0, // Contador de tentativas de agendamento
          scheduledDay: null,
          scheduledHour: null,
          requiresManualHandling: false, // Flag para escalar para Ana
          startedAt: new Date(),
          lastMessageAt: new Date(),
        },
      });
      // Ao inicializar, carregar histórico do DB para manter contexto entre reinícios
      try {
        const recent = conversationMemory.getConversationHistory(chatId, 20); // já retorna em ordem cronológica
        if (recent && recent.length > 0) {
          const conv = this.conversations.get(chatId);
          recent.forEach((m) => {
            const role = m.is_from_bot ? "assistant" : "user";
            let content = "";
            if (
              m.message_type === "text" ||
              m.message_type === "audio_transcribed"
            ) {
              content = m.message_content;
            } else if (m.message_type === "audio" || m.message_type === "ptt") {
              content = `[Áudio] ${m.message_content}`;
            } else {
              content = `[${m.message_type}]`;
            }

            conv.history.push({ role, content });
          });
          // Ajusta estágio básico se houver histórico
          conv.context.stage = "qualifying";
          console.log(
            `📚 Histórico carregado para ${chatId} (${recent.length} mensagens)`
          );
        }
      } catch (err) {
        console.warn(
          "⚠️ Falha ao carregar histórico do DB na inicialização:",
          err.message || err
        );
      }
    }
  }

  /**
   * Processa mensagem recebida e retorna resposta
   * @param {string} chatId - ID do chat
   * @param {string} message - Mensagem do usuário
   * @param {string} context - Contexto anterior da conversa do BD
   * @param {boolean} isFromAd - Se é mensagem do anúncio do Facebook
   * @returns {Promise<Object>} { reply, shouldNotifyOwner, reason }
   */
  async handleMessage(chatId, message, context = "", isFromAd = false) {
    this.initConversation(chatId);

    const conversation = this.conversations.get(chatId);
    conversation.context.lastMessageAt = new Date();

    // Atualiza histórico
    conversation.history.push({
      role: "user",
      content: message,
    });

    // Extrai informações da mensagem
    conversation.context = this.aiAgent.extractInfo(
      message,
      conversation.context
    );

    // ========== DETECÇÃO DE AGENDAMENTO ==========
    // Se cliente menciona "agendar", "marcar", "visita", "ir aí", etc
    // Pula qualificação e vai direto para agendamento
    const palavrasAgendamento = [
      "agendar",
      "marcar",
      "visita",
      "ir aí",
      "ir ai",
      "passar aí",
      "passar ai",
      "presencial",
      "presencialmente",
      "qual dia",
      "qual hora",
      "qual horário",
      "qual horario",
      "qual o melhor",
      "quando vocês",
      "que horário",
      "que horario",
      "atendimento presencial",
    ];

    const mensagemLower = message.toLowerCase().trim();
    const querAgendarVisita = palavrasAgendamento.some((palavra) =>
      mensagemLower.includes(palavra)
    );

    if (querAgendarVisita && conversation.context.stage !== "agendamento") {
      console.log("🎯 Cliente mencionou agendamento - pulando qualificação!");
      conversation.context.stage = "agendamento";

      // Verifica se cliente JÁ mencionou o dia na mesma mensagem
      const dayInfo = this.parseDayFromMessage(message);

      let respostaAgendamento;
      if (dayInfo.isValid && dayInfo.dayName) {
        // Cliente já disse o dia! Salva e pergunta SÓ o horário
        conversation.context.scheduledDay = dayInfo.dayName;
        // Se parseDayFromMessage retornou um objeto Date (ex: 'hoje' ou 'amanhã'), armazena o timestamp
        if (dayInfo.day && dayInfo.day instanceof Date) {
          conversation.context.scheduledDate = dayInfo.day.getTime(); // ms since epoch
        } else {
          // limpa qualquer scheduledDate anterior quando só temos nome do dia
          conversation.context.scheduledDate = null;
        }

        console.log(`📅 Cliente já mencionou dia: ${dayInfo.dayName}`);

        // Perguntas específicas por dia
        if (dayInfo.dayName === "sábado" || dayInfo.dayName === "sabado") {
          respostaAgendamento = `Ótimo! Sábado funciona sim. 😊\n\nQue horário seria melhor pra você? Lembrando que sábado atendemos até meio-dia (9h às 12h).`;
        } else if (dayInfo.dayName === "domingo") {
          respostaAgendamento = `Infelizmente domingo não funcionamos. 😅\n\nMas temos disponibilidade segunda a sexta (9h-18h) ou sábado de manhã (até 12h). Qual seria melhor?`;
        } else {
          // Segunda a sexta
          respostaAgendamento = `Perfeito! ${
            dayInfo.dayName.charAt(0).toUpperCase() + dayInfo.dayName.slice(1)
          } funciona sim. 😊\n\nQue horário seria melhor pra você? Atendemos de 9h às 18h.`;
        }
      } else {
        // Cliente NÃO disse o dia, pergunta dia E horário
        const variants = RESPONSES.AGENDAMENTO_PERGUNTA_HORARIO_VARIANTS || [
          RESPONSES.AGENDAMENTO_PERGUNTA_HORARIO,
        ];
        respostaAgendamento =
          variants[Math.floor(Math.random() * variants.length)];
      }

      conversation.history.push({
        role: "assistant",
        content: respostaAgendamento,
      });

      return {
        reply: respostaAgendamento,
        shouldNotifyOwner: false,
      };
    }

    // ========== VALIDAÇÃO DE HORÁRIO DE AGENDAMENTO ==========
    // Se cliente está na stage "agendamento" OU "waiting_for_ana" OU "agendamento_confirmado" respondendo com horário/dia
    // (waiting_for_ana = já tentou horário inválido 1x, pode tentar de novo)
    // (agendamento_confirmado = já confirmou mas tenta remendar o horário)
    if (
      conversation.context.stage === "agendamento" ||
      conversation.context.stage === "waiting_for_ana" ||
      conversation.context.stage === "agendamento_confirmado"
    ) {
      const timeInfo = this.parseTimeFromMessage(message);
      const dayInfo = this.parseDayFromMessage(message);

      // Se detectou dia e/ou hora na mensagem
      if (timeInfo.found || dayInfo.isValid) {
        // Se cliente não mencionou dia de novo, usa o dia que já estava salvo
        let dayName =
          dayInfo.dayName ||
          conversation.context.scheduledDay ||
          "não especificado";
        let hour = timeInfo.hour;

        // Se estava em agendamento_confirmado e está tentando remendar, reseta contador
        if (conversation.context.stage === "agendamento_confirmado") {
          conversation.context.scheduleAttempts = 0; // Novo ciclo de tentativas
          console.log(
            `🔄 Cliente tentando remendar agendamento (era ${conversation.context.scheduledDay} às ${conversation.context.scheduledHour}h). Resetando contador.`
          );
        }

        // Se detectou horário, valida contra schedule
        if (timeInfo.found && hour) {
          // Se o dia não foi especificado e não temos um dia salvo, peça clarificação
          // Resolve nome do dia para validação: se tivermos scheduledDate, usa o nome daquele date (ex: amanhã -> sábado)
          let resolvedDate =
            dayInfo.day instanceof Date
              ? dayInfo.day
              : conversation.context.scheduledDate
              ? new Date(conversation.context.scheduledDate)
              : null;
          let dayNameForValidation = resolvedDate
            ? this.getDayName(resolvedDate)
            : dayName || "não especificado";

          if (!dayName || dayName === "não especificado") {
            const askDay = `Você quis dizer *hoje*, *amanhã* ou outro dia específico para esse horário (${hour}h)? \n\nPor favor, me diga qual dia você prefere para eu confirmar.`;

            conversation.history.push({ role: "assistant", content: askDay });

            return {
              reply: askDay,
              shouldNotifyOwner: false,
            };
          }

          const validation = this.isTimeValidForScheduling(
            dayNameForValidation,
            hour
          );

          if (!validation.isValid) {
            // Horário inválido!
            conversation.context.scheduleAttempts =
              (conversation.context.scheduleAttempts || 0) + 1;

            let rejectResponse = "";

            if (validation.reason === "schedule_saturday_afternoon") {
              // Sábado depois de 12h
              rejectResponse = `Sábado só atendemos de manhã, das 9h às 11h. 😅\n\nÀ tarde não temos disponibilidade. Você poderia vir pela manhã ou prefere um dia de semana (segunda a sexta, 9h-18h)?\n\nQual seria melhor pra você?`;
            } else if (
              validation.reason === "schedule_outside_business_hours_weekday"
            ) {
              // Dia da semana fora do horário (ex: 8am ou 19h)
              rejectResponse = `A gente abre às 9h e fecha às 18h. Você teria disponibilidade para esse horário?\n\nVocê poderia vir ${dayName} em um horário entre 9h e 18h?`;
            } else if (validation.reason === "schedule_sunday_closed") {
              // Domingo
              rejectResponse = `Infelizmente domingo não funcionamos. 😅\n\nMas temos disponibilidade segunda a sexta (9h-18h) ou sábado de manhã (até 12h). Qual seria melhor?`;
            } else {
              // Fallback: horário inválido mas reason desconhecido
              rejectResponse = `Esse horário não funciona pra gente. 😅\n\nAtendemos segunda a sexta (9h-18h) e sábado de manhã (até 12h). Que tal algum desses horários?`;
            }

            conversation.history.push({
              role: "assistant",
              content: rejectResponse,
            });

            // Lógica de escalação:
            // 1ª tentativa inválida: Muda para "waiting_for_ana" e oferece alternativas (acima)
            // 2ª tentativa inválida: AGORA escalona para Ana
            if (conversation.context.scheduleAttempts >= 2) {
              console.log(
                `⚠️  Cliente ${conversation.chatId} insistiu ${conversation.context.scheduleAttempts}x em horário inválido. Escalando para Ana.`
              );
              conversation.context.requiresManualHandling = true;
              conversation.context.stage = "waiting_for_ana";

              const result = {
                reply: rejectResponse,
                shouldNotifyOwner: true, // AGORA notifica Ana na 2ª tentativa
                reason: `⚠️  *ESCALAÇÃO DE AGENDAMENTO*\n\nCliente insistiu ${conversation.context.scheduleAttempts}x em horário fora do funcionamento\n\nÚltimo horário proposto: ${dayNameForValidation} às ${hour}h`,
                contactInfo: this.getContactSummary(conversation.chatId),
              };

              return result;
            } else {
              // 1ª tentativa: Apenas rejeita e aguarda nova resposta
              conversation.context.stage = "waiting_for_ana";

              return {
                reply: rejectResponse,
                shouldNotifyOwner: false, // NÃO notifica Ana na 1ª tentativa
              };
            }
          }

          // Horário é VÁLIDO! Confirmar agendamento
          conversation.context.stage = "agendamento_confirmado";
          conversation.context.scheduledDay = dayNameForValidation;
          conversation.context.scheduledHour = hour;
          conversation.context.scheduledMinute = timeInfo.minute || 0;

          // Se não tivermos scheduledDate salvo, e dayInfo contiver um Date, já armazenamos acima.
          // Caso contrário, tentamos inferir uma scheduledDate próxima (opcional) - mantemos null para evitar assumir semana errada.

          // Formata horário com minutos se tiver (ex: "9h30" ou "9h")
          console.log(
            `⏰ DEBUG: hour=${hour}, minute=${timeInfo.minute}, minute>0=${
              timeInfo.minute > 0
            }`
          );
          const timeString =
            timeInfo.minute && timeInfo.minute > 0
              ? `${hour}h${String(timeInfo.minute).padStart(2, "0")}`
              : `${hour}h`;

          const confirmResponse = `Perfeito! 🎉\n\nAnotado aqui: ${dayNameForValidation} às ${timeString}\n\nSe conseguir, leva seus documentos pessoais (RG e CPF) - facilita bastante! 📄\n\nAté lá! 😊`;

          conversation.history.push({
            role: "assistant",
            content: confirmResponse,
          });

          return {
            reply: confirmResponse,
            shouldNotifyOwner: true, // Notifica Ana sobre agendamento confirmado
            reason: `📅 *VISITA AGENDADA!*\n\nCliente marcou para: ${dayName} às ${timeString}`,
            contactInfo: this.getContactSummary(conversation.chatId),
          };
        }
      }
    }

    // Se TEM histórico no banco, muda stage de greeting para qualifying
    // (evita enviar saudação em conversas que já começaram)
    const hasHistory =
      context !== "Este é o primeiro contato com este cliente.";
    const isFirstInteraction = conversation.history.length === 1 && !hasHistory;

    // SÓ pula saudação se realmente tem histórico E não é primeira interação
    if (
      hasHistory &&
      !isFirstInteraction &&
      conversation.context.stage === "greeting"
    ) {
      conversation.context.stage = "qualifying";
      console.log("📚 Cliente com histórico - pulando saudação");
    }

    // Verifica se é primeira mensagem (e se NÃO tem histórico no banco)
    const isFirstMessage =
      context === "Este é o primeiro contato com este cliente.";

    if (
      conversation.context.stage === "greeting" &&
      conversation.history.length === 1 &&
      isFirstMessage
    ) {
      // Variações de saudação (escolhida aleatoriamente)
      let greeting;

      if (isFromAd) {
        const greetingsAd = [
          `Olá, tudo bem? 😊\n\nVocê clicou em nosso anúncio para saber mais informações sobre o financiamento de imóveis, correto?\n\nMe chamo Ana Cláudia, sou da Novo Lar Negócios Imobiliários e farei seu atendimento. Qual seu nome?`,

          `Oi! Tudo bem? 😊\n\nVi que você clicou no nosso anúncio sobre financiamento de imóveis. Que bom ter você aqui!\n\nSou a Ana Cláudia, da Novo Lar Negócios Imobiliários. Como posso te chamar?`,

          `Olá! 😊\n\nVocê se interessou pelo nosso anúncio de financiamento de imóveis, certo?\n\nPrazer, sou Ana Cláudia da Novo Lar Negócios Imobiliários! Qual é o seu nome?`,

          `Oi, seja bem-vindo(a)! 😊\n\nVocê clicou no nosso anúncio sobre financiamento imobiliário. Vou te ajudar!\n\nMe chamo Ana Cláudia, sou da Novo Lar Negócios Imobiliários. E você, como se chama?`,
        ];
        greeting = greetingsAd[Math.floor(Math.random() * greetingsAd.length)];
      } else {
        const greetingsGeneric = [
          `Olá, tudo bem? 😊\n\nMe chamo Ana Cláudia, sou da Novo Lar Negócios Imobiliários! Trabalho com financiamento de imóveis.\n\nComo posso te ajudar?\n\nQual seu nome?`,

          `Oi! Tudo bem? 😊\n\nSou a Ana Cláudia, da Novo Lar Negócios Imobiliários. Ajudo pessoas a realizarem o sonho do imóvel próprio!\n\nComo posso te chamar?`,

          `Olá! 😊\n\nPrazer, sou Ana Cláudia da Novo Lar Negócios Imobiliários. Trabalho com financiamento imobiliário e adoraria ajudar você!\n\nQual é o seu nome?`,

          `Oi, seja bem-vindo(a)! 😊\n\nMe chamo Ana Cláudia. Na Novo Lar Negócios Imobiliários, ajudamos pessoas a conseguir o imóvel que sonham.\n\nComo se chama?`,

          `Olá, tudo certo? 😊\n\nSou Ana Cláudia, consultora de imóveis na Novo Lar Negócios Imobiliários. Vamos conversar sobre como te ajudar?\n\nQual seu nome?`,
        ];
        greeting =
          greetingsGeneric[Math.floor(Math.random() * greetingsGeneric.length)];
      }

      conversation.history.push({
        role: "assistant",
        content: greeting,
      });

      conversation.context.stage = "qualifying";

      return {
        reply: greeting,
        shouldNotifyOwner: false,
      };
    }

    // Detecta intenção de fazer análise de crédito
    if (this.aiAgent.detectsCreditAnalysisIntent(message)) {
      conversation.context.acceptedAnalysis = true;
      conversation.context.stage = "collecting_docs";

      // Determina qual pedido de documentos usar
      let docsRequest;
      if (conversation.context.workType === "autonomous") {
        docsRequest = RESPONSES.DOCUMENTS_REQUEST_AUTONOMOUS;
      } else if (conversation.context.workType === "SERVIDOR_PUBLICO") {
        docsRequest = RESPONSES.DOCUMENTS_REQUEST_SERVIDOR;
      } else {
        docsRequest = RESPONSES.DOCUMENTS_REQUEST_CLT;
      }

      conversation.history.push({
        role: "assistant",
        content: `${RESPONSES.CREDIT_ANALYSIS_ACCEPTED}\n\n${docsRequest}`,
      });

      return {
        reply: `${RESPONSES.CREDIT_ANALYSIS_ACCEPTED}\n\n${docsRequest}`,
        shouldNotifyOwner: false, // Só notifica quando tiver docs ou dificuldade
      };
    }

    // Verifica desqualificação
    // Se detectamos renda como LÍQUIDA e não foi confirmada, peça confirmação da renda BRUTA
    if (
      conversation.context.income_is_net &&
      !conversation.context.income_confirmed
    ) {
      const askBruta = `Obrigado! Só pra confirmar: esse valor que você informou é a *renda líquida* (após descontos)? Para fazermos a análise, preciso da *renda BRUTA* (antes de descontos). Você consegue me informar o valor BRUTO por favor?`;
      conversation.history.push({ role: "assistant", content: askBruta });
      return { reply: askBruta, shouldNotifyOwner: false };
    }

    const disqualification = this.checkDisqualification(conversation.context);
    if (disqualification) {
      conversation.history.push({
        role: "assistant",
        content: disqualification,
      });

      conversation.context.stage = "disqualified";

      return {
        reply: disqualification,
        shouldNotifyOwner: false,
      };
    }

    // Se está coletando documentos e não recebeu, incrementa tentativas
    if (
      conversation.context.stage === "collecting_docs" &&
      conversation.context.acceptedAnalysis
    ) {
      conversation.context.documentsAttempts++;

      // Se já tentou 3 vezes sem sucesso, notifica Ana para assumir
      if (conversation.context.documentsAttempts >= 3) {
        conversation.history.push({
          role: "assistant",
          content: RESPONSES.DOCUMENTS_DIFFICULTY,
        });

        return {
          reply: RESPONSES.DOCUMENTS_DIFFICULTY,
          shouldNotifyOwner: true,
          reason:
            "⚠️ Cliente aceitou análise mas está com DIFICULDADE para enviar documentos!",
          contactInfo: this.getContactSummary(chatId),
        };
      }

      // Oferece ajuda se cliente mencionar dificuldade
      if (this.detectsDifficulty(message)) {
        conversation.history.push({
          role: "assistant",
          content: RESPONSES.DOCUMENTS_HELP,
        });

        return {
          reply: RESPONSES.DOCUMENTS_HELP,
          shouldNotifyOwner: false,
        };
      }
    }

    // Gera resposta com IA
    // Combina histórico do BD (context) com histórico em RAM para melhor contexto
    const fullContext = context ? `${context}\n\n` : "";
    const aiReply = await this.aiAgent.getResponse(
      conversation.history.slice(-10), // Últimas 10 mensagens para contexto
      conversation.context,
      fullContext // Contexto anterior do BD
    );

    conversation.history.push({
      role: "assistant",
      content: aiReply,
    });

    return {
      reply: aiReply,
      shouldNotifyOwner: false,
    };
  }

  /**
   * Verifica se o lead deve ser desqualificado
   * @param {Object} context - Contexto do usuário
   * @returns {string|null} Mensagem de desqualificação ou null
   */
  checkDisqualification(context) {
    // Verifica renda (abaixo de R$ 2.000)
    // Só considera renda para desqualificação se a renda BRUTA foi confirmada ou se não foi marcada como líquida
    const considerIncome =
      context.income &&
      (context.income_confirmed === true || !context.income_is_net);
    if (considerIncome && context.income < 2000) {
      return RESPONSES.DISQUALIFIED_LOW_INCOME;
    }

    // Verifica idade (acima de 60 anos)
    if (context.age && context.age > 60) {
      return RESPONSES.DISQUALIFIED_AGE;
    }

    return null;
  }

  /**
   * Detecta se cliente está com dificuldade para enviar documentos
   * @param {string} message - Mensagem do cliente
   * @returns {boolean}
   */
  detectsDifficulty(message) {
    const lowerMessage = message.toLowerCase();
    const difficultyKeywords = [
      "não sei",
      "não consigo",
      "não tá",
      "não está",
      "dificuldade",
      "problema",
      "erro",
      "não funciona",
      "como faz",
      "como envia",
      "não entendi",
    ];

    return difficultyKeywords.some((keyword) => lowerMessage.includes(keyword));
  }

  /**
   * Retorna resumo do contato para notificar o dono
   * @param {string} chatId - ID do chat
   * @returns {Object}
   */
  getContactSummary(chatId) {
    const conversation = this.conversations.get(chatId);
    if (!conversation) return null;

    const { context } = conversation;

    return {
      chatId,
      name: context.name || "Não informado",
      workType: context.workType || "Não informado",
      income: context.income ? `R$ ${context.income}` : "Não informado",
      age: context.age ? `${context.age} anos` : "Não informado",
      stage: context.stage,
      startedAt: context.startedAt,
      messagesCount: conversation.history.length,
    };
  }

  /**
   * Retorna todas as conversas ativas
   * @returns {Array}
   */
  getActiveConversations() {
    const active = [];

    for (const [chatId, conversation] of this.conversations.entries()) {
      if (conversation.context.stage !== "disqualified") {
        active.push({
          chatId,
          ...this.getContactSummary(chatId),
        });
      }
    }

    return active;
  }

  /**
   * Limpa conversas antigas (mais de 7 dias)
   */
  cleanOldConversations() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    for (const [chatId, conversation] of this.conversations.entries()) {
      if (conversation.context.lastMessageAt < sevenDaysAgo) {
        this.conversations.delete(chatId);
        console.log(
          `🧹 Conversa ${chatId} removida (inativa há mais de 7 dias)`
        );
      }
    }
  }
}

module.exports = MessageHandler;
