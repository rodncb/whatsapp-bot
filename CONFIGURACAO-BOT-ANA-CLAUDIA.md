# 🤖 Configuração do Bot - Ana Cláudia

**Data:** 14 de outubro de 2025  
**Número WhatsApp:** +55 22 99871-5947  
**Empresa:** Novo Lar Negócios Imobiliários  
**Responsável:** Rodrigo Bezerra

---

## 📋 RESUMO EXECUTIVO

O bot Ana Cláudia é um assistente de IA projetado para atender leads imobiliários com conversação natural e humanizada. Utiliza tecnologia Arcee.ai para gerar respostas contextuais e inteligentes, além de transcrição de áudios via OpenAI Whisper.

---

## 🎯 OBJETIVOS DO BOT

### Funções principais:

1. **Qualificar leads** - Identificar interesse real em imóveis
2. **Responder dúvidas** - Informações sobre imóveis disponíveis
3. **Agendar visitas** - Coletar dados para agendamento
4. **Filtrar curiosos** - Não perder tempo com não-qualificados
5. **Notificar Rodrigo** - Avisar quando lead está qualificado

---

## 🧠 PERSONALIDADE DO BOT

### Nome: Ana Cláudia

**Profissão:** Corretora de imóveis virtual  
**Empresa:** Novo Lar Negócios Imobiliários

### Tom de voz:

- ✅ **Profissional mas acessível**
- ✅ **Humanizado** (nunca parecer robô)
- ✅ **Empático e prestativo**
- ✅ **Direto ao ponto** (sem enrolação)
- ❌ **Nunca robótico ou formal demais**

### Características:

- Usa linguagem natural (como uma corretora real)
- Faz perguntas qualificadoras
- Sabe quando escalar para o Rodrigo
- Mantém conversas objetivas mas cordiais

---

## 🔧 CONFIGURAÇÃO TÉCNICA

### Tecnologias utilizadas:

- **WhatsApp:** whatsapp-web.js (conexão oficial WhatsApp Web)
- **IA Conversacional:** Arcee.ai (modelo de linguagem avançado)
- **Transcrição de Áudio:** OpenAI Whisper API
- **Gerenciamento:** PM2 (mantém bot online 24/7)
- **Ambiente:** Node.js

### Integrações:

- ✅ Arcee.ai API (conversação)
- ✅ OpenAI Whisper (transcrição de áudios)
- 🔄 Google Calendar (planejado - para agendamentos)

---

## 📱 FLUXO DE CONVERSAÇÃO

### 1️⃣ **Recepção inicial**

```
Cliente: "Olá, vi o imóvel no Instagram"
Ana: "Oi! Que ótimo que se interessou! 😊
      Estou aqui para te ajudar. Qual imóvel chamou sua atenção?"
```

### 2️⃣ **Qualificação do lead**

Ana faz perguntas estratégicas:

- Qual tipo de imóvel procura? (casa/apto)
- Quantos quartos precisa?
- Qual bairro/região prefere?
- Pretende comprar à vista ou financiar?
- Tem imóvel para dar de entrada?
- Qual sua faixa de orçamento?

### 3️⃣ **Fornecimento de informações**

Ana conhece os imóveis disponíveis e responde:

- Localização
- Valor
- Características (quartos, banheiros, vagas)
- Diferenciais (próximo a escolas, shopping, etc)

### 4️⃣ **Agendamento de visita**

Quando lead está interessado:

```
Ana: "Perfeito! Vamos agendar uma visita?
      Qual dia e horário são melhores para você?"
```

Coleta: Nome completo, telefone, data/hora preferida

### 5️⃣ **Notificação ao Rodrigo**

Bot identifica quando é hora de você entrar:

- Lead muito qualificado
- Pergunta técnica complexa
- Negociação de valores
- Cliente quer falar com "responsável"

---

## ✅ REGRAS DE NEGÓCIO

### O bot DEVE:

1. ✅ Responder mensagens de texto instantaneamente
2. ✅ Transcrever e responder áudios
3. ✅ Ser educado e profissional sempre
4. ✅ Qualificar leads antes de agendar visitas
5. ✅ Notificar Rodrigo quando lead está "quente"
6. ✅ Manter histórico de conversas
7. ✅ Responder 24 horas por dia, 7 dias por semana

### O bot NÃO DEVE:

1. ❌ Negociar valores sem autorização
2. ❌ Confirmar visitas sem validar com Rodrigo
3. ❌ Passar informações erradas sobre imóveis
4. ❌ Responder se **você (Rodrigo)** já participou da conversa hoje
5. ❌ Responder em grupos
6. ❌ Parecer robô ou usar linguagem robotizada

---

## 🎤 SUPORTE A ÁUDIO

### Como funciona:

1. Cliente envia áudio
2. Bot baixa e transcreve (OpenAI Whisper)
3. Bot processa transcrição como se fosse texto
4. Bot responde normalmente por texto

### Custo:

- **$0.006 por minuto** de áudio (~R$ 0.03/min)
- Exemplo: 100 áudios de 1 minuto = $0.60 (~R$ 3)

---

## 📊 IMÓVEL ATUAL NO BOT

### Propriedade destacada:

- **Valor:** R$ 222.000
- **Localização:** Próxima ao condomínio Alphaville
- **Empresa:** Novo Lar Negócios Imobiliários

### Personalização:

Estes dados podem ser atualizados no arquivo `.env`:

```
PROPERTY_VALUE=222000
PROPERTY_LOCATION=próxima ao condomínio Alphaville
COMPANY_NAME=Novo Lar Negócios Imobiliários
```

