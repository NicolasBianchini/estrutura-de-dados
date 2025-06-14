// Exemplos de uso do Firebase configurado
// Este arquivo mostra como usar o Firebase para Storage e Firestore
// mantendo o BetterAuth para autenticação

import {
    addDocument,
    deleteDocument,
    getDocument,
    getDocuments,
    updateDocument
} from "@/helpers/firestore";
import { FirebaseDocument } from "@/types/firebase";

// Exemplo de interface para um documento
interface ExampleDocument extends FirebaseDocument {
    title: string;
    description: string;
    userId: string; // ID do usuário do BetterAuth
}

// Exemplo de uso das funções do Firestore
export const firestoreExamples = {
    // Adicionar um documento
    async addExample(userId: string, title: string, description: string) {
        const id = await addDocument<ExampleDocument>("examples", {
            title,
            description,
            userId,
        });
        return id;
    },

    // Obter um documento específico
    async getExample(id: string) {
        const example = await getDocument<ExampleDocument>("examples", id);
        return example;
    },

    // Obter todos os documentos de um usuário
    async getUserExamples(userId: string) {
        // Aqui você pode usar a função getDocumentsByField se implementada
        const examples = await getDocuments<ExampleDocument>("examples");
        return examples.filter(example => example.userId === userId);
    },

    // Atualizar um documento
    async updateExample(id: string, updates: Partial<ExampleDocument>) {
        await updateDocument<ExampleDocument>("examples", id, updates);
    },

    // Deletar um documento
    async deleteExample(id: string) {
        await deleteDocument("examples", id);
    },
};

// Exemplo de uso do Firebase Storage
export const storageExamples = {
    // Upload de imagem de perfil
    uploadProfileImage: async (userId: string) => {
        // Use o hook useFirebaseUpload em componentes React
        const path = `users/${userId}/profile`;
        return path; // Retorna o caminho onde o arquivo será salvo
    },

    // Upload de documentos
    uploadDocument: async (userId: string) => {
        const path = `users/${userId}/documents`;
        return path;
    },
};

// Exemplo de como integrar com BetterAuth
export const authIntegration = {
    // Quando usuário faz login via BetterAuth, você pode:
    // 1. Salvar dados adicionais no Firestore
    // 2. Fazer upload de arquivos para pasta específica do usuário
    // 3. Sincronizar dados entre PostgreSQL (BetterAuth) e Firestore

    async syncUserData(userId: string, userData: Record<string, unknown>) {
        // Exemplo: salvar dados adicionais do usuário no Firestore
        // mantendo o BetterAuth como sistema principal de auth
        await addDocument("user_profiles", {
            userId,
            ...userData,
        });
    },
};

/*
IMPORTANTE: 
- BetterAuth continua sendo usado para autenticação (login/logout/sessões)
- Firebase é usado para Storage (arquivos) e Firestore (dados extras)
- PostgreSQL + Drizzle continua sendo o banco principal
- Firestore pode ser usado para dados não-críticos ou cache
- Firebase Storage para arquivos como imagens, documentos, etc.
*/ 