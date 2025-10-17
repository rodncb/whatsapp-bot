// Script para RESETAR COMPLETAMENTE um número
// Remove TODAS as mensagens e dados do contato

const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "data", "conversations-ana.db");
const db = new Database(dbPath);

const phoneNumber = "5524981058194";

console.log("\n🗑️  RESETANDO NÚMERO COMPLETO\n");
console.log(`📱 Número: ${phoneNumber}`);
console.log("=" .repeat(60));

// 1. Conta mensagens ANTES
const beforeCount = db
  .prepare("SELECT COUNT(*) as count FROM conversations WHERE phone_number = ?")
  .get(phoneNumber).count;

console.log(`\n📊 Mensagens ANTES: ${beforeCount}`);

if (beforeCount === 0) {
  console.log("✅ Número já está limpo!");
  db.close();
  process.exit(0);
}

// 2. DELETA TUDO do conversations
console.log("\n🗑️  Deletando conversas...");
const deleteConv = db.prepare("DELETE FROM conversations WHERE phone_number = ?");
const resultConv = deleteConv.run(phoneNumber);
console.log(`   ✅ ${resultConv.changes} mensagens removidas`);

// 3. DELETA do contacts
console.log("🗑️  Deletando contato...");
const deleteCont = db.prepare("DELETE FROM contacts WHERE phone_number = ?");
const resultCont = deleteCont.run(phoneNumber);
console.log(`   ✅ ${resultCont.changes} contatos removidos`);

// 4. DELETA follow-ups
console.log("🗑️  Deletando follow-ups...");
const deleteFollow = db.prepare("DELETE FROM follow_ups WHERE phone_number = ?");
const resultFollow = deleteFollow.run(phoneNumber);
console.log(`   ✅ ${resultFollow.changes} follow-ups removidos`);

// 5. DELETA appointments
console.log("🗑️  Deletando agendamentos...");
const deleteAppt = db.prepare("DELETE FROM appointments WHERE phone_number = ?");
const resultAppt = deleteAppt.run(phoneNumber);
console.log(`   ✅ ${resultAppt.changes} agendamentos removidos`);

// 6. Verifica se limpou tudo
const afterCount = db
  .prepare("SELECT COUNT(*) as count FROM conversations WHERE phone_number = ?")
  .get(phoneNumber).count;

console.log("\n" + "=".repeat(60));
console.log(`📊 Mensagens DEPOIS: ${afterCount}`);
console.log("\n✅ RESET COMPLETO!");
console.log("🎯 Próxima mensagem será tratada como PRIMEIRO CONTATO\n");

db.close();
