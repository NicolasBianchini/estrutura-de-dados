# 🏛️ FGJN Advocacia - Sistema de Gerenciamento

Sistema completo de gerenciamento para escritórios de advocacia, desenvolvido com **Next.js 15**, **Firebase** e **TypeScript**.

## 📋 Sobre o Projeto

O **FGJN Advocacia** é uma plataforma moderna e intuitiva para gerenciar todas as operações de um escritório de advocacia, incluindo clientes, advogados, agendamentos e processos.

### ✨ Principais Funcionalidades

#### 👨‍💼 **Para Administradores:**
- 📊 **Dashboard Completo** com métricas e gráficos
- 👥 **Gerenciamento de Clientes** (CRUD completo)
- ⚖️ **Gerenciamento de Advogados** (perfis, especialidades, horários)
- 📅 **Sistema de Agendamentos** (criar, editar, cancelar)
- 📈 **Relatórios e Estatísticas**
- 🔄 **Controle de Status** de processos

#### 👤 **Para Usuários Comuns:**
- 🏠 **Dashboard Personalizado** 
- 📅 **Meus Agendamentos** (visualizar e acompanhar)
- 👤 **Perfil Pessoal** (editar informações)
- 📋 **Próximos Compromissos**

## 🛠️ Tecnologias Utilizadas

### **Frontend:**
- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **Radix UI** + **NextUI** - Componentes
- **React Hook Form** - Formulários
- **React Query** - Gerenciamento de estado
- **Framer Motion** - Animações

### **Backend:**
- **Firebase Auth** - Autenticação
- **Firestore** - Banco de dados
- **Firebase Storage** - Armazenamento
- **Next.js API Routes** - API backend

### **Ferramentas:**
- **Drizzle ORM** - ORM para PostgreSQL
- **Stripe** - Pagamentos
- **Nodemailer** - Envio de emails
- **Zod** - Validação de dados

## 🚀 Como Executar o Projeto

### **Pré-requisitos:**
- Node.js 18+
- npm ou yarn
- Conta no Firebase
- Conta no Stripe (opcional)

### **1. Clone o Repositório:**
```bash
git clone https://github.com/seu-usuario/projetoFGJN.git
cd projetoFGJN
```

### **2. Instale as Dependências:**
```bash
npm install
# ou
yarn install
```

### **3. Configure as Variáveis de Ambiente:**

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

# Firebase Admin (Server-side)
FIREBASE_ADMIN_PRIVATE_KEY=sua_chave_privada
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@seu_projeto.iam.gserviceaccount.com

# Database (opcional)
DATABASE_URL=sua_connection_string_postgresql

# Stripe (opcional)
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
```

### **4. Configure o Firebase:**

#### **a) Crie um Projeto Firebase:**
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Add Project"
3. Nomeie seu projeto (ex: `fgjn-advocacia`)

#### **b) Habilite a Autenticação:**
1. No console, vá em **Authentication**
2. Clique em **"Get Started"**
3. Na aba **"Sign-in method"**:
   - Habilite **Email/Password** ✅
   - Habilite **Google** (opcional) ✅

#### **c) Configure o Firestore:**
1. Vá em **Firestore Database**
2. Clique **"Create database"**
3. Escolha **"Start in test mode"**
4. Selecione uma região

#### **d) Obtenha as Credenciais:**
1. Vá em **Project Settings** (⚙️)
2. Na aba **"General"** > **"Your apps"**
3. Clique no ícone **"Web"** (`</>`)
4. Registre sua aplicação
5. Copie as configurações para o `.env.local`

### **5. Execute o Projeto:**
```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em: **http://localhost:3003**

## 🌐 Acesso Online (Demo)

