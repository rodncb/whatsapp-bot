// Módulo para gerenciar histórico de conversas em SQLite
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Cria pasta data se não existir
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Inicializa banco de dados
// Lê nome do banco do .env (cada bot tem seu próprio banco)
const dbName = process.env.DB_NAME || "conversations.db";
const dbPath = path.join(dataDir, dbName);
const db = new Database(dbPath);

console.log(`📊 Banco de dados: ${dbName}`);

// Cria tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone_number TEXT NOT NULL,
    contact_name TEXT,
    message_type TEXT NOT NULL,
    message_content TEXT NOT NULL,
    is_from_bot BOOLEAN NOT NULL,
    timestamp INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_phone_number ON conversations(phone_number);
  CREATE INDEX IF NOT EXISTS idx_timestamp ON conversations(timestamp);
  
  CREATE TABLE IF NOT EXISTS contacts (
    phone_number TEXT PRIMARY KEY,
    name TEXT,
    first_contact_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_contact_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_messages INTEGER DEFAULT 1,
    is_qualified BOOLEAN DEFAULT 0,
    qualification_data TEXT,
    notes TEXT,
    lead_source TEXT DEFAULT 'direct',
    is_ad_lead BOOLEAN DEFAULT 0,
    follow_up_status TEXT DEFAULT 'pending',
    last_bot_response DATETIME
  );
  
  CREATE TABLE IF NOT EXISTS follow_ups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone_number TEXT NOT NULL,
    scheduled_date DATETIME NOT NULL,
    follow_up_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    message_sent BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sent_at DATETIME,
    FOREIGN KEY (phone_number) REFERENCES contacts(phone_number)
  );
  
  CREATE INDEX IF NOT EXISTS idx_follow_up_scheduled ON follow_ups(scheduled_date, status);
  
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone_number TEXT NOT NULL,
    contact_name TEXT,
    preferred_date TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    confirmed_by_ana BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME,
    notes TEXT,
    FOREIGN KEY (phone_number) REFERENCES contacts(phone_number)
  );
  
  CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date, status);
`);

console.log("✅ Banco de dados inicializado:", dbPath);

/**
 * Salva uma mensagem no histórico
 * @param {string} phoneNumber - Número de telefone (ex: 5521999999999@c.us)
 * @param {string} contactName - Nome do contato
 * @param {string} messageType - Tipo: 'text', 'audio', 'image', etc
 * @param {string} messageContent - Conteúdo da mensagem
 * @param {boolean} isFromBot - true se foi enviada pelo bot
 * @param {number} timestamp - Timestamp da mensagem
 * @param {Object} metadata - Metadados extras (leadSource, isAdLead)
 */
function saveMessage(
  phoneNumber,
  contactName,
  messageType,
  messageContent,
  isFromBot,
  timestamp,
  metadata = {}
) {
  try {
    // Remove @c.us para padronizar
    const cleanPhone = phoneNumber.replace("@c.us", "");

    // Salva mensagem
    const stmt = db.prepare(`
      INSERT INTO conversations 
      (phone_number, contact_name, message_type, message_content, is_from_bot, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      cleanPhone,
      contactName,
      messageType,
      messageContent,
      isFromBot ? 1 : 0,
      timestamp
    );

    // Atualiza/cria contato
    const contactStmt = db.prepare(`
      INSERT INTO contacts (
        phone_number, 
        name, 
        last_contact_date, 
        total_messages,
        lead_source,
        is_ad_lead,
        last_bot_response
      )
      VALUES (?, ?, CURRENT_TIMESTAMP, 1, ?, ?, ${
        isFromBot ? "CURRENT_TIMESTAMP" : "NULL"
      })
      ON CONFLICT(phone_number) DO UPDATE SET
        name = excluded.name,
        last_contact_date = CURRENT_TIMESTAMP,
        total_messages = total_messages + 1,
        lead_source = COALESCE(contacts.lead_source, excluded.lead_source),
        is_ad_lead = COALESCE(contacts.is_ad_lead, excluded.is_ad_lead),
        last_bot_response = CASE 
          WHEN ${isFromBot ? 1 : 0} = 1 THEN CURRENT_TIMESTAMP 
          ELSE contacts.last_bot_response 
        END
    `);

    contactStmt.run(
      cleanPhone,
      contactName,
      metadata.leadSource || "direct",
      metadata.isAdLead ? 1 : 0
    );

    console.log(`💾 Mensagem salva: ${contactName} (${cleanPhone})`);
  } catch (error) {
    console.error("❌ Erro ao salvar mensagem:", error.message);
  }
}

