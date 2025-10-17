// Configuração PM2 para os bots
module.exports = {
  apps: [
    // Bot TRANSCRITOR (Rodrigo) - SÓ transcreve áudios, NÃO responde
    {
      name: "bot-teste",
      script: "src/bot-teste.js",
      watch: false,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "development",
        DB_NAME: "conversations-teste.db",
        BOT_NAME: "Assistente do Rodrigo",
      },
      error_file: "./logs/bot-teste-error.log",
      out_file: "./logs/bot-teste-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },

    // Bot de PRODUÇÃO (Ana Cláudia) - Responde clientes
    {
      name: "whatsbot-ana",
      script: "src/bot.js",
      watch: false,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        DB_NAME: "conversations-ana.db",
        BOT_NAME: "Ana Cláudia",
      },
      error_file: "./logs/ana-claudia-error.log",
      out_file: "./logs/ana-claudia-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
