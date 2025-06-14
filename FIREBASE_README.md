# 🔥 Firebase Configuration

Este projeto tem o Firebase configurado para trabalhar em conjunto com o BetterAuth, mantendo a autenticação no BetterAuth e usando Firebase para Storage e Firestore.

## 📋 Configuração Atual

### ✅ Configurado
- **Firebase App** - Inicializado com suas credenciais
- **Firestore** - Banco de dados NoSQL para dados extras
- **Storage** - Para upload de arquivos (imagens, documentos)
- **Hooks personalizados** - Para facilitar o uso
- **Helpers** - Funções utilitárias para CRUD

### ❌ Não Configurado (Propositalmente)
- **Firebase Auth** - Mantemos o BetterAuth para autenticação

## 🚀 Como Usar

### 1. Firebase Storage (Upload de Arquivos)

```tsx
// Em um componente React
import { useFirebaseUpload } from "@/hooks/use-firebase-upload";

function UploadComponent() {
  const { uploadFile, uploading, progress } = useFirebaseUpload();

  const handleUpload = async (file: File) => {
    const result = await uploadFile(file, "images", 
      (result) => {
        console.log("Upload realizado:", result.downloadURL);
      },
      (error) => {
        console.error("Erro no upload:", error);
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files?.[0])} />
      {uploading && <p>Uploading... {progress?.progress}%</p>}
    </div>
  );
}
```

### 2. Firestore (Banco de Dados)

```tsx
// Exemplo de uso
import { addDocument, getDocuments } from "@/helpers/firestore";

// Adicionar documento
const addExample = async () => {
  const id = await addDocument("examples", {
    title: "Meu Exemplo",
    description: "Descrição do exemplo",
    userId: "user123", // ID do usuário do BetterAuth
  });
};

// Buscar documentos
const getExamples = async () => {
  const examples = await getDocuments("examples");
  return examples;
};
```

## 🔧 Arquivos Criados

- `src/lib/firebase.ts` - Configuração principal do Firebase
- `src/types/firebase.ts` - Tipos TypeScript para Firebase
- `src/hooks/use-firebase-upload.ts` - Hook para upload de arquivos
- `src/helpers/firestore.ts` - Helpers para operações no Firestore
- `src/examples/firebase-usage.ts` - Exemplos de uso

## 🔒 Integração com BetterAuth

O Firebase foi configurado para complementar o BetterAuth:

- **BetterAuth**: Autenticação, login, logout, sessões
- **PostgreSQL + Drizzle**: Dados principais da aplicação
- **Firebase Firestore**: Dados extras, cache, logs
- **Firebase Storage**: Arquivos, imagens, documentos

## 📝 Próximos Passos

1. **Configure as regras do Firebase**:
   - Acesse o [Console do Firebase](https://console.firebase.google.com)
   - Configure as regras de segurança do Firestore e Storage

2. **Regras de Exemplo**:

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ATENÇÃO: Mude para suas regras de segurança
    }
  }
}

// Storage Rules  
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // ATENÇÃO: Mude para suas regras de segurança
    }
  }
}
```

3. **Variáveis de Ambiente** (Opcional):
   Para maior segurança, mova as credenciais para `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCrkhI_PJ8ogcBHjEy2gZPyTzli_yVTrjA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=projeto-estrutura-c2f18.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=projeto-estrutura-c2f18
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=projeto-estrutura-c2f18.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=283711294023
NEXT_PUBLIC_FIREBASE_APP_ID=1:283711294023:web:27eb70790ddb25ff66ff62
```

## ⚠️ Importante

- Sempre configure regras de segurança adequadas no Firebase Console
- Nunca exponha credenciais sensíveis no código
- Use as funções helpers criadas para manter consistência
- O BetterAuth continua sendo o sistema principal de autenticação

## 🆘 Suporte

Se precisar de ajuda com Firebase:
- [Documentação Firebase](https://firebase.google.com/docs)
- [Console Firebase](https://console.firebase.google.com)
- Veja os exemplos em `src/examples/firebase-usage.ts` 