/**
 * Busca histórico de conversas por número
 * @param {string} phoneNumber - Número de telefone
 * @param {number} limit - Limite de mensagens (padrão: 20)
 * @returns {Array} Histórico de mensagens
 */
function getConversationHistory(phoneNumber, limit = 20) {
  try {
    const cleanPhone = phoneNumber.replace("@c.us", "");

    const stmt = db.prepare(`
      SELECT 
        message_type,
        message_content,
        is_from_bot,
        timestamp,
        datetime(created_at, 'localtime') as created_at
      FROM conversations
      WHERE phone_number = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `);

    const messages = stmt.all(cleanPhone, limit);

    // Retorna em ordem cronológica (mais antiga primeiro)
    return messages.reverse();
  } catch (error) {
    console.error("❌ Erro ao buscar histórico:", error.message);
    return [];
  }
}

/**
 * Formata histórico para contexto da IA
 * @param {string} phoneNumber - Número de telefone
 * @param {number} limit - Limite de mensagens
 * @returns {string} Contexto formatado
 */
function getContextForAI(phoneNumber, limit = 10) {
  try {
    const history = getConversationHistory(phoneNumber, limit);

    if (history.length === 0) {
      return "Este é o primeiro contato com este cliente.";
    }

    // Formata histórico
    let context = `Histórico da conversa com este cliente (últimas ${history.length} mensagens):\n\n`;

    history.forEach((msg) => {
      const sender = msg.is_from_bot ? "Você (Ana)" : "Cliente";
      const date = new Date(msg.timestamp * 1000).toLocaleString("pt-BR");

      if (msg.message_type === "text") {
        context += `[${date}] ${sender}: ${msg.message_content}\n`;
      } else if (msg.message_type === "audio" || msg.message_type === "ptt") {
        context += `[${date}] ${sender}: [Áudio transcrito] ${msg.message_content}\n`;
      } else {
        context += `[${date}] ${sender}: [${msg.message_type}]\n`;
      }
    });

    context += `\nContinue a conversa de forma natural, considerando todo o histórico acima.`;

    return context;
  } catch (error) {
    console.error("❌ Erro ao gerar contexto:", error.message);
    return "Este é o primeiro contato com este cliente.";
  }
}

/**
 * Busca informações do contato
 * @param {string} phoneNumber - Número de telefone
 * @returns {Object|null} Dados do contato
 */
function getContactInfo(phoneNumber) {
  try {
    const cleanPhone = phoneNumber.replace("@c.us", "");

    const stmt = db.prepare(`
      SELECT 
        phone_number,
        name,
        datetime(first_contact_date, 'localtime') as first_contact,
        datetime(last_contact_date, 'localtime') as last_contact,
        total_messages,
        is_qualified,
        qualification_data,
        notes
      FROM contacts
      WHERE phone_number = ?
    `);

    return stmt.get(cleanPhone);
  } catch (error) {
    console.error("❌ Erro ao buscar contato:", error.message);
    return null;
  }
}

/**
 * Marca contato como qualificado
 * @param {string} phoneNumber - Número de telefone
 * @param {Object} qualificationData - Dados de qualificação
 */
function markAsQualified(phoneNumber, qualificationData = {}) {
  try {
    const cleanPhone = phoneNumber.replace("@c.us", "");

    const stmt = db.prepare(`
      UPDATE contacts
      SET is_qualified = 1,
          qualification_data = ?
      WHERE phone_number = ?
    `);

    stmt.run(JSON.stringify(qualificationData), cleanPhone);

    console.log(`✅ Contato qualificado: ${cleanPhone}`);
  } catch (error) {
    console.error("❌ Erro ao qualificar contato:", error.message);
  }
}

/**
 * Adiciona nota ao contato
 * @param {string} phoneNumber - Número de telefone
 * @param {string} note - Nota a adicionar
 */
function addNote(phoneNumber, note) {
  try {
    const cleanPhone = phoneNumber.replace("@c.us", "");

    const stmt = db.prepare(`
      UPDATE contacts
      SET notes = CASE 
        WHEN notes IS NULL THEN ?
        ELSE notes || '\n---\n' || ?
      END
      WHERE phone_number = ?
    `);

    stmt.run(note, note, cleanPhone);

    console.log(`📝 Nota adicionada: ${cleanPhone}`);
  } catch (error) {
    console.error("❌ Erro ao adicionar nota:", error.message);
  }
}

/**
 * Lista todos os contatos
 * @param {number} limit - Limite de resultados
 * @returns {Array} Lista de contatos
 */
