#!/bin/bash

# Script para rodar o BOT DE TESTE com caffeinate (mantém Mac acordado)

echo "🧪 Iniciando Bot de TESTE do Rodrigo..."
echo "📱 Número: +5524981058194"
echo ""
echo "⚠️  MODO TESTE: Responde TODAS mensagens automaticamente"
echo "💬 Respostas variam aleatoriamente (3 opções)"
echo "🎤 Áudio: 'Ouvi seu áudio e já avisei o Rodrigo...'"
echo "📝 Texto: 'Recebi sua mensagem e já avisei o Rodrigo...'"
echo ""
echo "⚡ Seu Mac não vai dormir enquanto o bot estiver rodando"
echo "🛑 Para parar: pressione Ctrl+C"
echo ""

caffeinate -i node src/bot-teste.js
