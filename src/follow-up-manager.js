// Sistema de Follow-up Automático
// Verifica pendências e envia lembretes às 19h

const Database = require("better-sqlite3");
const path = require("path");
const { CronJob } = require("cron");

// Conecta ao banco de dados
const dbPath = path.join(__dirname, "..", "data", "conversations.db");
const db = new Database(dbPath);

/**
 * Detecta se o cliente prometeu enviar algo
 * @param {string} message - Mensagem do cliente
 * @returns {Object|null} - { type: 'documents', description: 'documentos' } ou null
 */
function detectPendingAction(message) {
  const messageLower = message.toLowerCase();

  // Padrões que indicam promessa de enviar documentos
  const documentPatterns = [
    /vou enviar/i,
    /mando.*depois/i,
    /envio.*quando/i,
    /chegando.*casa.*envio/i,
    /envio.*mais tarde/i,
    /posso.*fazer.*mais tarde/i,
    /faço.*isso.*depois/i,
    /te mando/i,
    /vou te mandar/i,
    /mando.*\bjá\b/i,
    /assim que possível/i,
    /logo.*envio/i,
    /chegando.*envio/i,
  ];

  for (const pattern of documentPatterns) {
    if (pattern.test(messageLower)) {
      return {
        type: "awaiting_documents",
        description: "Prometeu enviar documentos",
      };
    }
  }

  return null;
}

/**
 * Marca contato como tendo pendência
 * @param {string} phoneNumber - Número do contato
 * @param {string} pendingType - Tipo de pendência
 * @param {string} description - Descrição da pendência
 */
function markAsPending(phoneNumber, pendingType, description) {
  try {
    const cleanPhone = phoneNumber.replace("@c.us", "");

    // Atualiza ou insere contato com pendência
    const stmt = db.prepare(`
      INSERT INTO contacts (phone_number, follow_up_status)
      VALUES (?, ?)
      ON CONFLICT(phone_number) 
      DO UPDATE SET 
        follow_up_status = ?,
        last_contact_date = CURRENT_TIMESTAMP
    `);

    stmt.run(cleanPhone, pendingType, pendingType);

    // Cria follow-up agendado para 19h do dia seguinte
    const tomorrow19h = new Date();
    tomorrow19h.setDate(tomorrow19h.getDate() + 1);
    tomorrow19h.setHours(19, 0, 0, 0);

    const followUpStmt = db.prepare(`
      INSERT INTO follow_ups (phone_number, scheduled_date, follow_up_type, status)
      VALUES (?, ?, ?, 'pending')
    `);

    followUpStmt.run(cleanPhone, tomorrow19h.toISOString(), pendingType);

    console.log(`📋 Follow-up agendado para ${cleanPhone}: ${description}`);
  } catch (error) {
    console.error("❌ Erro ao marcar pendência:", error);
  }
}

/**
 * Remove pendência quando cliente envia o que prometeu
 * @param {string} phoneNumber - Número do contato
 * @param {string} messageType - Tipo de mensagem recebida
 */
function clearPendingIfFulfilled(phoneNumber, messageType) {
  try {
    const cleanPhone = phoneNumber.replace("@c.us", "");

    // Se recebeu documento/imagem, remove pendência
    if (
      messageType === "image" ||
      messageType === "document" ||
      messageType === "ptt"
    ) {
      const stmt = db.prepare(`
        UPDATE contacts 
        SET follow_up_status = 'completed'
        WHERE phone_number = ? 
        AND follow_up_status = 'awaiting_documents'
      `);

      stmt.run(cleanPhone);

      // Marca follow-ups como completos
      const followUpStmt = db.prepare(`
        UPDATE follow_ups 
        SET status = 'completed', message_sent = 1, sent_at = CURRENT_TIMESTAMP
        WHERE phone_number = ? 
        AND status = 'pending'
      `);

      followUpStmt.run(cleanPhone);

      console.log(`✅ Pendência resolvida para ${cleanPhone}`);
    }
  } catch (error) {
    console.error("❌ Erro ao limpar pendência:", error);
  }
}

/**
 * Busca todos os contatos com follow-up pendente para agora
 * @returns {Array} Lista de contatos que precisam de follow-up
 */