function listContacts(limit = 50) {
  try {
    const stmt = db.prepare(`
      SELECT 
        phone_number,
        name,
        datetime(last_contact_date, 'localtime') as last_contact,
        total_messages,
        is_qualified
      FROM contacts
      ORDER BY last_contact_date DESC
      LIMIT ?
    `);

    return stmt.all(limit);
  } catch (error) {
    console.error("❌ Erro ao listar contatos:", error.message);
    return [];
  }
}

/**
 * Estatísticas gerais
 * @returns {Object} Estatísticas
 */
function getStats() {
  try {
    const totalContacts = db
      .prepare("SELECT COUNT(*) as count FROM contacts")
      .get().count;
    const qualifiedContacts = db
      .prepare("SELECT COUNT(*) as count FROM contacts WHERE is_qualified = 1")
      .get().count;
    const totalMessages = db
      .prepare("SELECT COUNT(*) as count FROM conversations")
      .get().count;

    return {
      totalContacts,
      qualifiedContacts,
      totalMessages,
      qualificationRate:
        totalContacts > 0
          ? ((qualifiedContacts / totalContacts) * 100).toFixed(2) + "%"
          : "0%",
    };
  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas:", error.message);
    return null;
  }
}

// Fecha banco ao encerrar processo
process.on("exit", () => {
  db.close();
  console.log("💾 Banco de dados fechado");
});

/**
 * Detecta se a mensagem é de um lead do Facebook
 * @param {string} messageContent - Conteúdo da mensagem
 * @returns {boolean} true se for lead do Facebook
 */
function isFromFacebookAd(messageContent) {
  if (!messageContent || typeof messageContent !== "string") {
    return false;
  }

  // Normaliza texto (remove acentos, pontuação, minúsculas)
  const normalized = messageContent
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[.,!?]/g, ""); // Remove pontuação

  // Padrão da mensagem do FB
  const fbPattern = "ola tenho interesse e queria mais informacoes por favor";

  return normalized.includes(fbPattern) || normalized === fbPattern;
}

/**
 * Agenda um follow-up para um contato
 * @param {string} phoneNumber - Número de telefone
 * @param {number} daysFromNow - Dias a partir de agora
 * @param {string} followUpType - Tipo: '7days', 'monthly'
 */
function scheduleFollowUp(phoneNumber, daysFromNow, followUpType) {
  try {
    const cleanPhone = phoneNumber.replace("@c.us", "");
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + daysFromNow);

    const stmt = db.prepare(`
      INSERT INTO follow_ups (phone_number, scheduled_date, follow_up_type, status)
      VALUES (?, ?, ?, 'pending')
    `);

    stmt.run(cleanPhone, scheduledDate.toISOString(), followUpType);
    console.log(`📅 Follow-up agendado: ${cleanPhone} em ${daysFromNow} dias`);
  } catch (error) {
    console.error("❌ Erro ao agendar follow-up:", error.message);
  }
}

/**
 * Busca follow-ups pendentes
 * @returns {Array} Lista de follow-ups pendentes
 */
function getPendingFollowUps() {
  try {
    const stmt = db.prepare(`
      SELECT 
        f.id,
        f.phone_number,
        f.follow_up_type,
        c.name,
        datetime(f.scheduled_date, 'localtime') as scheduled_date
      FROM follow_ups f
      JOIN contacts c ON f.phone_number = c.phone_number
      WHERE f.status = 'pending' 
        AND f.scheduled_date <= datetime('now')
      ORDER BY f.scheduled_date ASC
    `);

    return stmt.all();
  } catch (error) {
    console.error("❌ Erro ao buscar follow-ups:", error.message);
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
      SET status = 'sent', message_sent = 1, sent_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(followUpId);
    console.log(`✅ Follow-up ${followUpId} marcado como enviado`);
  } catch (error) {
    console.error("❌ Erro ao marcar follow-up:", error.message);
  }
}

/**
 * Busca leads de anúncios (Facebook)
 * @param {number} limit - Limite de resultados
 * @returns {Array} Lista de leads de anúncios
 */
function getAdLeads(limit = 50) {
  try {
    const stmt = db.prepare(`
      SELECT 
        phone_number,
        name,
        lead_source,
        datetime(first_contact_date, 'localtime') as first_contact,
        datetime(last_contact_date, 'localtime') as last_contact,
        total_messages,
        is_qualified,
        follow_up_status
      FROM contacts
      WHERE is_ad_lead = 1
      ORDER BY first_contact_date DESC
      LIMIT ?
    `);

    return stmt.all(limit);
  } catch (error) {
    console.error("❌ Erro ao buscar leads de anúncios:", error.message);
    return [];
  }
}

