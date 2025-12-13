# KISSALO - PLATAFORMA DE SERVIÇOS IMOBILIÁRIOS
## Documentação Técnica Completa do Projeto

**Data de Criação:** 27 de Outubro de 2025  
**Versão:** 1.0  
**Status:** Desenvolvimento  

---

## SUMÁRIO EXECUTIVO

A plataforma **Kissalo** é um marketplace de serviços imobiliários que conecta clientes com prestadores de serviços (individuais ou empresas). O sistema gerencia solicitações de serviços, orçamentação, pagamentos centralizados e avaliações, com foco em controle e segurança através de conciliação bancária.

---

## 1. VISÃO GERAL DO PROJETO

### 1.1 Objetivo
Criar uma plataforma digital que facilite a conexão entre clientes que necessitam de serviços imobiliários (eletricidade, canalização, reparações, etc.) e prestadores de serviços qualificados.

### 1.2 Modelo de Negócio
- **Modelo Marketplace:** Plataforma intermediária entre cliente e prestador
- **Fluxo Financeiro:** Centralizador - todos os pagamentos são recebidos pela Kissalo
- **Controle:** Sistema de conciliação bancária para distribuição de valores aos prestadores
- **Segurança:** Garante confiabilidade através da mediação de pagamentos

### 1.3 Públicos-Alvo
- **Clientes:** Pessoas que necessitam de serviços imobiliários
- **Prestadores Individuais:** Profissionais autônomos
- **Prestadores Empresariais:** Empresas de serviços
- **Administradores:** Gestão e moderação da plataforma

---

## 2. REGRA DE NEGÓCIO

### 2.1 Estrutura de Categorias e Serviços

```
Categoria de Serviço (1) ─── (N) Serviço
        └─ Eletricidade
        └─ Canalização
        └─ Reparações Gerais
        └─ Pintura
        └─ Jardinagem
        └─ Construção
        └─ Limpeza
```

**Relação:** Uma categoria contém múltiplos serviços

### 2.2 Estrutura de Serviço e Detalhes

```
Serviço (1) ─── (1) Detalhes do Serviço
```

**Serviço:** Informações principais (nome, descrição, preço base, duração estimada)

**Detalhes do Serviço:** Informações adicionais
- O que está incluído (JSON)
- O que não está incluído (JSON)
- Notas e observações adicionais
- Especificações técnicas

### 2.3 Ciclo de Vida de uma Solicitação

```
Fluxo Principal:
Cliente → Solicita Serviço → Cria Ocorrência → Prestador Atende → Pagamento → Conciliação
```

**Passo a Passo:**

1. **Cliente solicita um serviço** 
   - Cliente acessa plataforma e pesquisa serviços por categoria
   - Seleciona um serviço específico
   - Cria uma **Ocorrência** (solicitação formal)

2. **Ocorrência é criada**
   - Vinculada ao Cliente (usuário que solicitou)
   - Vinculada ao Serviço (o que foi solicitado)
   - Status: Aberta/Aguardando Prestador

3. **Prestador atende a Ocorrência**
   - Prestador (Individual ou Empresa) visualiza a solicitação
   - Aceita a ocorrência
   - Marca data e hora para execução

4. **Cliente realiza o Pagamento**
   - Pagamento é feito na conta bancária de **Kissalo**
   - Kissalo recebe e controla todos os fundos
   - Pagamento é vinculado à Ocorrência

5. **Serviço é executado**
   - Prestador realiza o trabalho conforme acordado
   - Marca como concluído na plataforma

6. **Conciliação Bancária**
   - Após conclusão e validação do serviço
   - Kissalo processa pagamento ao prestador
   - Valor é transferido para conta bancária do prestador
   - Dados de conciliação são registrados

### 2.4 Tipos de Prestador

A plataforma suporta dois tipos de prestadores em uma única tabela com campo de tipo:

```
Prestador (tabela única)
├── Tipo: INDIVIDUAL
│   ├─ Pessoa Física
│   ├─ Dados PF (CPF, RG, etc)
│   ├─ Conta Bancária Pessoal
│   └─ Informações de Contato
│
└── Tipo: EMPRESA
    ├─ Pessoa Jurídica
    ├─ Dados Empresa (CNPJ, IE, etc)
    ├─ Conta Bancária Empresarial
    └─ Informações de Contato
```

### 2.5 Fluxo de Pagamentos e Conciliação

