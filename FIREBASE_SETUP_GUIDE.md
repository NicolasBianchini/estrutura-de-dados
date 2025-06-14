# 🔥 Guia de Configuração Firebase Auth

## ⚠️ ERRO 400 - SOLUÇÃO

O erro `400 (Bad Request)` acontece porque o **Firebase Auth não está configurado corretamente**. Siga estes passos:

## 🚀 Passo a Passo - Configuração Firebase

### 1. **Acesse o Firebase Console**
   - Vá para: https://console.firebase.google.com
   - Faça login com sua conta Google
   - Selecione seu projeto: **projeto-estrutura-c2f18**

### 2. **Habilitar Authentication**
   
   **a) Navegue para Authentication:**
   - No menu lateral esquerdo, clique em **"Authentication"**
   - Se for a primeira vez, clique em **"Get Started"**

   **b) Configure os Provedores de Login:**
   - Clique na aba **"Sign-in method"**
   - Você verá uma lista de provedores

### 3. **Habilitar Email/Password** ⚠️ **OBRIGATÓRIO**
   
   ```
   📧 Email/Password: DISABLED ❌
   ```
   
   **Como habilitar:**
   - Clique em **"Email/Password"**
   - Toggle **"Enable"** para **ATIVO**
   - Clique **"Save"**
   
   ✅ **Resultado esperado:**
   ```
   📧 Email/Password: ENABLED ✅
   ```

### 4. **Habilitar Google OAuth** (Opcional)
   
   **Como habilitar:**
   - Clique em **"Google"**
   - Toggle **"Enable"** para **ATIVO**
   - **Project support email**: Selecione seu email
   - Clique **"Save"**

### 5. **Configurar Firestore Database**
   
   **a) Navegue para Firestore:**
   - No menu lateral, clique em **"Firestore Database"**
   - Clique **"Create database"**
   
   **b) Modo de Segurança:**
   - Escolha **"Start in test mode"** (para desenvolvimento)
   - Clique **"Next"**
   
   **c) Localização:**
   - Escolha **"us-central1"** ou região mais próxima
   - Clique **"Done"**

### 6. **Configurar Storage** (Opcional)
   
   - No menu lateral, clique em **"Storage"**
   - Clique **"Get started"**
   - Escolha **"Start in test mode"**
   - Selecione localização
   - Clique **"Done"**

## 🔧 Verificação da Configuração

### **Checklist - Authentication:**
- ✅ **Email/Password**: ENABLED
- ✅ **Google**: ENABLED (se quiser OAuth)
- ✅ **Authorized domains**: localhost deve estar listado

### **Checklist - Firestore:**
- ✅ **Database criado**
- ✅ **Regras em test mode**

### **Checklist - Projeto:**
- ✅ **Project ID**: projeto-estrutura-c2f18
- ✅ **API Key**: AIzaSyCrkhI_PJ8ogcBHjEy2gZPyTzli_yVTrjA

## 🧪 Como Testar

### **1. Teste no Console Firebase:**
- Authentication > Users
- Deve estar vazio inicialmente

### **2. Teste na Aplicação:**
```bash
# Reinicie o servidor
npm run dev

# Acesse: http://localhost:3000
# Tente criar uma conta nova
```

### **3. Logs para Debug:**
- Abra **DevTools** (F12)
- Vá para **Console**
- Tente criar conta
- Observe os logs detalhados

## 🚨 Erros Comuns e Soluções

### **Erro 400: auth/operation-not-allowed**
**❌ Causa:** Email/Password não habilitado
**✅ Solução:** Habilite Email/Password no Console

### **Erro 400: auth/invalid-api-key**
**❌ Causa:** API Key incorreta
**✅ Solução:** Verifique a configuração em firebase.ts

### **Erro: auth/unauthorized-domain**
**❌ Causa:** localhost não autorizado
**✅ Solução:** 
1. Authentication > Settings > Authorized domains
2. Adicione `localhost` se não estiver listado

### **Erro de CORS**
**❌ Causa:** Configuração de domínios
**✅ Solução:** Aguarde alguns minutos após configuração

## 📱 Regras de Segurança (Depois de testar)

### **Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuários autenticados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### **Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## ✅ Confirmação Final

Após configurar tudo:

1. **Console do Firebase** deve mostrar:
   - Authentication habilitado
   - Email/Password ativo
   - Firestore criado

2. **Aplicação** deve:
   - Carregar sem erro 404
   - Mostrar tela de login/registro
   - Criar conta sem erro 400

## 🆘 Ainda com Problemas?

1. **Limpe o cache do navegador**
2. **Aguarde 5-10 minutos** após configuração
3. **Verifique se está usando o projeto correto**
4. **Confira se a API Key está correta**

**Mensagem de sucesso esperada:** 
```
✅ "Conta criada com sucesso!"
``` 