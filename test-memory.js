// Exemplo de uso do sistema de memória de conversas
const conversationMemory = require("./src/conversation-memory");

console.log("\n🧪 TESTANDO SISTEMA DE MEMÓRIA\n");
console.log("=".repeat(50));

// Simula conversa Dia 1
console.log("\n📅 DIA 1 - Primeira conversa");
console.log("-".repeat(50));

const clientPhone = "5521999887766@c.us";
const clientName = "João Silva";

// Cliente manda mensagem
conversationMemory.saveMessage(
  clientPhone,
  clientName,
  "text",
  "Olá, quanto custa o apartamento próximo ao Alphaville?",
  false,
  Date.now() / 1000
);

// Bot responde
conversationMemory.saveMessage(
  clientPhone,
  "Ana Cláudia",
  "text",
  "Oi João! Temos uma excelente opção por R$ 222 mil. Quer mais detalhes?",
  true,
  Date.now() / 1000 + 5
);

// Cliente responde
conversationMemory.saveMessage(
  clientPhone,
  clientName,
  "text",
  "Sim! Aceita financiamento?",
  false,
  Date.now() / 1000 + 10
);

// Bot responde
conversationMemory.saveMessage(
  clientPhone,
  "Ana Cláudia",
  "text",
  "Sim! Aceitamos financiamento bancário e FGTS. Qual sua faixa de entrada?",
  true,
  Date.now() / 1000 + 15
);

console.log("✅ 4 mensagens salvas (Dia 1)");

// Simula Dia 2 - Cliente retorna
console.log("\n📅 DIA 2 - Cliente retorna");
console.log("-".repeat(50));

// BUSCA CONTEXTO antes de responder
const context = conversationMemory.getContextForAI(clientPhone, 10);
console.log("\n💡 CONTEXTO RECUPERADO:\n");
console.log(context);

// Cliente manda nova mensagem
conversationMemory.saveMessage(
  clientPhone,
  clientName,
  "text",
  "Oi! Posso visitar amanhã?",
  false,
  Date.now() / 1000 + 86400 // +1 dia
);

console.log("\n✅ Nova mensagem salva (Dia 2)");

// Mostra info do contato
console.log("\n📊 INFORMAÇÕES DO CONTATO:");
console.log("-".repeat(50));
const info = conversationMemory.getContactInfo(clientPhone);
console.log(info);

// Marca como qualificado
console.log("\n✅ QUALIFICANDO LEAD...");
conversationMemory.markAsQualified(clientPhone, {
  budget: 250000,
  financing: true,
  urgency: "medium",
  property_interest: "Alphaville R$222k",
});

// Adiciona nota
conversationMemory.addNote(
  clientPhone,
  "Cliente interessado! Quer visitar amanhã. Lembrar de ligar."
);

console.log("✅ Lead qualificado e nota adicionada");

// Estatísticas gerais
console.log("\n📈 ESTATÍSTICAS GERAIS:");
console.log("-".repeat(50));
const stats = conversationMemory.getStats();
console.log(stats);

// Lista contatos
console.log("\n👥 LISTA DE CONTATOS:");
console.log("-".repeat(50));
const contacts = conversationMemory.listContacts(10);
contacts.forEach((c) => {
  console.log(`📱 ${c.name || "Sem nome"} - ${c.phone_number}`);
  console.log(
    `   Mensagens: ${c.total_messages} | Qualificado: ${
      c.is_qualified ? "Sim" : "Não"
    }`
  );
  console.log(`   Último contato: ${c.last_contact}`);
  console.log("");
});

console.log("=".repeat(50));
console.log("\n✅ TESTE CONCLUÍDO!\n");
console.log("Banco de dados criado em: data/conversations.db");
console.log("Use um visualizador SQLite para ver os dados.\n");