```
Processo de Pagamento:

CLIENTE
   │
   ├─→ Realiza Pagamento
   │
   ▼
CONTA KISSALO (Banco/Conta Empresa)
   │
   ├─→ Fundos em Custódia
   ├─→ Sistema Valida Execução do Serviço
   │
   ▼
CONCILIAÇÃO BANCÁRIA
   │
   ├─→ Identifica pagamentos a distribuir
   ├─→ Calcula valores (desconta comissão Kissalo se houver)
   ├─→ Gera registros de conciliação
   │
   ▼
CONTA PRESTADOR (Banco/Conta do Prestador)
   │
   └─→ Valor Transferido
```

---

## 3. MODELO DE DADOS - ENTIDADES

### 3.1 Diagrama de Relacionamentos (Simplificado)

```
User (1) ─────┬─────→ Client
              ├─────→ Professional
              ├─────→ BankAccount
              └─────→ Notification

Category (1) ─────→ (N) Service

Service (1) ─┬─────→ (1) ServiceDetail
             ├─────→ (N) Occurrence
             └─────→ (1) Professional

Occurrence (1) ─┬─────→ (1) Client
                ├─────→ (1) Service
                ├─────→ (1) Professional
                ├─────→ (N) Payment
                ├─────→ (1) ServiceExecution
                └─────→ (1) BankConciliation

Professional ─────→ BankAccount

Payment (N) ─────→ (1) Occurrence
Payment (1) ─────→ (1) BankAccount (Kissalo)

BankConciliation (N) ─┬─────→ (1) Payment
                      ├─────→ (1) Professional
                      └─────→ (1) BankAccount (Prestador)
```

### 3.2 Definição das Entidades

#### **User (Usuário Base)**
```
Tabela: users

Campos:
- id: UUID (PK)
- email: String (UNIQUE)
- password: String (hashed)
- full_name: String
- phone: String
- profile_picture: String (URL)
- user_type: Enum ['client', 'professional', 'admin']
- status: Enum ['active', 'inactive', 'suspended']
- email_verified: Boolean
- created_at: DateTime
- updated_at: DateTime
```

#### **Client (Cliente)**
```
Tabela: clients

Campos:
- id: UUID (PK)
- user_id: UUID (FK → users)
- address: String
- city: String
- province: String
- postal_code: String
- latitude: Decimal
- longitude: Decimal
- total_occurrences: Integer (default: 0)
- average_rating: Decimal (calculado)
- created_at: DateTime
- updated_at: DateTime
```

#### **Professional (Prestador)**
```
Tabela: professionals

Campos:
- id: UUID (PK)
- user_id: UUID (FK → users)
- professional_type: Enum ['individual', 'empresa']
- business_name: String (nome da empresa ou profissional)
- bio: Text (descrição/especialidade)
- years_experience: Integer
- document_number: String (CPF para individual, CNPJ para empresa)
- coverage_area: JSON (array de cidades/regiões atendidas)
- status: Enum ['pending', 'approved', 'rejected', 'suspended']
- verification_status: Enum ['not_verified', 'verified', 'documents_pending']
- average_rating: Decimal (calculado)
- total_completed_services: Integer (default: 0)
- bank_account_id: UUID (FK → bank_accounts)
- created_at: DateTime
- updated_at: DateTime
```

#### **Category (Categoria de Serviço)**
```
Tabela: categories

Campos:
- id: UUID (PK)
- name: String (ex: "Eletricidade", "Canalização")
- slug: String (UNIQUE, ex: "eletricidade")
- description: Text
- icon: String (URL)
- is_active: Boolean (default: true)
- order_index: Integer (para ordenação)
- created_at: DateTime
- updated_at: DateTime
```

#### **Service (Serviço)**
```
Tabela: services

Campos:
- id: UUID (PK)
- category_id: UUID (FK → categories)
- professional_id: UUID (FK → professionals)
- title: String (ex: "Instalação elétrica completa")
- description: Text
- base_price: Decimal (valor base)
- currency: String (default: 'AOA')
- estimated_duration: Integer (minutos)
- rating: Decimal (calculado)
- review_count: Integer (default: 0)
- is_active: Boolean (default: true)
- created_at: DateTime
- updated_at: DateTime
```

