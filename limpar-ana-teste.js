// Script para limpar mensagens de Ana (Humana) de um número específico
// Usado para testes - permite que o bot volte a responder

const Database = require("better-sqlite3");
const path = require("path");

// Abre o banco de dados da Ana
const dbPath = path.join(__dirname, "data", "conversations-ana.db");
const db = new Database(dbPath);

// Número a ser limpo
const phoneNumber = "5524981058194";

console.log("\n🧹 LIMPANDO MENSAGENS DE ANA (HUMANA)\n");
console.log(`📱 Número: ${phoneNumber}`);
console.log("=" .repeat(50));

// 1. Verifica quantas mensagens existem ANTES
const beforeCount = db
  .prepare(
    `
  SELECT COUNT(*) as count
  FROM conversations
  WHERE phone_number = ? AND contact_name = 'Ana (Humana)'
`
  )
  .get(phoneNumber).count;

console.log(`\n📊 Mensagens de "Ana (Humana)" antes: ${beforeCount}`);

if (beforeCount === 0) {
  console.log("✅ Nenhuma mensagem de Ana encontrada!");
  db.close();
  process.exit(0);
}

// 2. Remove mensagens de "Ana (Humana)"
const deleteStmt = db.prepare(`
  DELETE FROM conversations
  WHERE phone_number = ?
    AND contact_name = 'Ana (Humana)'
`);

const result = deleteStmt.run(phoneNumber);

console.log(`🗑️  Mensagens removidas: ${result.changes}`);

// 3. Verifica DEPOIS da limpeza
const afterCount = db
  .prepare(
    `
  SELECT COUNT(*) as count
  FROM conversations
  WHERE phone_number = ? AND contact_name = 'Ana (Humana)'
`
  )
  .get(phoneNumber).count;

console.log(`📊 Mensagens de "Ana (Humana)" depois: ${afterCount}`);

// 4. Mostra mensagens restantes do cliente
const remainingMessages = db
  .prepare(
    `
  SELECT contact_name, message_content, is_from_bot,
         datetime(timestamp, 'unixepoch', 'localtime') as data
  FROM conversations
  WHERE phone_number = ?
  ORDER BY timestamp DESC
  LIMIT 10
`
  )
  .all(phoneNumber);

console.log(`\n📝 Últimas 10 mensagens restantes (${phoneNumber}):`);
remainingMessages.forEach((msg, i) => {
  const sender = msg.is_from_bot ? "🤖 Bot" : "👤 Cliente";
  console.log(
    `${i + 1}. ${sender} (${msg.data}): ${msg.message_content.substring(
      0,
      60
    )}...`
  );
});

console.log("\n" + "=".repeat(50));
console.log("✅ LIMPEZA CONCLUÍDA!");
console.log(
  "🎯 Agora o bot voltará a responder mensagens deste número!\n"
);

db.close();
