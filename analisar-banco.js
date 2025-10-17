const Database = require('better-sqlite3');
const db = new Database('./data/conversations-ana.db');

const phone = '5524981058194';

console.log('\n📊 ANÁLISE COMPLETA DO NÚMERO', phone);
console.log('='.repeat(60));

// 1. Total de mensagens
const total = db.prepare('SELECT COUNT(*) as count FROM conversations WHERE phone_number = ?').get(phone).count;
console.log('\n1️⃣ TOTAL DE MENSAGENS:', total);

// 2. Mensagens da Ana (Humana)
const anaHumana = db.prepare("SELECT COUNT(*) as count FROM conversations WHERE phone_number = ? AND contact_name = 'Ana (Humana)'").get(phone).count;
console.log('2️⃣ MENSAGENS DE ANA (HUMANA):', anaHumana);

// 3. Últimas 10 mensagens
console.log('\n3️⃣ ÚLTIMAS 10 MENSAGENS:');
const msgs = db.prepare("SELECT contact_name, is_from_bot, message_content, datetime(timestamp, 'unixepoch', 'localtime') as data FROM conversations WHERE phone_number = ? ORDER BY timestamp DESC LIMIT 10").all(phone);
msgs.forEach((m, i) => {
  const tipo = m.is_from_bot ? '🤖 BOT' : '👤 CLIENTE';
  console.log(`${i+1}. [${m.data}] ${tipo} (${m.contact_name}): ${m.message_content.substring(0, 60)}...`);
});

// 4. Verifica se tem mensagem de Ana HOJE
const hoje = new Date();
hoje.setHours(0, 0, 0, 0);
const hojeTimestamp = hoje.getTime() / 1000;

const anaHoje = db.prepare("SELECT COUNT(*) as count FROM conversations WHERE phone_number = ? AND contact_name = 'Ana (Humana)' AND timestamp >= ?").get(phone, hojeTimestamp).count;
console.log('\n4️⃣ MENSAGENS DE ANA (HUMANA) HOJE:', anaHoje);

// 5. Todas as mensagens de hoje
console.log('\n5️⃣ TODAS AS MENSAGENS DE HOJE:');
const msgsHoje = db.prepare("SELECT contact_name, is_from_bot, message_content, datetime(timestamp, 'unixepoch', 'localtime') as data FROM conversations WHERE phone_number = ? AND timestamp >= ? ORDER BY timestamp ASC").all(phone, hojeTimestamp);
msgsHoje.forEach((m, i) => {
  const tipo = m.is_from_bot ? '🤖 BOT' : '👤 CLIENTE';
  console.log(`${i+1}. [${m.data}] ${tipo} (${m.contact_name}): ${m.message_content.substring(0, 60)}...`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ Análise concluída!\n');

db.close();