**🔗 Link do projeto:** [https://fgjnadvogados.netlify.app/](https://fgjnadvogados.netlify.app/)

### **📱 Mini Tutorial - Teste Online:**

#### **1. Primeiro Acesso:**
1. 🌐 Acesse: **https://fgjnadvogados.netlify.app/**
2. 👀 Você verá a tela inicial com **"FGJN Advocacia"**
3. 📋 Há duas abas: **"Entrar"** e **"Cadastrar"**

#### **2. Criar Conta de Usuário:**
1. 📝 Clique na aba **"Cadastrar"**
2. ✏️ Preencha os dados:
   - **Nome**: Seu nome completo
   - **Email**: Use um email válido (ex: `teste@email.com`)
   - **Senha**: Mínimo 6 caracteres (ex: `123456`)
   - **Tipo**: Selecione **"Usuário"** (opção padrão)
3. ✅ Clique **"Criar Conta"**
4. 📬 **IMPORTANTE: Verifique seu email (inclusive SPAM)** para confirmar a conta
5. 🚀 Após confirmar, será redirecionado para seu dashboard pessoal

#### **3. Explorar como Usuário:**
Após criar sua conta, você terá acesso a:

- 🏠 **Dashboard Pessoal** - Visão geral dos seus dados
- 📅 **Meus Agendamentos** - Visualizar suas consultas agendadas
- 📋 **Solicitar Agendamento** - Agendar novas consultas
- 👤 **Meu Perfil** - Editar suas informações pessoais
- 📞 **Contato** - Informações para contato com o escritório

#### **4. Funcionalidades para Testar:**

**O que você pode fazer:**
- ✅ **Visualizar seu dashboard** pessoal
- ✅ **Solicitar agendamentos** com advogados
- ✅ **Ver suas consultas** marcadas
- ✅ **Editar seu perfil** e informações pessoais
- ✅ **Acompanhar o status** dos seus processos
- ✅ **Navegar pela interface** responsiva

#### **🔍 Dicas de Navegação:**
- 🎯 Use o **menu lateral** para navegar
- 📱 É **responsivo** - teste no celular
- 🔄 Os dados são salvos no Firebase
- 🔐 Cada conta vê apenas suas informações

#### **⚠️ Importante:**
- 📧 **Use emails reais** para receber confirmações
- 📬 **Verifique a caixa de SPAM** - emails de verificação podem ir para lixo eletrônico
- 🔒 **Não use senhas pessoais** - é um ambiente de teste
- 👤 **Apenas contas de usuário** estão disponíveis para teste (acesso admin é restrito)
- 🧪 **Explore à vontade** - é seguro para testes

## 👥 Como Criar Contas (Desenvolvimento Local)

### **1. Acesse a Aplicação:**
- Abra o navegador em `http://localhost:3003`
- Você verá a tela de login/cadastro

### **2. Criar Conta de Administrador:**
1. Clique na aba **"Cadastrar"**
2. Preencha os dados:
   - **Nome completo**
   - **Email válido**
   - **Senha** (mínimo 6 caracteres)
   - **Tipo de usuário**: Selecione **"Admin"**
3. Clique **"Criar Conta"**
4. Você será redirecionado para `/dashboard`

### **3. Criar Conta de Usuário Comum:**
1. Siga os mesmos passos acima
2. Em **"Tipo de usuário"**: Selecione **"Usuário"**
3. Você será redirecionado para `/user-dashboard`

### **4. Login:**
- Use o email e senha cadastrados
- O sistema redireciona automaticamente baseado no tipo de usuário

## 🔐 Sistema de Permissões

### **👨‍💼 Administradores (`role: "admin"`):**
- ✅ Acesso total ao sistema
- ✅ Dashboard com métricas
- ✅ Gerenciar clientes, advogados e agendamentos
- ✅ Visualizar relatórios
- ✅ Configurações do sistema

### **👤 Usuários Comuns (`role: "user"`):**
- ✅ Dashboard pessoal
- ✅ Visualizar próprios agendamentos
- ✅ Editar perfil pessoal
- ❌ Não pode acessar área administrativa

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── (protected)/          # Rotas protegidas
│   │   ├── dashboard/        # Dashboard admin
│   │   ├── user-dashboard/   # Dashboard usuário
│   │   ├── appointments/     # Gerenciamento de agendamentos
│   │   ├── doctors/          # Gerenciamento de advogados
│   │   ├── patients/         # Gerenciamento de clientes
│   │   └── profile/          # Perfil do usuário
│   ├── authentication/       # Login e cadastro
│   ├── api/                  # API routes
│   └── page.tsx             # Página inicial
├── components/
│   ├── ui/                   # Componentes base
│   └── auth/                 # Componentes de autenticação
├── hooks/                    # Hooks customizados
├── lib/                      # Configurações e utilitários
└── types/                    # Tipos TypeScript
```

## 🎨 Interface

### **Dashboard Administrativo:**
- 📊 Cards com métricas importantes
- 📈 Gráficos de agendamentos
- 📋 Tabelas com dados dos clientes
- 🎛️ Controles de gerenciamento

### **Dashboard do Usuário:**
- 🏠 Visão geral personalizada
- 📅 Próximos agendamentos
- 👤 Informações do perfil
- 🔔 Notificações importantes

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Gera build de produção
npm run start        # Inicia servidor de produção

# Qualidade de código
npm run lint         # Executa ESLint
```

## 🚨 Solução de Problemas

### **Erro 400 - Bad Request:**
- ✅ Verifique se Email/Password está habilitado no Firebase
- ✅ Confirme se as variáveis de ambiente estão corretas
- ✅ Aguarde alguns minutos após configurar o Firebase

### **Erro de CORS:**
- ✅ Verifique se `localhost` está nas domains autorizadas do Firebase
- ✅ Limpe o cache do navegador

### **Erro de Conexão com Database:**
- ✅ Verifique a `DATABASE_URL` no `.env.local`
- ✅ Confirme se o banco PostgreSQL está rodando

### **Não recebeu email de verificação:**
- 📬 **Verifique a caixa de SPAM/Lixo Eletrônico**
- ⏰ Aguarde até 5 minutos para o email chegar
- 📧 Verifique se o email foi digitado corretamente
- 🔄 Tente reenviar o email de verificação

## 📞 Suporte

Para dúvidas ou problemas:

1. 📖 Consulte a documentação nos arquivos `.md` do projeto
2. 🔍 Verifique os logs no console do navegador (F12)
3. 🔧 Siga o guia de troubleshooting acima

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para facilitar a gestão de escritórios de advocacia** 