#### **ServiceDetail (Detalhes do Serviço)**
```
Tabela: service_details

Campos:
- id: UUID (PK)
- service_id: UUID (FK → services, UNIQUE)
- includes: JSON (array de itens incluídos)
  Exemplo: ["Verificação elétrica", "Substituição de componentes", "Mão de obra"]
- excludes: JSON (array de itens não incluídos)
  Exemplo: ["Reparações estruturais", "Fornecimento de materiais"]
- notes: Text (notas adicionais)
- specifications: JSON (especificações técnicas)
- warranty_months: Integer (garantia em meses, se houver)
- created_at: DateTime
- updated_at: DateTime
```

#### **Occurrence (Ocorrência/Solicitação)**
```
Tabela: occurrences

Campos:
- id: UUID (PK)
- client_id: UUID (FK → clients)
- service_id: UUID (FK → services)
- professional_id: UUID (FK → professionals, nullable inicialmente)
- title: String (título da solicitação)
- description: Text (descrição detalhada)
- location: String (local onde será realizado)
- latitude: Decimal (localização GPS)
- longitude: Decimal (localização GPS)
- status: Enum ['open', 'assigned', 'in_progress', 'completed', 'cancelled']
- priority: Enum ['normal', 'urgent']
- requested_date: DateTime (data desejada)
- estimated_duration: Integer (minutos)
- created_at: DateTime
- updated_at: DateTime
```

#### **Payment (Pagamento)**
```
Tabela: payments

Campos:
- id: UUID (PK)
- occurrence_id: UUID (FK → occurrences)
- client_id: UUID (FK → clients)
- amount: Decimal
- currency: String (default: 'AOA')
- payment_method: Enum ['credit_card', 'debit_card', 'bank_transfer', 'mobile_money']
- transaction_id: String (ID da transação na gateway)
- kissalo_bank_account_id: UUID (FK → bank_accounts, conta Kissalo)
- status: Enum ['pending', 'processing', 'completed', 'failed', 'refunded']
- paid_at: DateTime (quando foi pago)
- created_at: DateTime
- updated_at: DateTime
```

#### **BankAccount (Conta Bancária)**
```
Tabela: bank_accounts

Campos:
- id: UUID (PK)
- account_holder: String (nome do titular)
- bank_name: String (nome do banco)
- account_number: String (número da conta)
- account_agency: String (agência)
- account_type: Enum ['checking', 'savings']
- account_owner_type: Enum ['kissalo', 'professional']
- professional_id: UUID (FK → professionals, nullable se for Kissalo)
- document_number: String (CPF/CNPJ associado)
- is_active: Boolean (default: true)
- verified: Boolean (default: false)
- created_at: DateTime
- updated_at: DateTime
```

#### **BankConciliation (Conciliação Bancária)**
```
Tabela: bank_reconciliations

Campos:
- id: UUID (PK)
- payment_id: UUID (FK → payments)
- professional_id: UUID (FK → professionals)
- occurrence_id: UUID (FK → occurrences)
- professional_bank_account_id: UUID (FK → bank_accounts)
- gross_amount: Decimal (valor bruto a distribuir)
- kissalo_commission: Decimal (comissão Kissalo, se houver)
- net_amount: Decimal (valor líquido a transferir)
- status: Enum ['pending', 'processing', 'completed', 'failed']
- transaction_id: String (ID da transferência)
- scheduled_date: DateTime (data agendada para transferência)
- processed_at: DateTime (quando foi processado)
- notes: Text (observações)
- created_at: DateTime
- updated_at: DateTime
```

#### **ServiceExecution (Execução do Serviço)**
```
Tabela: service_executions

Campos:
- id: UUID (PK)
- occurrence_id: UUID (FK → occurrences)
- professional_id: UUID (FK → professionals)
- start_time: DateTime
- end_time: DateTime (nullable até conclusão)
- status: Enum ['not_started', 'in_progress', 'completed', 'issues_found']
- issues_description: Text (problemas encontrados, se houver)
- completion_notes: Text (observações da conclusão)
- photos: JSON (array de URLs de fotos)
- created_at: DateTime
- updated_at: DateTime
```

#### **Review/Rating (Avaliação)**
```
Tabela: reviews

Campos:
- id: UUID (PK)
- occurrence_id: UUID (FK → occurrences)
- client_id: UUID (FK → clients)
- professional_id: UUID (FK → professionals)
- rating: Integer (1-5 estrelas)
- comment: Text (comentário do cliente)
- professional_response: Text (resposta do profissional, nullable)
- is_verified_purchase: Boolean (se o serviço foi realmente realizado)
- helpful_count: Integer (quantas pessoas achou útil)
- created_at: DateTime
- updated_at: DateTime
```

