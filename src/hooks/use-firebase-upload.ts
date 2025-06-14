"use client";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { toast } from "sonner";

import { storage } from "@/lib/firebase";
import { UploadProgress, UploadResult } from "@/types/firebase";

export const useFirebaseUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<UploadProgress | null>(null);

    const uploadFile = async (
        file: File,
        path: string,
        onSuccess?: (result: UploadResult) => void,
        onError?: (error: Error) => void
    ): Promise<UploadResult | null> => {
        if (!file) {
            toast.error("Nenhum arquivo selecionado");
            return null;
        }

        setUploading(true);
        setProgress(null);

        try {
            const storageRef = ref(storage, `${path}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progressData: UploadProgress = {
                            bytesTransferred: snapshot.bytesTransferred,
                            totalBytes: snapshot.totalBytes,
                            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                        };
                        setProgress(progressData);
                    },
                    (error) => {
                        setUploading(false);
                        setProgress(null);
                        toast.error("Erro ao fazer upload do arquivo");
                        onError?.(error);
                        reject(error);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            const result: UploadResult = {
                                downloadURL,
                                fullPath: uploadTask.snapshot.ref.fullPath,
                                name: file.name,
                            };

                            setUploading(false);
                            setProgress(null);
                            toast.success("Arquivo enviado com sucesso!");
                            onSuccess?.(result);
                            resolve(result);
                        } catch (error) {
                            setUploading(false);
                            setProgress(null);
                            toast.error("Erro ao obter URL do arquivo");
                            onError?.(error as Error);
                            reject(error);
                        }
                    }
                );
            });
        } catch (error) {
            setUploading(false);
            setProgress(null);
            toast.error("Erro ao iniciar upload");
            onError?.(error as Error);
            return null;
        }
    };

    return {
        uploadFile,
        uploading,
        progress,
    };
}; 