#!/usr/bin/env node
/**
 * Script para migrar dados da Ana (DDD 22) para banco separado
 * Mantém backup do banco original
 */

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dataDir = path.join(__dirname, "data");
const sourceDb = path.join(dataDir, "conversations.db");
const targetDb = path.join(dataDir, "conversations-ana.db");
const backupDb = path.join(dataDir, "conversations-backup.db");

console.log("🔄 Iniciando migração de dados da Ana...\n");

// 1. Fazer backup do banco original
console.log("📦 Criando backup do banco original...");
if (fs.existsSync(sourceDb)) {
  fs.copyFileSync(sourceDb, backupDb);
  console.log(`✅ Backup criado: ${backupDb}\n`);
} else {
  console.error("❌ Banco original não encontrado!");
  process.exit(1);
}

// 2. Conectar aos bancos
console.log("🔌 Conectando aos bancos de dados...");
const source = new Database(sourceDb, { readonly: true });
const target = new Database(targetDb);

// 3. Criar estrutura no banco de destino
console.log("🏗️  Criando estrutura de tabelas...");

target.exec(`
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
    sent_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (phone_number) REFERENCES contacts(phone_number)
  );
  
  CREATE INDEX IF NOT EXISTS idx_scheduled_date ON follow_ups(scheduled_date);
  CREATE INDEX IF NOT EXISTS idx_status ON follow_ups(status);

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone_number TEXT NOT NULL,
    preferred_date TEXT,
    preferred_time TEXT,
    status TEXT DEFAULT 'pending',
    created_at INTEGER NOT NULL,
    confirmed_at INTEGER,
    notes TEXT,
    FOREIGN KEY (phone_number) REFERENCES contacts(phone_number)
  );
`);

console.log("✅ Estrutura criada\n");

// 4. Copiar dados da Ana (TODOS os contatos, sem filtro DDD)
console.log("📊 Migrando TODOS os dados do banco original...\n");

// Conversations
const conversationsAna = source
  .prepare(
    `
  SELECT * FROM conversations
`
  )
  .all();

console.log(`   Conversas encontradas: ${conversationsAna.length}`);

if (conversationsAna.length > 0) {
  const insertConv = target.prepare(`
    INSERT INTO conversations (
      phone_number, contact_name, message_type, message_content, 
      is_from_bot, timestamp, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = target.transaction((conversations) => {
    for (const conv of conversations) {
      insertConv.run(
        conv.phone_number,
        conv.contact_name,
        conv.message_type,
        conv.message_content,
        conv.is_from_bot,
        conv.timestamp,
        conv.created_at
      );
    }
  });

  insertMany(conversationsAna);
  console.log(`   ✅ ${conversationsAna.length} conversas migradas`);
}

// Contacts
const contactsAna = source
  .prepare(
    `
  SELECT * FROM contacts
`
  )
  .all();

console.log(`   Contatos encontrados: ${contactsAna.length}`);

if (contactsAna.length > 0) {
  const insertContact = target.prepare(`
    INSERT INTO contacts (
      phone_number, name, first_contact_date, last_contact_date,
      total_messages, is_qualified, qualification_data, notes,
      lead_source, is_ad_lead, follow_up_status, last_bot_response
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertManyContacts = target.transaction((contacts) => {
    for (const contact of contacts) {
      insertContact.run(
        contact.phone_number,
        contact.name,
        contact.first_contact_date,
        contact.last_contact_date,
        contact.total_messages,
        contact.is_qualified,
        contact.qualification_data,
        contact.notes,
        contact.lead_source,
        contact.is_ad_lead,
        contact.follow_up_status,
        contact.last_bot_response
      );
    }
  });

  insertManyContacts(contactsAna);
  console.log(`   ✅ ${contactsAna.length} contatos migrados`);
}

// Follow-ups
const followUpsAna = source
  .prepare(
    `
  SELECT * FROM follow_ups
`
  )
  .all();

console.log(`   Follow-ups encontrados: ${followUpsAna.length}`);

if (followUpsAna.length > 0) {
  const insertFollowUp = target.prepare(`
    INSERT INTO follow_ups (
      phone_number, scheduled_date, follow_up_type, 
      status, sent_date, created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertManyFollowUps = target.transaction((followUps) => {
    for (const fu of followUps) {
      insertFollowUp.run(
        fu.phone_number,
        fu.scheduled_date,
        fu.follow_up_type,
        fu.status,
        fu.sent_date,
        fu.created_at
      );
    }
  });

  insertManyFollowUps(followUpsAna);
  console.log(`   ✅ ${followUpsAna.length} follow-ups migrados`);
}

// Appointments
const appointmentsAna = source
  .prepare(
    `
  SELECT * FROM appointments
`
  )
  .all();

console.log(`   Agendamentos encontrados: ${appointmentsAna.length}`);

if (appointmentsAna.length > 0) {
  const insertAppointment = target.prepare(`
    INSERT INTO appointments (
      phone_number, preferred_date, preferred_time, 
      status, created_at, confirmed_at, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertManyAppointments = target.transaction((appointments) => {
    for (const apt of appointments) {
      insertAppointment.run(
        apt.phone_number,
        apt.preferred_date,
        apt.preferred_time,
        apt.status,
        apt.created_at,
        apt.confirmed_at,
        apt.notes
      );
    }
  });

  insertManyAppointments(appointmentsAna);
  console.log(`   ✅ ${appointmentsAna.length} agendamentos migrados`);
}

// 5. Fechar conexões
source.close();
target.close();

console.log("\n✅ Migração concluída com sucesso!\n");
console.log("📁 Arquivos criados:");
console.log(`   - ${targetDb} (banco da Ana)`);
console.log(`   - ${backupDb} (backup do original)`);
console.log("\n🔄 Próximos passos:");
console.log("   1. Reiniciar os bots: pm2 restart all --update-env");
console.log("   2. Verificar logs: pm2 logs whatsbot-ana");
console.log("   3. Testar relatório: enviar 'relatório' para Ana");