#### **Notification (Notificação)**
```
Tabela: notifications

Campos:
- id: UUID (PK)
- user_id: UUID (FK → users)
- type: Enum ['new_request', 'request_accepted', 'payment_received', 'service_completed', 'review_received', 'payment_processed']
- title: String
- message: Text
- related_entity_type: String (nome da entidade: 'Occurrence', 'Payment', etc)
- related_entity_id: UUID
- is_read: Boolean (default: false)
- created_at: DateTime
- read_at: DateTime (nullable)
```

---

## 4. FLUXOS DE USUÁRIOS

### 4.1 Fluxo do Cliente

```
┌─────────────────────────────────────────────────────────┐
│                  FLUXO DO CLIENTE                       │
└─────────────────────────────────────────────────────────┘

1. CADASTRO E ACESSO
   └─ Cliente acessa plataforma
   └─ Faz cadastro (Email, Senha, Dados Pessoais)
   └─ Verifica email
   └─ Faz login

2. PESQUISA DE SERVIÇOS
   └─ Acessa página inicial
   └─ Visualiza categorias (Eletricidade, Canalização, etc)
   └─ Filtra por categoria ou busca
   └─ Visualiza lista de serviços
   └─ Vê detalhes do serviço (preço, descrição, avaliações)

3. SOLICITA SERVIÇO (Cria Ocorrência)
   └─ Clica em "Solicitar Serviço" ou "Agendar"
   └─ Preenche formulário:
      ├─ Descrição do que precisa
      ├─ Localização (endereço ou GPS)
      ├─ Data desejada
      ├─ Prioridade (normal/urgente)
      └─ Anexa fotos/documentos (opcional)
   └─ Revisa informações
   └─ Confirma solicitação (Occurrence criada)

4. ACOMPANHAMENTO
   └─ Visualiza status da solicitação
   └─ Recebe notificações:
      ├─ Profissional atribuído
      ├─ Data agendada
      ├─ Serviço iniciado
      └─ Serviço concluído

5. PAGAMENTO
   └─ Recebe notificação de confirmação do profissional
   └─ Realiza pagamento (múltiplas opções)
   └─ Confirmação de pagamento enviada para Kissalo
   └─ Recebe recibo

6. AVALIAÇÃO
   └─ Após conclusão do serviço
   └─ Acessa página de avaliação
   └─ Deixa rating (1-5 estrelas)
   └─ Escreve comentário (opcional)
   └─ Pode enviar fotos do trabalho concluído
   └─ Submete avaliação

7. HISTÓRICO
   └─ Visualiza histórico de serviços
   └─ Pode reutilizar mesmo profissional
   └─ Pode marcar como favorito
```

### 4.2 Fluxo do Prestador (Profissional)

