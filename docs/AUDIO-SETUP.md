# 🎤 GUIA: Como Habilitar Suporte a Áudios

## ✅ O que já está pronto:

Tudo está **configurado e pronto**! O bot tem dois modos:

### 📝 **Modo 1: TEXTO APENAS** (Padrão atual)

- ✅ Bot processa mensagens de texto com **Arcee.ai**
- ✅ Quando recebe áudio, pede educadamente para enviar texto
- ✅ **Zero custo adicional**
- ✅ Funciona AGORA (para os testes de amanhã)

### 🎤 **Modo 2: TEXTO + ÁUDIO** (Quando você quiser)

- ✅ Bot processa texto com **Arcee.ai**
- ✅ Bot transcreve áudio com **OpenAI Whisper**
- ✅ Depois passa transcrição para **Arcee.ai** responder
- 💰 Custo: ~$0.006 por minuto (~1 centavo)

---

## 🚀 Como ATIVAR suporte a áudio:

### **Passo 1: Criar conta OpenAI**

1. Acesse: https://platform.openai.com/signup
2. Crie uma conta (pode usar Google/Microsoft)
3. **Adicione créditos:** https://platform.openai.com/settings/organization/billing
   - Mínimo: $5 (dura MUITO tempo)
   - Sugestão: $10-20 para começar

### **Passo 2: Pegar API Key**

1. Vá em: https://platform.openai.com/api-keys
2. Clique em **"Create new secret key"**
3. Dê um nome: `WhatsBot Audio`
4. Copie a chave (começa com `sk-...`)
5. ⚠️ **GUARDE ESSA CHAVE!** Só aparece uma vez

### **Passo 3: Configurar no projeto**

Abra o arquivo `.env` e adicione a chave:

```env
# OpenAI API Key (OPCIONAL - para transcrição de áudios)
OPENAI_API_KEY=sk-sua-chave-aqui-copiada-do-openai
```

Salve o arquivo.

### **Passo 4: Reiniciar o bot**

Se o bot estiver rodando:

1. Pare: `Ctrl + C`
2. Inicie novamente: `./start-bot.sh`

Você vai ver essa mensagem:

```
🎤 Suporte a ÁUDIO HABILITADO (OpenAI Whisper)
```

**Pronto! 🎉** Agora o bot transcreve áudios automaticamente!

---

## 🔄 Como DESATIVAR suporte a áudio:

Basta remover a chave do `.env`:

```env
# OpenAI API Key (OPCIONAL - para transcrição de áudios)
OPENAI_API_KEY=
```

Reinicie o bot e ele volta ao modo texto apenas.

---

## 💰 Custos do OpenAI Whisper:

### Preço oficial:

- **$0.006 por minuto** de áudio

### Exemplos práticos:

- 1 áudio de 1 min = **$0.006** (~3 centavos BR)
- 10 áudios de 1 min = **$0.06** (~30 centavos BR)
- 100 áudios de 1 min = **$0.60** (~R$ 3)
- 1000 áudios de 1 min = **$6** (~R$ 30)

### Estimativa mensal:

| Áudios/dia | Duração média | Custo/mês          |
| ---------- | ------------- | ------------------ |
| 10         | 1 min         | ~$2/mês (~R$ 10)   |
| 50         | 1 min         | ~$9/mês (~R$ 45)   |
| 100        | 1 min         | ~$18/mês (~R$ 90)  |
| 200        | 2 min         | ~$72/mês (~R$ 360) |

**Conclusão:** Para bot imobiliário, provavelmente **$5-15/mês** é suficiente.

---

## 🧪 Como testar se está funcionando:

### **Com ÁUDIO DESABILITADO** (atual):

1. Alguém manda áudio
2. Bot responde: "Recebi seu áudio, mas pode digitar? 📝"

### **Com ÁUDIO HABILITADO:**

