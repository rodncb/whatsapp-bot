#!/bin/bash

# Script para rodar o BOT DE PRODUÇÃO - Ana Cláudia

echo "🚀 Iniciando Bot de PRODUÇÃO - Ana Cláudia..."
echo "📱 Número: +55 22 99871-5947"
echo ""
echo "⚠️  MODO PRODUÇÃO: Conversação humanizada via Arcee.ai"
echo "🧠 IA: Respostas contextuais e inteligentes"
echo "🎤 Áudio: Transcrição automática via OpenAI Whisper"
echo ""
echo "⚡ Seu Mac não vai dormir enquanto o bot estiver rodando"
echo "🛑 Para parar: pressione Ctrl+C"
echo ""

caffeinate -i node src/bot.js