```
┌─────────────────────────────────────────────────────────┐
│            FLUXO DO PRESTADOR/PROFISSIONAL              │
└─────────────────────────────────────────────────────────┘

1. CADASTRO E VERIFICAÇÃO
   └─ Profissional acessa plataforma
   └─ Escolhe tipo: Individual ou Empresa
   
   SE INDIVIDUAL:
   └─ Preenche dados PF (CPF, RG, etc)
   └─ Dados bancários pessoais
   
   SE EMPRESA:
   └─ Preenche dados Empresa (CNPJ, IE, etc)
   └─ Dados bancários empresariais
   
   └─ Carrega documentação
   └─ Aguarda aprovação (Admin revisa)
   └─ Recebe confirmação

2. CADASTRO DE SERVIÇOS
   └─ Acessa seção "Meus Serviços"
   └─ Clica em "Adicionar Serviço"
   └─ Preenche informações:
      ├─ Categoria (ex: Eletricidade)
      ├─ Título (ex: Instalação elétrica completa)
      ├─ Descrição detalhada
      ├─ Preço base
      ├─ Duração estimada
      ├─ O que inclui
      ├─ O que não inclui
      ├─ Notas/Especificações
      └─ Fotos do trabalho (portfolio)
   └─ Publica serviço

3. RECEBE SOLICITAÇÕES
   └─ Novo cliente solicita serviço
   └─ Profissional recebe notificação
   └─ Visualiza detalhes da Ocorrência:
      ├─ Descrição do cliente
      ├─ Localização
      ├─ Data desejada
      ├─ Fotos anexadas
      └─ Perfil do cliente

4. ACEITA OU REJEITA
   └─ Avalia a solicitação
   └─ Se ACEITA:
      └─ Confirma disponibilidade
      └─ Define data/hora exata
      └─ Envia confirmação para cliente
      └─ Ocorrência muda status para "assigned"
   
   └─ Se REJEITA:
      └─ Pode incluir motivo
      └─ Solicita volta para "open"

5. EXECUTA O SERVIÇO
   └─ Na data agendada, vai até local
   └─ Marca como "In Progress" no app
   └─ Realiza o trabalho
   └─ Tira fotos antes/depois (opcional)
   └─ Quando termina, marca como "Completed"
   └─ Adiciona notas de conclusão

6. RECEBE PAGAMENTO
   └─ Cliente realiza pagamento (vai para Kissalo)
   └─ Profissional vê que foi pago
   └─ Sistema processa conciliação bancária:
      ├─ Calcula valor líquido
      ├─ Desconta comissão (se houver)
      └─ Agenda transferência
   
   └─ Valor é transferido para conta do profissional
   └─ Recebe confirmação de transferência

7. RECEBE AVALIAÇÃO
   └─ Cliente deixa review
   └─ Profissional recebe notificação
   └─ Visualiza rating e comentário
   └─ Pode responder à avaliação (opcional)
   └─ Avaliação aparece em seu perfil
```

### 4.3 Fluxo de Pagamento e Conciliação

```
┌──────────────────────────────────────────────────────────────┐
│         FLUXO DE PAGAMENTO E CONCILIAÇÃO BANCÁRIA            │
└──────────────────────────────────────────────────────────────┘

ETAPA 1: CLIENTE REALIZA PAGAMENTO
┌─────────────────────────────────────────────────────────┐
│ 1. Ocorrência finalizada/confirmada                     │
│ 2. Cliente recebe notificação de pagamento              │
│ 3. Acessa plataforma e realiza pagamento                │
│ 4. Escolhe método: Cartão, Transferência, Mobile Money │
│ 5. Confirma valor: 20.000,00 AOA (exemplo)             │
│ 6. Pagamento processado                                 │
│ 7. Transação ID gerado                                  │
│ 8. Kissalo recebe na sua conta bancária                 │
│ 9. Cliente recebe confirmação e recibo                  │
│ 10. Database: Payment criado com status "completed"     │
└─────────────────────────────────────────────────────────┘

ETAPA 2: VALIDAÇÃO E PROCESSAMENTO
┌─────────────────────────────────────────────────────────┐
│ 1. Sistema valida se serviço foi realmente concluído    │
│ 2. Verifica se não há reclamações do cliente            │
│ 3. Confirma dados bancários do profissional             │
│ 4. Calcula comissão Kissalo (% a definir)              │
│    Exemplo:                                             │
│    ├─ Valor Bruto: 20.000,00 AOA                        │
│    ├─ Comissão Kissalo (10%): 2.000,00 AOA             │
│    └─ Valor Líquido: 18.000,00 AOA                      │
│ 5. Cria registro de BankConciliation                    │
│ 6. Agenda data de transferência                         │
└─────────────────────────────────────────────────────────┘

ETAPA 3: TRANSFERÊNCIA PARA PROFISSIONAL
┌─────────────────────────────────────────────────────────┐
│ 1. Na data agendada, sistema inicia transferência       │
│ 2. Acessa conta bancária do profissional                │
│ 3. Transfere valor líquido (18.000,00 AOA no exemplo)  │
│ 4. Sistema gera ID de transferência                     │
│ 5. BankConciliation atualiza com ID                     │
│ 6. Status muda para "completed"                         │
│ 7. Profissional recebe valor em sua conta               │
│ 8. Notificação enviada para profissional                │
│ 9. Kissalo fica com comissão (2.000,00 AOA)            │
└─────────────────────────────────────────────────────────┘

ETAPA 4: AUDITORIA E RASTREAMENTO
┌─────────────────────────────────────────────────────────┐
│ 1. Admin pode visualizar todo registro de conciliação   │
│ 2. Relatórios de pagamentos diários/mensais             │
│ 3. Histórico completo de transferências                 │
│ 4. Audit trail de todas as operações                    │
│ 5. Alertas para qualquer anomalia                       │
└─────────────────────────────────────────────────────────┘
```

