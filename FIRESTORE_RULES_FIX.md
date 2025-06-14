# 🔥 Corrigir Regras do Firestore

## ⚠️ ERRO: Missing or insufficient permissions

O Firestore está bloqueando as operações de escrita. Precisa configurar as regras de segurança.

## 🚀 Solução Rápida

### **1. Acesse o Firebase Console**
- Vá para: https://console.firebase.google.com
- Selecione seu projeto: `projeto-estrutura-c2f18`

### **2. Configure as Regras do Firestore**
- No menu lateral, clique **"Firestore Database"**
- Clique na aba **"Rules"**
- Substitua as regras existentes por estas (TEMPORÁRIAS para desenvolvimento):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // REGRAS TEMPORÁRIAS PARA DESENVOLVIMENTO
    // ⚠️ MUDE PARA PRODUÇÃO DEPOIS
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### **3. Publique as Regras**
- Clique **"Publish"**
- Aguarde alguns segundos para propagação

## ✅ Teste Imediato

Após publicar as regras:
1. Volte para sua aplicação
2. Tente criar uma conta novamente
3. Deve funcionar agora!

## 🔒 Regras de Produção (Depois de testar)

Quando tudo estiver funcionando, substitua por regras mais seguras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem acessar apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Outras coleções - apenas usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚨 IMPORTANTE

As regras `allow read, write: if true;` são **INSEGURAS** mas necessárias para teste inicial. 
**SEMPRE mude para regras seguras** depois de testar! 