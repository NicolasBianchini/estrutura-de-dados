import { Timestamp } from "firebase/firestore";

// Tipo base para documentos do Firestore
export interface FirebaseDocument {
    id?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

// Tipos para Storage
export interface UploadProgress {
    bytesTransferred: number;
    totalBytes: number;
    progress: number;
}

export interface UploadResult {
    downloadURL: string;
    fullPath: string;
    name: string;
}

// Utilitário para converter Timestamp do Firebase para Date
export const timestampToDate = (timestamp: Timestamp | null | undefined): Date | null => {
    if (!timestamp) return null;
    return timestamp.toDate();
};

// Utilitário para converter Date para Timestamp do Firebase
export const dateToTimestamp = (date: Date | null | undefined): Timestamp | null => {
    if (!date) return null;
    return Timestamp.fromDate(date);
}; 