---

## ⚙️ COMANDOS ÚTEIS

### Ver status do bot:

```bash
pm2 status
```

### Ver conversas em tempo real:

```bash
pm2 logs ana-claudia
```

### Reiniciar bot:

```bash
pm2 restart ana-claudia
```

### Parar bot:

```bash
pm2 stop ana-claudia
```

### Iniciar bot:

```bash
pm2 start ana-claudia
```

---

## 🔐 SEGURANÇA E PRIVACIDADE

### Dados sensíveis protegidos:

- ✅ Chaves API não commitadas no Git
- ✅ Sessão WhatsApp criptografada localmente
- ✅ Conversas armazenadas localmente (não na nuvem)
- ✅ OpenAI configurado para NÃO compartilhar dados

### Backup recomendado:

- Fazer backup semanal da pasta `.wwebjs_auth/`
- Fazer backup do arquivo `data/conversations.json`

---

## 📈 MÉTRICAS E MONITORAMENTO

### Acompanhar:

- Número de conversas por dia
- Taxa de qualificação de leads
- Tempo médio de resposta
- Áudios transcritos por dia
- Custos de API (OpenAI)

### Ferramentas:

```bash
# Ver uso de memória/CPU
pm2 monit

# Ver logs das últimas 24h
pm2 logs ana-claudia --lines 1000
```

---

## 🚀 PRÓXIMOS PASSOS (PLANEJADOS)

### Fase 2 - Melhorias:

- [ ] Integração com Google Calendar (agendamentos automáticos)
- [ ] Dashboard web para visualizar conversas
- [ ] Relatórios automáticos por email
- [ ] Integração com CRM
- [ ] Múltiplos corretores/imóveis

### Fase 3 - Plataforma Multi-tenant:

- [ ] Vários clientes usando a mesma tecnologia
- [ ] Painel admin para gerenciar bots
- [ ] Faturamento automático
- [ ] White-label para revenda

---

## 🆘 TROUBLESHOOTING

### Bot não responde:

1. Verificar se está online: `pm2 status`
2. Ver logs de erro: `pm2 logs ana-claudia --err`
3. Reiniciar: `pm2 restart ana-claudia`

### Bot desconectou do WhatsApp:

1. Parar bot: `pm2 stop ana-claudia`
2. Deletar sessão: `rm -rf .wwebjs_auth/`
3. Iniciar bot: `pm2 start ana-claudia`
4. Escanear QR Code novamente

### Áudio não transcreve:

1. Verificar chave OpenAI no `.env`
2. Verificar saldo na conta OpenAI
3. Ver logs: `pm2 logs ana-claudia`

### Consumindo muita memória:

```bash
pm2 restart ana-claudia
```

---

## 💰 CUSTOS MENSAIS ESTIMADOS

### APIs:

- **Arcee.ai:** Conforme plano contratado
- **OpenAI Whisper:** ~$5-10/mês (depende do volume de áudios)

### Infraestrutura (atual):

- **Local (MacBook):** R$ 0 (usa seu Mac)

### Infraestrutura (futura - VPS):

- **DigitalOcean/AWS:** ~$10-20/mês
- **Oracle Cloud:** Grátis (tier gratuito permanente)

---

## 📞 CONTATO E SUPORTE

**Desenvolvedor:** Rodrigo Bezerra  
**WhatsApp:** +55 24 98105-8194  
**Projeto:** WhatsBot - Assistente IA para WhatsApp

---

## 📝 NOTAS DA REUNIÃO

### Dúvidas para esclarecer com Ana Cláudia:

1. **Horário de atendimento:**

   - Bot responde 24/7 ou tem horário comercial?
   - Se tiver horário, qual é? (ex: 8h-18h seg-sex)

2. **Imóveis disponíveis:**

   - Quantos imóveis tem no portfólio?
   - Precisa cadastrar todos no bot?
   - Tem fotos/vídeos para enviar?

3. **Processo de vendas:**

   - Como é o fluxo atual de atendimento?
   - Quais as principais dúvidas dos clientes?
   - Quais as principais objeções?

4. **Critérios de qualificação:**

   - O que define um lead qualificado?
   - Quando Ana quer ser notificada?
   - Leads desqualificados são descartados ou nutriados?

5. **Integrações:**

   - Usa CRM? Qual?
   - Usa Google Calendar para agendamentos?
   - Usa alguma ferramenta de relatórios?

6. **Tom de comunicação:**

   - Prefere formal ou informal?
   - Usar emojis? Quanto?
   - Tem scripts prontos que já usa?

7. **Casos especiais:**
   - Como tratar clientes antigos que voltam?
   - Como lidar com reclamações?
   - Como proceder com indicações?

---

## ✅ CHECKLIST PRÉ-LANÇAMENTO

Antes de ativar o bot para clientes reais:

- [ ] Testar bot com 5-10 conversas simuladas
- [ ] Verificar se respostas estão humanizadas
- [ ] Testar transcrição de áudios
- [ ] Configurar horário de atendimento (se houver)
- [ ] Cadastrar todos os imóveis disponíveis
- [ ] Definir scripts de qualificação com Ana
- [ ] Testar notificação para Rodrigo
- [ ] Fazer backup da configuração
- [ ] Documentar processo de vendas atual
- [ ] Treinar Ana para usar PM2 (se necessário)

---

**Última atualização:** 14 de outubro de 2025  
**Versão:** 1.0  
**Status:** Em configuração - Aguardando reunião com Ana Cláudia
