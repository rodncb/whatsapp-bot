// Script de teste para verificar relatório admin
require("dotenv").config();

// Importa a função de memória
const conversationMemory = require("./src/conversation-memory");

async function generateDailyReport(date = null) {
  try {
    // Se não passar data, usa HOJE (para teste)
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
    const endTimestamp = Math.floor(endOfDay.getTime() / 1000);

    const dateStr = targetDate.toLocaleDateString("pt-BR");

    console.log(`\n🔍 Gerando relatório para: ${dateStr}`);
    console.log(
      `📅 Período: ${startOfDay.toLocaleString()} até ${endOfDay.toLocaleString()}`
    );
    console.log(`⏰ Timestamps: ${startTimestamp} até ${endTimestamp}\n`);

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
      .all();

    // 5. Agendamentos do dia
    const appointments = conversationMemory.db
      .prepare(
        `
      SELECT phone_number, preferred_date, preferred_time, status
      FROM appointments
      WHERE created_at >= ? AND created_at <= ?
    `
      )
      .all(startTimestamp, endTimestamp);

    // 6. Ana (humana) assumiu
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
    let report = `\n${"=".repeat(60)}\n`;
    report += `📊 *RELATÓRIO DIÁRIO - ${dateStr}*\n`;
    report += `${"=".repeat(60)}\n\n`;

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

    // Detalhes de pararam de responder - agrupa por nome e lista telefones
    if (stopped.length > 0) {
      report += `\n⏸️ *PARARAM DE RESPONDER:*\n`;

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

    report += `${"=".repeat(60)}\n`;
    report += `✅ Relatório gerado com sucesso!\n`;
    report += `${"=".repeat(60)}\n`;

    return report;
  } catch (error) {
    console.error("❌ Erro ao gerar relatório:", error);
    return `❌ Erro ao gerar relatório: ${error.message}`;
  }
}

// Executa o teste
async function testar() {
  console.log("\n🧪 TESTE DE RELATÓRIO ADMIN");
  console.log("============================\n");

  // Verifica qual database está sendo usado
  const dbPath = process.env.DB_NAME || "conversations.db";
  console.log(`📊 Database em uso: ${dbPath}\n`);

  // Se passar argumento, usa como data (process.argv[2]) no formato ISO ou YYYY-MM-DD
  const arg = process.argv[2];
  let dateArg = null;
  if (arg) {
    // Tenta criar Date a partir do argumento
    const parsed = new Date(arg);
    if (!isNaN(parsed)) {
      dateArg = parsed;
    } else {
      console.warn("⚠️ Data inválida passada, usando HOJE");
    }
  }

  // Gera relatório (padrão: HOJE)
  const relatorio = await generateDailyReport(dateArg);
  console.log(relatorio);

  // Estatísticas adicionais do banco
  console.log("\n📊 ESTATÍSTICAS DO BANCO:\n");

  const totalConversas = conversationMemory.db
    .prepare("SELECT COUNT(*) as count FROM conversations")
    .get().count;
  console.log(`💬 Total de conversas registradas: ${totalConversas}`);

  const totalContatos = conversationMemory.db
    .prepare("SELECT COUNT(DISTINCT phone_number) as count FROM conversations")
    .get().count;
  console.log(`👥 Total de contatos únicos: ${totalContatos}`);

  const contatosHoje = conversationMemory.db
    .prepare(
      `
    SELECT COUNT(DISTINCT phone_number) as count 
    FROM conversations 
    WHERE timestamp >= strftime('%s', 'now', 'start of day')
  `
    )
    .get().count;
  console.log(`📅 Contatos que conversaram hoje: ${contatosHoje}`);

  // Lista alguns contatos para verificar contaminação
  console.log("\n\n🔍 AMOSTRA DE CONTATOS (últimos 10):\n");
  const amostra = conversationMemory.db
    .prepare(
      `
    SELECT DISTINCT phone_number, 
      (SELECT name FROM contacts WHERE phone_number = c.phone_number) as name,
      MAX(timestamp) as last_message
    FROM conversations c
    WHERE contact_name != 'Ana (Humana)'
    GROUP BY phone_number
    ORDER BY last_message DESC
    LIMIT 10
  `
    )
    .all();

  amostra.forEach((c, i) => {
    const lastMsg = new Date(c.last_message * 1000).toLocaleString("pt-BR");
    console.log(
      `${i + 1}. ${c.name || "Sem nome"} (${
        c.phone_number
      }) - Última msg: ${lastMsg}`
    );
  });

  console.log("\n✅ Teste concluído!\n");
  process.exit(0);
}

// Executa
testar().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