---

## 5. FUNCIONALIDADES PRINCIPAIS

### 5.1 Para Clientes
- ✅ Buscar e filtrar serviços por categoria
- ✅ Visualizar detalhes de serviços (preço, avaliações, descrição)
- ✅ Criar solicitações de serviço (Ocorrências)
- ✅ Especificar localização e data desejada
- ✅ Anexar fotos/documentos na solicitação
- ✅ Acompanhar status em tempo real
- ✅ Realizar pagamento (múltiplos métodos)
- ✅ Avaliar profissional (rating + comentário)
- ✅ Ver histórico de serviços
- ✅ Marcar profissional como favorito
- ✅ Chat/Mensagens com profissional
- ✅ Receber notificações

### 5.2 Para Profissionais
- ✅ Cadastro (Individual ou Empresa)
- ✅ Envio de documentação para verificação
- ✅ Cadastrar múltiplos serviços
- ✅ Definir cobertura geográfica
- ✅ Adicionar fotos/portfolio
- ✅ Receber notificações de solicitações
- ✅ Aceitar ou rejeitar ocorrências
- ✅ Agendar data e hora
- ✅ Marcar serviço como em progresso/concluído
- ✅ Receber pagamento (conciliação automática)
- ✅ Ver histórico de serviços
- ✅ Visualizar avaliações e respostas
- ✅ Chat com clientes
- ✅ Gerenciar dados bancários
- ✅ Visualizar extrato de ganhos

### 5.3 Para Administradores
- ✅ Gerenciar categorias de serviços
- ✅ Verificar cadastro de profissionais
- ✅ Aprovar/rejeitar profissionais
- ✅ Suspender contas (cliente ou profissional)
- ✅ Visualizar todas as ocorrências
- ✅ Monitorar pagamentos
- ✅ Processar conciliação bancária manual (se necessário)
- ✅ Gerar relatórios de:
  - Pagamentos por período
  - Serviços mais solicitados
  - Profissionais com mais atividade
  - Comissões geradas
  - Transferências pendentes
- ✅ Gerenciar contas bancárias (Kissalo)
- ✅ Resolver disputas/reclamações
- ✅ Moderar avaliações
- ✅ Gerenciar suporte/help desk

---

## 6. ARQUITETURA TÉCNICA RECOMENDADA

### 6.1 Stack Tecnológico Sugerido

**Backend:**
- Linguagem: Node.js (Express) ou Python (Django/FastAPI)
- Banco de Dados: PostgreSQL (relacionamentos complexos)
- Cache: Redis (notificações em tempo real)
- Fila de Mensagens: RabbitMQ ou Bull (processamento async)

**Frontend:**
- Web: React.js ou Vue.js
- Mobile: React Native ou Flutter
- UI Framework: Material Design ou Tailwind CSS

**Infraestrutura:**
- Hospedagem: AWS, DigitalOcean ou Azure
- CDN: CloudFlare
- API Gateway: Kong ou AWS API Gateway
- Autenticação: JWT + OAuth2

**Integrações:**
- Pagamentos: Stripe, PayPal, ou gateway local
- SMS/Notificações: Twilio, Firebase
- Maps: Google Maps API
- Email: SendGrid ou Mailgun

### 6.2 Estrutura de Pastas (Backend)

```
kissalo-backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   ├── professionalController.js
│   │   ├── serviceController.js
│   │   ├── occurrenceController.js
│   │   ├── paymentController.js
│   │   └── bankReconciliationController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Client.js
│   │   ├── Professional.js
│   │   ├── Service.js
│   │   ├── ServiceDetail.js
│   │   ├── Occurrence.js
│   │   ├── Payment.js
│   │   ├── BankAccount.js
│   │   ├── BankReconciliation.js
│   │   ├── ServiceExecution.js
│   │   ├── Review.js
│   │   ├── Notification.js
│   │   └── Category.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── paymentService.js
│   │   ├── bankReconciliationService.js
│   │   ├── notificationService.js
│   │   ├── emailService.js
│   │   └── storageService.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── clients.js
│   │   ├── professionals.js
│   │   ├── services.js
│   │   ├── occurrences.js
│   │   ├── payments.js
│   │   ├── reviews.js
│   │   └── admin.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── validation.js
│   │   └── logging.js
│   │
│   ├── migrations/
│   │   ├── 001_create_users.js
│   │   ├── 002_create_clients.js
│   │   ├── 003_create_professionals.js
│   │   └── ...
│   │
│   ├── seeders/
│   │   ├── categories.js
│   │   └── initialData.js
│   │
│   └── utils/
│       ├── validators.js
│       ├── helpers.js
│       └── constants.js
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── config/
│   ├── database.js
│   ├── env.js
│   └── logger.js
│
└── app.js
```

