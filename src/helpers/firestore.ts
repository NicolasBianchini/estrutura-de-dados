import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { FirebaseDocument } from "@/types/firebase";

// Função genérica para adicionar documento
export const addDocument = async <T extends FirebaseDocument>(
    collectionName: string,
    data: Omit<T, "id" | "createdAt" | "updatedAt">
) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Erro ao adicionar documento:", error);
        throw error;
    }
};

// Função genérica para obter documento por ID
export const getDocument = async <T extends FirebaseDocument>(
    collectionName: string,
    id: string
): Promise<T | null> => {
    try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as T;
        }
        return null;
    } catch (error) {
        console.error("Erro ao obter documento:", error);
        throw error;
    }
};

// Função genérica para obter todos os documentos de uma coleção
export const getDocuments = async <T extends FirebaseDocument>(
    collectionName: string,
    limitCount?: number
): Promise<T[]> => {
    try {
        let q = query(collection(db, collectionName), orderBy("createdAt", "desc"));

        if (limitCount) {
            q = query(q, limit(limitCount));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as T[];
    } catch (error) {
        console.error("Erro ao obter documentos:", error);
        throw error;
    }
};

// Função genérica para atualizar documento
export const updateDocument = async <T extends FirebaseDocument>(
    collectionName: string,
    id: string,
    data: Partial<Omit<T, "id" | "createdAt">>
) => {
    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Erro ao atualizar documento:", error);
        throw error;
    }
};

// Função genérica para deletar documento
export const deleteDocument = async (collectionName: string, id: string) => {
    try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Erro ao deletar documento:", error);
        throw error;
    }
};

// Função para buscar documentos com filtro
export const getDocumentsByField = async <T extends FirebaseDocument>(
    collectionName: string,
    fieldName: string,
    value: string | number | boolean,
    limitCount?: number
): Promise<T[]> => {
    try {
        let q = query(
            collection(db, collectionName),
            where(fieldName, "==", value),
            orderBy("createdAt", "desc")
        );

        if (limitCount) {
            q = query(q, limit(limitCount));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as T[];
    } catch (error) {
        console.error("Erro ao buscar documentos:", error);
        throw error;
    }
}; 