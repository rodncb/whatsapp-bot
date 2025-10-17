# 🚀 Plataforma SaaS - WhatsBot IA

**Projeto:** Plataforma Multi-Cliente de Bots WhatsApp com IA  
**Data:** 15 de outubro de 2025  
**Status:** 📝 Planejamento - FASE 2

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Funcionalidades](#funcionalidades)
4. [Stack Técnica](#stack-técnica)
5. [Planos e Preços](#planos-e-preços)
6. [Roadmap](#roadmap)
7. [Custos](#custos)
8. [Projeções Financeiras](#projeções-financeiras)

---

## 🎯 Visão Geral

### Problema

Empresas precisam de atendimento automatizado no WhatsApp, mas:

- ❌ Contratar desenvolvedores é caro (R$ 5k-15k/mês)
- ❌ Soluções existentes são complexas
- ❌ Não oferecem personalização real
- ❌ Cobram por conversa (muito caro)

### Solução

Plataforma SaaS onde o próprio cliente:

- ✅ Contrata em 5 minutos
- ✅ Configura o bot sem programar
- ✅ Conecta seu WhatsApp via QR Code
- ✅ Acompanha tudo em tempo real
- ✅ Paga preço fixo mensal

### Proposta de Valor

> "Tenha um atendente IA no WhatsApp em 5 minutos, sem programar"

---

## 🏗️ Arquitetura

### Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │Landing Page │  │  Dashboard   │  │  Configuração │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└────────────────────────────┬────────────────────────────┘
                             │ HTTPS/WSS
┌────────────────────────────▼────────────────────────────┐
│              BACKEND API (Node.js/Express)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │   Auth   │  │   Bots   │  │ Payments │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└────────────────────────────┬────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│   PostgreSQL   │  │      Redis      │  │   Bot Manager  │
│  (Dados)       │  │    (Cache)      │  │  (Orquestrador)│
└────────────────┘  └─────────────────┘  └───────┬────────┘
                                                  │
                    ┌─────────────────────────────┼─────────────┐
                    │                             │             │
            ┌───────▼────────┐          ┌─────────▼──────┐  ┌──▼─────┐
            │  Bot Cliente 1 │          │  Bot Cliente 2 │  │  ...   │
            │   (WhatsApp)   │          │   (WhatsApp)   │  │        │
            └────────────────┘          └────────────────┘  └────────┘
```

### Multi-Tenant Architecture

Cada cliente tem:

- ✅ Banco de dados isolado (schema)
- ✅ Processo de bot isolado (container)
- ✅ Sessão WhatsApp própria
- ✅ Dados criptografados

---

## ✨ Funcionalidades

### 🌐 Landing Page (Público)

**Home:**

- Hero: "Automatize seu WhatsApp com IA em 5 minutos"
- Demonstração ao vivo (chat simulado)
- Casos de uso (imobiliária, clínica, loja, etc)
- Prova social (depoimentos, números)
- Preços transparentes
- CTA: "Começar Agora Grátis"

**Exemplos:**

- Imobiliária (Ana Cláudia)
- Clínica Estética
- E-commerce
- Agendamento de Serviços
- Captação de Leads

### 🔐 Autenticação

**Cadastro:**

```
1. Email + Senha
2. Dados da empresa
   - Nome da empresa
   - CNPJ (opcional)
   - Telefone
   - Tipo de negócio
3. Escolha do plano
4. Pagamento (se não for trial)
5. QR Code WhatsApp
```

**Login:**

- Email/senha
- Google OAuth (futuro)
- Recuperação de senha

### 📊 Dashboard

**Visão Geral:**

```
┌─────────────────────────────────────────────────────────┐
│  Dashboard - Novo Lar Negócios Imobiliários            │
├─────────────────────────────────────────────────────────┤
│  📊 Estatísticas (Hoje)                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │   15    │  │    8    │  │   53%   │  │   3     │  │
│  │ Conversas│  │  Leads  │  │Conversão│  │Qualif.  │  │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │
├─────────────────────────────────────────────────────────┤
│  💬 Conversas Recentes                                  │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🔴 João Silva (há 2 min) - [LEAD QUENTE]         │ │
│  │ "Tenho interesse no imóvel..."                    │ │
│  │ ├─ Ana (bot): Ótimo! Qual sua renda familiar?    │ │
│  │ └─ João: R$ 4.500                                 │ │
│  │                                         [VER MAIS]│ │
│  ├───────────────────────────────────────────────────┤ │
│  │ 🟢 Maria Santos (há 15 min)                       │ │
│  │ "Qual o valor da entrada?"                        │ │
│  │                                         [VER MAIS]│ │
│  └───────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  📈 Gráficos                                            │
│  [Leads por dia] [Conversão] [Horários de pico]        │
└─────────────────────────────────────────────────────────┘
```

**Conversas:**

- Lista de todas conversas
- Filtros (hoje, semana, qualificados, etc)
- Busca por nome/telefone
- Ver conversa completa
- Assumir conversa manualmente (bot para)
- Exportar conversas

**Leads:**

- Lista de leads qualificados
- Dados completos (nome, telefone, renda, idade)
- Status dos documentos
- Notas do atendimento
- Exportar para CSV/Excel

**Relatórios:**

- Diário / Semanal / Mensal
- Taxa de conversão
- Origem dos leads (Facebook vs Direto)
- Melhor horário de atendimento
- Tempo médio de resposta
- Palavras-chave mais comuns

### ⚙️ Configuração do Bot

**Informações Básicas:**

```
┌─────────────────────────────────────────┐
│ Nome do Bot:                            │
│ [Ana Cláudia                          ] │
│                                         │
│ Nome da Empresa:                        │
│ [Novo Lar Negócios Imobiliários      ] │
│                                         │
│ Tipo de Negócio:                        │
│ [▼ Imobiliária                        ] │
│                                         │
│ Produto/Serviço Principal:              │
│ [Financiamento de imóveis             ] │
│                                         │
│ Valor (se aplicável):                   │
│ [R$ 222.000                           ] │
│                                         │
│ Localização:                            │
│ [Campos dos Goytacazes/RJ             ] │
└─────────────────────────────────────────┘
```

**Personalidade:**

```
┌─────────────────────────────────────────┐
│ Tom de Voz:                             │
│ ○ Formal         ○ Profissional        │
│ ● Casual         ○ Técnico             │
│                                         │
│ Uso de Emojis:                          │
│ ○ Nunca  ● Moderado  ○ Frequente       │
│                                         │
│ Primeira Pessoa:                        │
│ ○ "Eu sou..."    ● "Me chamo..."       │
└─────────────────────────────────────────┘
```

**Fluxo de Qualificação:**

```
┌─────────────────────────────────────────┐
│ Perguntas Obrigatórias:                 │
│ ☑ Nome                                  │
│ ☑ Tipo de trabalho (CLT/Autônomo)      │
│ ☑ Renda familiar                        │
│ ☑ Idade                                 │
│                                         │
│ Critérios de Qualificação:              │
│ Renda mínima: [R$ 2.000              ] │
│ Idade máxima:  [60 anos               ] │
│                                         │
│ Documentos a Solicitar:                 │
│ ☑ RG e CPF                              │
│ ☑ Contracheque (se CLT)                │
│ ☑ Extrato bancário (se autônomo)       │
└─────────────────────────────────────────┘
```

**Respostas Customizadas:**

```
┌─────────────────────────────────────────┐
│ Pergunta Comum #1:                      │
│ [Qual o valor da entrada?             ] │
│                                         │
│ Resposta:                               │
│ [Para calcular a entrada preciso fazer] │
│ [uma análise de crédito. Você trabalha] │
│ [de carteira assinada ou autônomo?    ] │
│                                         │
│                           [+ ADICIONAR] │
└─────────────────────────────────────────┘
```

**Horário de Atendimento:**

```
┌─────────────────────────────────────────┐
│ ☑ Atendimento 24/7                      │
│                                         │
│ Ou personalizar:                        │
│ Segunda a Sexta: [08:00] até [20:00]   │
│ Sábado:          [09:00] até [18:00]   │
│ Domingo:         [ Fechado          ]   │
│                                         │
│ Mensagem fora do horário:               │
│ [Obrigado pelo contato! Nosso horário  │
│  é de segunda a sábado...             ] │
└─────────────────────────────────────────┘
```

**Follow-up Automático:**

```
┌─────────────────────────────────────────┐
│ ☑ Ativar follow-up de 7 dias           │
│   (para leads que não responderam)      │
│                                         │
│ Mensagem:                               │
│ [Oi! Você demonstrou interesse há     │
│  alguns dias. Ainda quer saber mais?  ] │
│                                         │
│ ☑ Ativar follow-up mensal               │
│   (para leads não qualificados)         │
│                                         │
│ Quantidade de mensagens: [6          ] │
│ Intervalo (dias):        [30         ] │
└─────────────────────────────────────────┘
```

### 📱 Conexão WhatsApp

**Fluxo:**

```
1. Cliente clica "Conectar WhatsApp"
2. Sistema gera QR Code único
3. Cliente escaneia com WhatsApp dele
4. Bot conecta automaticamente
5. Status: 🟢 Conectado e Ativo
```

**Status:**

```
┌─────────────────────────────────────────┐
│ 🟢 WhatsApp Conectado                   │
│                                         │
│ Número: +55 22 99871-5947               │
│ Conectado há: 5 dias                    │
│ Última atividade: 2 minutos atrás       │
│                                         │
│ [DESCONECTAR] [RECONECTAR]              │
└─────────────────────────────────────────┘
```

### 💳 Pagamentos

**Planos:**

- Trial 7 dias grátis
- Upgrade/Downgrade a qualquer momento
- Cancelamento sem burocracia

**Métodos:**

- Cartão de crédito (Stripe)
- PIX (Mercado Pago)
- Boleto (Mercado Pago)

**Faturas:**

- Histórico completo
- Download de notas fiscais
- Próxima cobrança

### 👥 Números Administradores

```
┌─────────────────────────────────────────┐
│ Números Autorizados:                    │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ +55 22 99871-5947 (Ana Cláudia)    │ │
│ │ ✅ Relatórios  ✅ Comandos          │ │
│ │                        [REMOVER]    │ │
│ ├─────────────────────────────────────┤ │
│ │ +55 24 98105-8194 (Rodrigo)        │ │
│ │ ✅ Relatórios  ✅ Comandos          │ │
│ │                        [REMOVER]    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [+ ADICIONAR NÚMERO]                    │
└─────────────────────────────────────────┘
```

### 🔔 Notificações

**Configurações:**

```
☑ Email quando lead qualificado
☑ WhatsApp quando lead enviou documentos
☑ Email diário (resumo do dia)
☐ SMS para alertas urgentes
```

---

## 🛠️ Stack Técnica

### Frontend

**Framework:** Next.js 14

- Server Components
- App Router
- TypeScript
- TailwindCSS
- Shadcn/UI

**Bibliotecas:**

- Recharts (gráficos)
- React Query (data fetching)
- Zustand (state management)
- React Hook Form (formulários)
- Zod (validação)

### Backend

**API:** Node.js + Express

- TypeScript
- RESTful API
- WebSocket (tempo real)
- JWT Authentication

**Banco de Dados:** PostgreSQL

- Prisma ORM
- Migrations
- Multi-tenant (schemas)

**Cache:** Redis

- Cache de sessões
- Cache de relatórios
- Pub/Sub (comunicação bots)

**Fila:** Bull (Redis)

- Processamento assíncrono
- Envio de follow-ups
- Geração de relatórios

### Bots (WhatsApp)

**Base:** whatsapp-web.js

- LocalAuth (sessões)
- Multi-instância
- Orquestração via PM2

**IA:** Arcee.ai

- Conversação natural
- Personalização por cliente

**Áudio:** OpenAI Whisper

- Transcrição de áudios
- Opcional por plano

### Infraestrutura

**Hospedagem:** DigitalOcean / AWS

- VPS / EC2
- Load Balancer
- Auto-scaling

**Deploy:** Docker + Docker Compose

- Containerização
- CI/CD (GitHub Actions)

**Monitoramento:**

- PM2 (processos)
- Sentry (erros)
- Prometheus + Grafana (métricas)

**Backup:**

- Postgres (diário)
- S3/Spaces (armazenamento)

---

## 💰 Planos e Preços

### 🎯 PLANO ÚNICO - Tudo Incluído

**R$ 500/mês** ⭐

**Por que plano único?**

- ✅ Mais simples para o cliente (sem confusão)
- ✅ Mais fácil de vender (sem comparação)
- ✅ Menos suporte (sem dúvidas de "qual plano?")
- ✅ Ticket médio alto (R$ 500 vs R$ 97)
- ✅ Melhor percepção de valor

**Incluso no Plano:**

- ✅ 1 bot WhatsApp conectado
- ✅ **Conversas ilimitadas** (sem limite!)
- ✅ Dashboard completo
- ✅ Estatísticas em tempo real
- ✅ Gráficos e relatórios
- ✅ **Áudio (Whisper)** incluído
- ✅ **Follow-up automático** (7 dias + mensal)
- ✅ Até **3 números administradores**
- ✅ Exportação de dados (CSV/Excel)
- ✅ Suporte prioritário (WhatsApp + Email)
- ✅ Atualizações automáticas
- ✅ Backup diário
- ✅ **Sem taxa de setup**
- ✅ **Cancela quando quiser** (sem multa)

### 🎁 Trial Gratuito

**7 dias grátis**

- Sem cartão de crédito
- Acesso completo
- Suporte incluído

### 💎 Extras (Add-ons)

**Bot adicional:** +R$ 400/mês

- Para clientes com múltiplos negócios
- Ex: Imobiliária + Construtora

**Números admin extras:** +R$ 50/mês (por número)

- Além dos 3 incluídos
- Para equipes maiores

**Onboarding presencial (Resende):** +R$ 500 (pagamento único)

- Rodrigo vai pessoalmente
- Configura tudo
- Treina equipe
- 2-3 horas
- **Disponível apenas em Resende e região**

**Consultoria personalizada:** R$ 200/hora

- Otimização de prompts
- Estratégias de conversão
- Análise de métricas

---

## 🌍 Foco Regional: Resende/RJ

### Por que começar em Resende?

**Vantagens:**

1. ✅ **Pouca concorrência** (provavelmente zero!)
2. ✅ **Atendimento local** (diferencial enorme)
3. ✅ **Boca a boca forte** (cidade menor)
4. ✅ **Onboarding presencial** (conquistar confiança)
5. ✅ **Proximidade** (resolver problemas rápido)
6. ✅ **Conhece o mercado** (linguagem local)

**Cidades-alvo (Sul Fluminense):**

- Resende (140k habitantes)
- Volta Redonda (275k)
- Barra Mansa (185k)
- Itatiaia (30k)
- Pinheiral (25k)
- Porto Real (20k)

**Potencial:** ~675k habitantes

**Empresas-alvo:** ~5-10 mil PMEs

**Meta realista:** 50-100 clientes (0,5-1% do mercado)

### Estratégia Local:

**Fase 1 (Mês 1-3): Resende**

- Começar com Ana Cláudia ✅
- - Clínica estética ✅
- Buscar mais 10-15 clientes locais
- Foco: indicação + networking presencial

**Fase 2 (Mês 4-6): Sul Fluminense**

- Expandir para Volta Redonda
- Expandir para Barra Mansa
- Parcerias com agências locais

**Fase 3 (Mês 7-12): Regional**

- Angra dos Reis
- Paraty
- Região Serrana (Petrópolis, Teresópolis)

### Marketing Local:

**Gratuito/Orgânico:**

- ✅ Grupos WhatsApp empresários Resende
- ✅ Feiras e eventos locais (ACIR, CDL)
- ✅ Networking: Lions, Rotary, ACIR
- ✅ Cases de sucesso (Ana Cláudia)
- ✅ LinkedIn (empresários locais)

**Pago:**

- Facebook/Instagram Ads (geo Resende)
- Google Ads ("automatizar whatsapp resende")
- Patrocínio eventos locais

**Presencial:**

- Palestras em associações comerciais
- Workshops gratuitos
- Visitas comerciais (B2B)

---

## 📅 Roadmap

### FASE 1 - MVP (6 semanas)

**Objetivo:** Primeiros clientes pagantes

**Semana 1-2: Frontend Base**

- Landing page
- Cadastro/Login
- Dashboard básico

**Semana 3-4: Backend Core**

- API REST
- Auth (JWT)
- Banco de dados
- Bot manager

**Semana 5-6: Integração**

- Conexão WhatsApp
- Pagamentos
- Deploy
- Testes beta

**Entrega:**

- 5-10 clientes beta
- Plano Pro funcional
- Landing page no ar

### FASE 2 - Growth (8 semanas)

**Objetivo:** Escalar para 50 clientes

**Features:**

- Follow-up automático
- Relatórios avançados
- Números admin
- Exportação dados
- Templates prontos
- Onboarding guiado

**Marketing:**

- SEO (blog)
- Google Ads
- Facebook Ads
- Indicação (R$ 50 desconto)

**Entrega:**

- 50 clientes pagantes
- MRR: R$ 10k

### FASE 3 - Scale (12 semanas)

**Objetivo:** 200 clientes

**Features:**

- API pública
- Whitelabel
- App mobile
- Integração Zapier
- Multi-idioma
- IA customizada

**Infraestrutura:**

- Auto-scaling
- Load balancer
- Multi-região

**Entrega:**

- 200 clientes
- MRR: R$ 40k
- Time: 3-4 pessoas

---

## 💵 Custos e Projeções

### Custos Fixos Mensais

**Infraestrutura (por 50 bots):**

- VPS 16GB RAM: R$ 240/mês
- PostgreSQL: R$ 100/mês
- Redis: R$ 50/mês
- Backup/Storage: R$ 50/mês
- **Subtotal:** R$ 440/mês

**APIs (por 50 bots):**

- Arcee.ai (~15k msgs/bot): R$ 500/mês
- OpenAI Whisper (~100 áudios/bot): R$ 200/mês
- **Subtotal:** R$ 700/mês

**Pagamentos:**

- Stripe/Mercado Pago: 4,5% + R$ 0,40
- Nota fiscal: 3-5%

**Ferramentas:**

- Email (SendGrid): R$ 50/mês
- Monitoramento: R$ 30/mês
- **Subtotal:** R$ 80/mês

**TOTAL FIXO:** ~R$ 1.220/mês (50 bots)

### Projeções Financeiras

**Mês 1-2 (Beta):**

- Clientes: 10 (grátis)
- Receita: R$ 0
- Custo: R$ 300
- **Lucro: -R$ 300**

**Mês 3 (Lançamento):**

- Clientes: 25
- Receita: R$ 4.900 (20 Pro, 5 Básico)
- Custo: R$ 700
- **Lucro: R$ 4.200**

**Mês 6:**

- Clientes: 50
- Receita: R$ 10.000
- Custo: R$ 1.220
- **Lucro: R$ 8.780**
- **Margem: 88%**

**Mês 12:**

- Clientes: 150
- Receita: R$ 30.000
- Custo: R$ 3.500
- **Lucro: R$ 26.500**
- **Margem: 88%**

**Ano 2:**

- Clientes: 500
- Receita: R$ 100.000/mês
- Custo: R$ 12.000/mês
- **Lucro: R$ 88.000/mês**
- **Margem: 88%**

### CAC (Custo de Aquisição)

**Orgânico (SEO/Indicação):** R$ 50-100
**Google Ads:** R$ 150-300
**Facebook Ads:** R$ 100-200

**Meta:** CAC < R$ 200

### LTV (Lifetime Value)

**Churn mensal:** 5-10%
**Vida média:** 10-20 meses
**LTV (Pro):** R$ 197 × 15 meses = **R$ 2.955**

**LTV/CAC:** 2.955 / 200 = **14,8x** ✅

---

## 🎯 Go-to-Market

### Público-Alvo (PMF)

**Primários:**

1. Imobiliárias (Ana Cláudia) ✅
2. Clínicas de estética ✅
3. Clínicas médicas
4. Advogados
5. Contadores

**Características:**

- 1-10 funcionários
- Recebe muitas mensagens WhatsApp
- Não tem tempo/dinheiro para desenvolver
- Quer mais clientes
- Faturamento: R$ 20k-500k/mês

### Canais de Aquisição

**1. SEO (Longo prazo)**

- Blog: "Como automatizar WhatsApp"
- Keywords: bot whatsapp, atendimento automático
- Custo: R$ 500/mês (freelancer)

**2. Google Ads (Médio prazo)**

- Search: "bot whatsapp para negócios"
- Display: remarketing
- Budget: R$ 2.000/mês
- Meta: 10-15 clientes/mês

**3. Facebook/Instagram Ads**

- Vídeos demonstrando
- Cases de sucesso
- Budget: R$ 1.500/mês
- Meta: 8-12 clientes/mês

**4. Indicação (Curto prazo)**

- R$ 50 desconto por indicação
- Viral: cada cliente traz 2-3

**5. Parcerias**

- Agências de marketing
- Consultorias
- Comissão: 20-30%

### Pitch de Vendas

**Problema:**
"Você perde clientes porque não responde rápido no WhatsApp?"

**Solução:**
"Bot com IA atende 24/7, qualifica leads e você só fala com quem está pronto"

**Proof:**
"Ana Cláudia (imobiliária) qualifica 8 leads/dia no automático"

**CTA:**
"Teste 7 dias grátis, sem cartão de crédito"

---

## 🚧 Riscos e Mitigações

### Risco 1: WhatsApp banir contas

**Mitigação:**

- Usar whatsapp-web.js (não oficial, mas estável)
- Orientar clientes: não spam
- Limitar mensagens/dia
- Plano B: API oficial (caro, mas oficial)

### Risco 2: Churn alto

**Mitigação:**

- Onboarding impecável
- Suporte rápido
- Success manager (pro/enterprise)
- Melhorias contínuas

### Risco 3: Competição

**Mitigação:**

- Foco em nicho (PMEs brasileiras)
- Preço competitivo
- UX superior
- Suporte em PT-BR

### Risco 4: Custos de IA aumentarem

**Mitigação:**

- Negociar preços com Arcee
- Alternativa: OpenAI, Claude
- Repassar aumentos gradualmente

---

## ✅ Próximos Passos Imediatos

### Esta Semana (15-21/10):

1. ✅ Validar bot da Ana (reunião 9h)
2. ✅ Configurar bot da clínica estética
3. ✅ Fechar VPS (DigitalOcean)
4. ✅ Deploy dos 2 bots

### Próximas 2 Semanas (22/10-04/11):

1. 🎨 Wireframes da plataforma
2. 🎨 Design system (Figma)
3. 💻 Setup projeto Next.js
4. 💻 Setup backend (Node + Prisma)

### Mês 1 (Nov 2025):

1. 💻 MVP Frontend (80%)
2. 💻 MVP Backend (80%)
3. 🧪 Testes internos
4. 📢 Landing page no ar

### Mês 2 (Dez 2025):

1. 🚀 Beta (10 clientes grátis)
2. 🐛 Correções de bugs
3. 📢 Marketing orgânico
4. 💰 Primeiros clientes pagantes

---

## 💡 Diferenciais Competitivos

### vs. Desenvolvedores Freelance

- ✅ Mais barato (R$ 197 vs R$ 5k)
- ✅ Mais rápido (5 min vs 1 mês)
- ✅ Sem depender de dev

### vs. Chatbot Makers (Manychat, etc)

- ✅ IA real (não regras)
- ✅ WhatsApp nativo
- ✅ Mais natural

### vs. API Oficial WhatsApp

- ✅ Muito mais barato
- ✅ Sem burocracia (Facebook Business)
- ✅ Setup em 5 minutos

---

## 📞 Contato

**Desenvolvedor:** Rodrigo Bezerra  
**Email:** rodrigo@whatsbot.com.br  
**WhatsApp:** +55 24 98105-8194

---

**Documentação criada em:** 15/10/2025  
**Última atualização:** 15/10/2025  
**Versão:** 1.0
