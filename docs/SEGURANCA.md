# 🔒 SEGURANÇA - LEIA COM ATENÇÃO

## ⚠️ NUNCA FAÇA ISSO:

### ❌ NÃO commite o arquivo `.env`

- Contém sua API Key do Arcee.ai
- Se vazar, qualquer um pode usar sua conta
- O `.gitignore` já protege, mas **nunca remova essa proteção**

### ❌ NÃO commite a pasta `.wwebjs_auth/`

- Contém a sessão do WhatsApp conectado
- Se vazar, alguém pode acessar o WhatsApp do cliente
- O `.gitignore` já protege

### ❌ NÃO compartilhe prints do terminal com:

- QR Codes
- API Keys
- Números de telefone completos
- Dados de clientes

### ❌ NÃO rode o bot em Wi-Fi público

- Use apenas redes confiáveis
- Prefira sua rede de casa/escritório

## ✅ BOAS PRÁTICAS:

### ✅ Rotação de API Key

- Troque a API Key do Arcee.ai a cada 30 dias
- Se achar que vazou, troque IMEDIATAMENTE

### ✅ Backup seguro

- Se fizer backup do projeto, **exclua o `.env`** antes
- Ou use backup criptografado

### ✅ Acesso físico ao Mac

- Mantenha seu Mac com senha
- Ative FileVault (criptografia de disco)

### ✅ Logs e monitoramento

- Revise os logs periodicamente
- Fique atento a comportamentos estranhos

## 🔐 O que está protegido:

1. **API Key do Arcee.ai**: Apenas no `.env` (não vai pro Git)
2. **Sessão do WhatsApp**: Pasta `.wwebjs_auth/` (não vai pro Git)
3. **Dados das conversas**: Ficam apenas na memória (RAM)
4. **Números de telefone**: Nunca aparecem nos logs públicos

## 📋 Checklist de segurança:

Antes de compartilhar o projeto com alguém:

- [ ] Deletou o arquivo `.env`?
- [ ] Deletou a pasta `.wwebjs_auth/`?
- [ ] Deletou a pasta `node_modules/`?
- [ ] Verificou que não tem dados sensíveis em outros arquivos?
- [ ] Enviou apenas o código-fonte limpo?

## 🆘 E se algo vazar?

### Se a API Key do Arcee.ai vazar:

1. Acesse sua conta no Arcee.ai
2. Revogue a API Key comprometida
3. Gere uma nova API Key
4. Atualize o arquivo `.env`

### Se a sessão do WhatsApp vazar:

1. Abra o WhatsApp do cliente
2. Vá em Aparelhos Conectados
3. Desconecte todos os dispositivos suspeitos
4. Delete a pasta `.wwebjs_auth/`
5. Reconecte o bot com novo QR Code

## 🎓 Mais informações:

- [Arcee.ai Security](https://arcee.ai/security)
- [WhatsApp Security](https://www.whatsapp.com/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Lembre-se:** Segurança é responsabilidade de todos! 🛡️