1. Alguém manda áudio
2. Terminal mostra: `🎤 Áudio recebido`
3. Terminal mostra: `🔄 Transcrevendo áudio com OpenAI Whisper...`
4. Terminal mostra: `💬 Transcrição: [texto do áudio]`
5. Bot responde normalmente (como se fosse texto)

---

## 📊 Monitorando custos OpenAI:

### Onde ver seus gastos:

1. Acesse: https://platform.openai.com/usage
2. Veja consumo em tempo real
3. Configure alertas de budget

### Configurar limite de gasto:

1. Vá em: https://platform.openai.com/settings/organization/limits
2. Defina limite mensal (ex: $20)
3. Se atingir, API para automaticamente

---

## ⚙️ Arquitetura do sistema:

```
┌─────────────────────────────────────────┐
│         Cliente manda mensagem          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  É texto/áudio? │
         └────────┬────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
    📝 TEXTO            🎤 ÁUDIO
        │                   │
        │                   ▼
        │         ┌──────────────────┐
        │         │ OpenAI Whisper   │
        │         │ (transcrição)    │
        │         └────────┬─────────┘
        │                  │
        └──────────┬───────┘
                   │
                   ▼
        ┌──────────────────┐
        │   Arcee.ai       │
        │ (gera resposta)  │
        └────────┬─────────┘
                 │
                 ▼
        ┌────────────────┐
        │ Envia resposta │
        └────────────────┘
```

---

## 🎯 Quando habilitar áudio?

### **Habilite SE:**

- ✅ Cliente recebe muitos áudios de clientes
- ✅ Orçamento permite (~$10-20/mês)
- ✅ Quer maximizar conversões
- ✅ Público prefere áudio a texto

### **Deixe desabilitado SE:**

- ✅ Fazendo testes iniciais (economiza)
- ✅ Orçamento apertado
- ✅ Clientes aceitam enviar texto
- ✅ Volume de áudios é baixo

---

## 📝 Checklist de ativação:

**Para AMANHÃ (testes):**

- [ ] ❌ NÃO precisa habilitar áudio
- [ ] ✅ Teste no modo texto apenas
- [ ] ✅ Veja se cliente realmente precisa áudio

**Para DEPOIS (se necessário):**

- [ ] Criar conta OpenAI
- [ ] Adicionar créditos ($10-20)
- [ ] Pegar API Key
- [ ] Adicionar no `.env`
- [ ] Reiniciar bot
- [ ] Testar com áudio real
- [ ] Monitorar custos

---

## 🆘 Troubleshooting:

### ❌ Erro: "OPENAI_API_KEY não configurada"

- Verifique se adicionou a chave no `.env`
- Verifique se salvou o arquivo
- Reinicie o bot

### ❌ Erro: "Incorrect API key provided"

- Chave copiada errada
- Pegue nova chave no OpenAI
- Cole novamente no `.env`

### ❌ Áudio não transcreve:

- Verifique saldo na conta OpenAI
- Veja logs no terminal
- Teste com áudio mais curto primeiro

### ❌ Transcrição errada:

- Whisper é muito bom, mas não é 100%
- Áudios com muito ruído podem ter erro
- Teste com áudios mais claros

---

## 💡 Dicas e boas práticas:

1. **Comece sem áudio** (modo texto) → teste → veja necessidade
2. **Monitore custos** semanalmente nos primeiros 2 meses
3. **Configure limite de $20/mês** para não ter surpresas
4. **Whisper é MUITO bom** em português BR
5. **Áudios longos** (>5min) custam mais, mas funcionam
6. **Qualidade do áudio** não precisa ser perfeita

---

## 🎉 Resumo:

✅ **Está TUDO PRONTO**
✅ **Funciona agora** sem áudio (teste amanhã)
✅ **Quando quiser áudio:** só adicionar chave OpenAI
✅ **Ativa/desativa** quando quiser
✅ **Custo controlado** (~$10-20/mês típico)

---

**Qualquer dúvida na hora de ativar, é só chamar!** 🚀
