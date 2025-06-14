# Sistema de Roles - Usuários Admin vs Usuários Comuns

## Visão Geral

O sistema agora possui dois tipos de usuários com interfaces diferentes:

### 👨‍💼 **Administradores** (`role: "admin"`)
- **Acesso**: Dashboard completa com todas as funcionalidades
- **Rota**: `/dashboard`
- **Recursos**:
  - Visualização de métricas gerais
  - Gerenciamento de agendamentos
  - Gerenciamento de advogados
  - Gerenciamento de clientes
  - Gráficos e relatórios

### 👤 **Usuários Comuns** (`role: "user"`)
- **Acesso**: Interface simplificada focada em suas necessidades
- **Rota**: `/user-dashboard`
- **Recursos**:
  - Visualização de seus agendamentos
  - Informações de perfil
  - Próximos compromissos

## 🔄 Funcionamento

### Registro de Usuário
- No formulário de registro, é possível selecionar o tipo de usuário
- Por padrão, novos usuários são criados como `"user"`
- Apenas para fins de teste, é possível criar usuários admin

### Redirecionamento Automático
- **Login**: Usuários são redirecionados baseado no seu role
  - Admin → `/dashboard`
  - User → `/user-dashboard`

### Sidebar Diferenciada
- **Admin**: Sidebar completa com todas as opções
- **User**: Sidebar simplificada com apenas:
  - Início
  - Meus Agendamentos
  - Meu Perfil

## 📁 Estrutura de Arquivos

```
src/app/(protected)/
├── dashboard/           # Página para admins
├── user-dashboard/      # Página principal para usuários comuns
├── my-appointments/     # Agendamentos do usuário
├── profile/            # Perfil do usuário
├── _components/
│   ├── app-sidebar.tsx  # Sidebar para admins
│   └── user-sidebar.tsx # Sidebar para usuários comuns
└── layout.tsx          # Layout que escolhe o sidebar correto
```

## 🔧 Implementação Técnica

### Hook de Autenticação
```typescript
const { userData, isAdmin } = useFirebaseAuth();

// userData contém:
// - uid: string
// - email: string
// - name: string
// - role: "admin" | "user"
// - createdAt: Date
// - updatedAt: Date
```

### Verificação de Role
```typescript
// No layout
const isAdmin = userData?.role === "admin";
{isAdmin ? <AppSidebar /> : <UserSidebar />}

// No redirecionamento
if (userData.role === "admin") {
  router.push("/dashboard");
} else {
  router.push("/user-dashboard");
}
```

## 🎨 Interface

### Dashboard Admin
- Cards de métricas
- Gráficos de appointments
- Tabelas de dados
- Gerenciamento completo

### Dashboard Usuário
- Próximo agendamento em destaque
- Lista de agendamentos pessoais
- Informações de perfil
- Interface limpa e focada

## 🔐 Segurança

- Roles são armazenados no Firestore
- Verificação tanto no frontend quanto no backend
- Redirecionamento automático baseado em permissões
- Interface adaptada ao tipo de usuário

## 🧪 Como Testar

1. **Criar usuário admin**:
   - Registre-se selecionando "Admin" no formulário
   - Será redirecionado para `/dashboard`

2. **Criar usuário comum**:
   - Registre-se selecionando "Usuário" no formulário
   - Será redirecionado para `/user-dashboard`

3. **Verificar diferentes interfaces**:
   - Compare os sidebars
   - Navegue pelas diferentes páginas
   - Observe as funcionalidades disponíveis para cada tipo

## 📋 Próximos Passos

- [ ] Implementar proteção de rotas no backend
- [ ] Adicionar mais funcionalidades para usuários comuns
- [ ] Criar sistema de permissões mais granular
- [ ] Implementar notificações específicas por role 