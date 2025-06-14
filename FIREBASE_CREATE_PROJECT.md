# 🔥 Criar Novo Projeto Firebase

## ⚠️ ERRO: auth/configuration-not-found

O projeto `projeto-estrutura-c2f18` não existe ou não está acessível. Vamos criar um novo:

## 🚀 Passo a Passo - Criar Projeto Firebase

### 1. **Acesse o Firebase Console**
   - Vá para: https://console.firebase.google.com
   - Faça login com sua conta Google

### 2. **Criar Novo Projeto**
   - Clique em **"Create a project"** ou **"Adicionar projeto"**
   - **Project name**: `ProjetoFGJN` (ou nome de sua escolha)
   - **Project ID**: Será gerado automaticamente (anote este ID)
   - Clique **"Continue"**

### 3. **Google Analytics** (Opcional)
   - Escolha **"Enable Google Analytics"** ou **"Not now"**
   - Se habilitou, configure a conta Analytics
   - Clique **"Create project"**

### 4. **Aguarde a Criação**
   - Aguarde alguns segundos
   - Clique **"Continue"** quando pronto

### 5. **Adicionar App Web**
   - No dashboard do projeto, clique no ícone **"Web" (</>)**
   - **App nickname**: `ProjetoFGJN-Web`
   - **Marque**: "Also set up Firebase Hosting" (opcional)
   - Clique **"Register app"**

### 6. **Copiar Configuração**
   - Na tela "Add Firebase SDK", você verá um código similar a:
   
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "seu-projeto.firebaseapp.com",
     projectId: "seu-projeto-id",
     storageBucket: "seu-projeto.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc..."
   };
   ```
   
   - **COPIE ESSAS INFORMAÇÕES** ⚠️

### 7. **Habilitar Authentication**
   - No menu lateral, clique **"Authentication"**
   - Clique **"Get started"**
   - Aba **"Sign-in method"**
   - Clique **"Email/Password"**
   - Toggle **"Enable"** 
   - Clique **"Save"**

### 8. **Habilitar Firestore**
   - No menu lateral, clique **"Firestore Database"**
   - Clique **"Create database"**
   - Escolha **"Start in test mode"**
   - Selecione localização (ex: us-central1)
   - Clique **"Done"**

### 9. **Habilitar Storage** (Opcional)
   - No menu lateral, clique **"Storage"**
   - Clique **"Get started"**
   - Escolha **"Start in test mode"**
   - Clique **"Done"**

## ⚡ Próximo Passo: Atualizar Configuração

Após criar o projeto, você precisa **atualizar o arquivo de configuração** com as novas credenciais.

**Arquivo**: `src/lib/firebase.ts`

Substitua as configurações antigas pelas novas que você copiou do passo 6. 