/**
 * Verifica se um contato já tem histórico de conversas
 * @param {string} phoneNumber - Número do telefone
 * @returns {boolean} - true se já tem histórico, false se é contato novo
 */
function hasConversationHistory(phoneNumber) {
  try {
    // Remove @c.us para padronizar
    const cleanPhone = phoneNumber.replace("@c.us", "");

    const stmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM conversations
      WHERE phone_number = ?
    `);

    const result = stmt.get(cleanPhone);
    return result.count > 0;
  } catch (error) {
    console.error("Erro ao verificar histórico:", error);
    return false;
  }
}

/**
 * Verifica se um usuário específico enviou mensagem para um contato HOJE
 * @param {string} phoneNumber - Número do contato
 * @param {string} userPhone - Número do usuário que estamos verificando (ex: Ana)
 * @returns {boolean} - true se o usuário enviou mensagem hoje
 */
function userSentMessageToday(phoneNumber, userPhone) {
  try {
    // Remove @c.us para padronizar
    const cleanPhone = phoneNumber.replace("@c.us", "");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime() / 1000;

    // Verifica se Ana (Humana) enviou mensagem hoje
    // Mensagens da Ana são salvas com contact_name = "Ana (Humana)"
    const stmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM conversations
      WHERE phone_number = ?
        AND contact_name = 'Ana (Humana)'
        AND timestamp >= ?
    `);

    const result = stmt.get(cleanPhone, todayTimestamp);
    return result.count > 0;
  } catch (error) {
    console.error("Erro ao verificar participação do usuário:", error);
    return false;
  }
}

/**
 * Cria um agendamento presencial
 * @param {string} phoneNumber - Número do cliente
 * @param {string} contactName - Nome do cliente
 * @param {string} preferredDate - Data preferida (ex: "segunda-feira", "15/10/2025")
 * @param {string} preferredTime - Horário preferido (ex: "14h", "10:00")
 * @returns {number} ID do agendamento criado
 */
function createAppointment(
  phoneNumber,
  contactName,
  preferredDate,
  preferredTime
) {
  try {
    const cleanPhone = phoneNumber.replace("@c.us", "");

    const stmt = db.prepare(`
      INSERT INTO appointments (phone_number, contact_name, preferred_date, preferred_time, status)
      VALUES (?, ?, ?, ?, 'pending')
    `);

    const result = stmt.run(
      cleanPhone,
      contactName,
      preferredDate,
      preferredTime
    );
    console.log(
      `📅 Agendamento criado: ${contactName} - ${preferredDate} às ${preferredTime}`
    );

    return result.lastInsertRowid;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return null;
  }
}

/**
 * Lista agendamentos pendentes
 * @returns {Array} Lista de agendamentos pendentes
 */
function getPendingAppointments() {
  try {
    const stmt = db.prepare(`
      SELECT * FROM appointments
      WHERE status = 'pending'
      ORDER BY created_at DESC
    `);

    return stmt.all();
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return [];
  }
}

/**
 * Confirma um agendamento (Ana confirmou)
 * @param {number} appointmentId - ID do agendamento
 * @returns {boolean} Sucesso
 */
function confirmAppointment(appointmentId) {
  try {
    const stmt = db.prepare(`
      UPDATE appointments
      SET status = 'confirmed',
          confirmed_by_ana = 1,
          confirmed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(appointmentId);
    console.log(`✅ Agendamento #${appointmentId} confirmado pela Ana`);
    return true;
  } catch (error) {
    console.error("Erro ao confirmar agendamento:", error);
    return false;
  }
}

/**
 * Marca atendimento presencial preferido no contato
 * @param {string} phoneNumber - Número do cliente
 */
function markAsInPersonPreference(phoneNumber) {
  try {
    const cleanPhone = phoneNumber.replace("@c.us", "");

    const stmt = db.prepare(`
      UPDATE contacts
      SET notes = COALESCE(notes, '') || '\n[PREFERÊNCIA: Atendimento presencial]'
      WHERE phone_number = ?
    `);

    stmt.run(cleanPhone);
  } catch (error) {
    console.error("Erro ao marcar preferência presencial:", error);
  }
}

module.exports = {
  db, // Exporta instância do banco para queries customizadas
  saveMessage,
  getConversationHistory,
  getContextForAI,
  getContactInfo,
  markAsQualified,
  addNote,
  listContacts,
  getStats,
  isFromFacebookAd,
  scheduleFollowUp,
  getPendingFollowUps,
  markFollowUpAsSent,
  getAdLeads,
  hasConversationHistory,
  userSentMessageToday,
  createAppointment,
  getPendingAppointments,
  confirmAppointment,
  markAsInPersonPreference,
};
