// Script de migração para adicionar novas colunas ao banco de dados
const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "data", "conversations.db");
const db = new Database(dbPath);

console.log("🔧 Iniciando migração do banco de dados...\n");

try {
  // Adiciona novas colunas na tabela contacts
  console.log("📝 Adicionando novas colunas na tabela 'contacts'...");

  db.exec(`
    -- Adiciona coluna lead_source se não existir
    ALTER TABLE contacts ADD COLUMN lead_source TEXT DEFAULT 'direct';
  `);
  console.log("✅ Coluna 'lead_source' adicionada");

  db.exec(`
    -- Adiciona coluna is_ad_lead se não existir
    ALTER TABLE contacts ADD COLUMN is_ad_lead BOOLEAN DEFAULT 0;
  `);
  console.log("✅ Coluna 'is_ad_lead' adicionada");

  db.exec(`
    -- Adiciona coluna follow_up_status se não existir
    ALTER TABLE contacts ADD COLUMN follow_up_status TEXT DEFAULT 'pending';
  `);
  console.log("✅ Coluna 'follow_up_status' adicionada");

  db.exec(`
    -- Adiciona coluna last_bot_response se não existir
    ALTER TABLE contacts ADD COLUMN last_bot_response DATETIME;
  `);
  console.log("✅ Coluna 'last_bot_response' adicionada");

  // Cria tabela follow_ups se não existir
  console.log("\n📝 Criando tabela 'follow_ups'...");

  db.exec(`
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
  `);
  console.log("✅ Tabela 'follow_ups' criada");

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_follow_up_scheduled ON follow_ups(scheduled_date, status);
  `);
  console.log("✅ Índice criado na tabela 'follow_ups'");

  console.log("\n🎉 Migração concluída com sucesso!");
  console.log("\n✅ Banco de dados atualizado!");
  console.log("✅ Agora você pode reiniciar o bot normalmente.\n");
} catch (error) {
  if (error.message.includes("duplicate column name")) {
    console.log("\n⚠️  Colunas já existem! Nenhuma alteração necessária.");
    console.log("✅ Banco de dados já está atualizado.\n");
  } else {
    console.error("\n❌ Erro durante a migração:", error.message);
    console.log(
      "\n💡 Se o erro persistir, pode ser necessário recriar o banco."
    );
    console.log(
      "💡 Backup do banco: cp data/conversations.db data/conversations.db.backup\n"
    );
  }
}

db.close();
console.log("💾 Conexão com banco fechada.\n");