function getPendingFollowUps() {
  try {
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      SELECT 
        f.id,
        f.phone_number,
        f.follow_up_type,
        c.name,
        f.scheduled_date
      FROM follow_ups f
      LEFT JOIN contacts c ON f.phone_number = c.phone_number
      WHERE f.status = 'pending'
      AND f.scheduled_date <= ?
      AND f.message_sent = 0
      ORDER BY f.scheduled_date ASC
    `);

    const results = stmt.all(now);
    console.log(`📊 ${results.length} follow-up(s) pendente(s)`);

    return results;
  } catch (error) {
    console.error("❌ Erro ao buscar follow-ups:", error);
    return [];
  }
}

/**
 * Marca follow-up como enviado
 * @param {number} followUpId - ID do follow-up
 */
function markFollowUpAsSent(followUpId) {
  try {
    const stmt = db.prepare(`
      UPDATE follow_ups 
      SET message_sent = 1, sent_at = CURRENT_TIMESTAMP, status = 'sent'
      WHERE id = ?
    `);

    stmt.run(followUpId);
    console.log(`✅ Follow-up ${followUpId} marcado como enviado`);
  } catch (error) {
    console.error("❌ Erro ao marcar follow-up:", error);
  }
}

/**
 * Gera mensagem de follow-up personalizada
 * @param {string} followUpType - Tipo de follow-up
 * @param {string} contactName - Nome do contato
 * @returns {string} Mensagem de follow-up
 */
function generateFollowUpMessage(followUpType, contactName) {
  const firstName = contactName ? contactName.split(" ")[0] : "Olá";

  const messages = {
    awaiting_documents: `Oi ${firstName}! 😊

Tudo bem? Passando aqui pra lembrar dos documentos que você ia me enviar!

Quando tiver um tempinho, me manda:
📄 RG e CPF
📄 Contracheque (se CLT) ou Extrato bancário (se autônomo)

Assim a gente consegue dar andamento na sua análise de crédito! 🏠✨

Qualquer dúvida, estou por aqui! 😊`,
  };

  return (
    messages[followUpType] ||
    `Oi ${firstName}! 😊 Passando aqui pra dar um oi e ver se precisa de alguma ajuda! 🏠✨`
  );
}

/**
 * Inicia o job de follow-up que roda às 19h todo dia
 * @param {Object} client - Cliente WhatsApp
 */
/**
 * Inicia job de follow-up (cron: todos os dias às 19h)
 * @param {Client} client - Cliente WhatsApp
 * @param {Function} onComplete - Callback executado após follow-ups (opcional)
 */
function startFollowUpJob(client, onComplete = null) {
  // Cron job: todos os dias às 19:00
  const job = new CronJob(
    "0 19 * * *", // Às 19h todo dia
    async function () {
      console.log("\n🔔 ========== INICIANDO FOLLOW-UPS AGENDADOS ==========");
      console.log(`⏰ Horário: ${new Date().toLocaleString("pt-BR")}`);

      const pendingFollowUps = getPendingFollowUps();

      if (pendingFollowUps.length === 0) {
        console.log("✅ Nenhum follow-up pendente no momento");
        console.log("=".repeat(50) + "\n");
      } else {
        for (const followUp of pendingFollowUps) {
          try {
            const phoneNumber = `${followUp.phone_number}@c.us`;
            const message = generateFollowUpMessage(
              followUp.follow_up_type,
              followUp.name
            );

            console.log(
              `📤 Enviando follow-up para ${
                followUp.name || followUp.phone_number
              }`
            );
            console.log(`📋 Tipo: ${followUp.follow_up_type}`);

            // Envia mensagem
            await client.sendMessage(phoneNumber, message);

            // Marca como enviado
            markFollowUpAsSent(followUp.id);

            console.log(`✅ Follow-up enviado com sucesso!`);

            // Aguarda 2 segundos entre mensagens para não sobrecarregar
            await new Promise((resolve) => setTimeout(resolve, 2000));
          } catch (error) {
            console.error(
              `❌ Erro ao enviar follow-up para ${followUp.phone_number}:`,
              error.message
            );
          }
        }

        console.log("=".repeat(50) + "\n");
      }

      // Executa callback após follow-ups (se fornecido)
      if (onComplete && typeof onComplete === "function") {
        try {
          await onComplete();
        } catch (error) {
          console.error("❌ Erro ao executar callback:", error);
        }
      }
    },
    null, // onComplete
    true, // start
    "America/Sao_Paulo" // timezone
  );

  console.log("✅ Sistema de Follow-up ATIVADO (roda às 19h todo dia)");
  console.log("✅ Relatório diário será enviado às 19h também");

  return job;
}

/**
 * Testa o sistema de follow-up imediatamente (para debug)
 * @param {Object} client - Cliente WhatsApp
 */
async function testFollowUpNow(client) {
  console.log("\n🧪 ========== TESTE DE FOLLOW-UP ==========");

  const pendingFollowUps = getPendingFollowUps();

  if (pendingFollowUps.length === 0) {
    console.log("ℹ️  Nenhum follow-up pendente para testar");
    console.log("💡 Use markAsPending() para criar um follow-up de teste");
    return;
  }

  console.log(`📊 ${pendingFollowUps.length} follow-up(s) encontrado(s)`);

  for (const followUp of pendingFollowUps) {
    console.log("\n📋 Follow-up:", {
      phone: followUp.phone_number,
      name: followUp.name,
      type: followUp.follow_up_type,
      scheduled: followUp.scheduled_date,
    });
  }

  console.log("\n=".repeat(50) + "\n");
}

module.exports = {
  detectPendingAction,
  markAsPending,
  clearPendingIfFulfilled,
  getPendingFollowUps,
  markFollowUpAsSent,
  generateFollowUpMessage,
  startFollowUpJob,
  testFollowUpNow,
};
