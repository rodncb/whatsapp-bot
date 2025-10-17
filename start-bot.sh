#!/bin/bash

# Script para rodar o bot com caffeinate (mantém Mac acordado)

echo "🚀 Iniciando WhatsBot com proteção contra suspensão..."
echo "⚡ Seu Mac não vai dormir enquanto o bot estiver rodando"
echo "🛑 Para parar: pressione Ctrl+C"
echo ""

caffeinate -i npm start