---

## 7. SEGURANÇA E COMPLIANCE

### 7.1 Considerações de Segurança

- **Autenticação:** JWT com refresh tokens
- **Autorização:** Role-based access control (RBAC)
- **Criptografia:** HTTPS/TLS para todas as comunicações
- **Senhas:** Bcrypt com salt
- **Dados Sensíveis:** Criptografia de dados bancários
- **GDPR:** Conformidade com privacidade de dados
- **Validação:** Input validation em todos os endpoints
- **Rate Limiting:** Proteção contra brute force

### 7.2 Conformidade Regulatória

- Termos de Serviço
- Política de Privacidade
- Política de Devolução/Reembolso
- Acordo de Não-Discriminação
- Compliance Bancário (se aplicável na região)

---

## 8. ROADMAP DE DESENVOLVIMENTO

### Fase 1: MVP (Semanas 1-4)
- [x] Design e prototipagem
- [ ] Estrutura de banco de dados
- [ ] Autenticação (cadastro/login)
- [ ] CRUD de categorias e serviços
- [ ] Criação de ocorrências básica
- [ ] Pagamento simples
- [ ] Notificações básicas

### Fase 2: Core (Semanas 5-8)
- [ ] Sistema de avaliações/reviews
- [ ] Chat/Mensagens
- [ ] Conciliação bancária
- [ ] Dashboard cliente
- [ ] Dashboard profissional
- [ ] Histórico de serviços

### Fase 3: Advanced (Semanas 9-12)
- [ ] Filtros avançados e busca
- [ ] Favoritos
- [ ] App mobile
- [ ] Relatórios e analytics
- [ ] Sistema de recomendação
- [ ] Escalabilidade

### Fase 4: Polish & Launch
- [ ] Testes e QA
- [ ] Otimização de performance
- [ ] Documentação completa
- [ ] Treinamento de equipe
- [ ] Launch e marketing

---

## 9. MÉTRICAS E KPIs

### Para Monitorar:
- **Usuários ativos:** Clientes e profissionais
- **Taxa de conversão:** Solicitações → Pagamentos
- **Tempo médio de resposta:** Profissional aceita solicitação
- **Valor médio de transação:** AOA
- **Taxa de satisfação:** Rating médio dos serviços
- **Retenção:** Clientes/profissionais que retornam
- **Taxa de conclusão:** Serviços completados vs cancelados
- **Comissão gerada:** Receita Kissalo

---

## 10. GLOSSÁRIO

| Termo | Definição |
|-------|-----------|
| **Kissalo** | Plataforma marketplace de serviços imobiliários |
| **Ocorrência** | Solicitação formal de serviço criada por cliente |
| **Prestador** | Profissional ou empresa que executa o serviço |
| **Conciliação** | Processo de transferência de fundos para prestador |
| **Comissão** | Percentual retido por Kissalo das transações |
| **ServiceDetail** | Informações adicionais sobre um serviço (inclui/exclui) |
| **BankAccount** | Registro de dados bancários (Kissalo ou Prestador) |
| **Notificação** | Alerta enviado ao usuário sobre eventos importantes |

---

## 11. CONTATOS E SUPORTE

**Gerente de Projeto:** [Preencher]  
**Tech Lead:** [Preencher]  
**Suporte:** [Email/Telefone]  
**Documentação:** [Link repositório]

---

**Documento Versão:** 1.0  
**Última Atualização:** 27 de Outubro de 2025  
**Status:** Pronto para Desenvolvimento  

---

## PRÓXIMAS AÇÕES

1. ✅ Revisar documentação com equipe
2. ⬜ Criar diagramas ER detalhados
3. ⬜ Definir endpoints API
4. ⬜ Configurar ambiente de desenvolvimento
5. ⬜ Começar implementação Fase 1