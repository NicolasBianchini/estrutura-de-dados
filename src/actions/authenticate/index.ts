"use server";

import bcrypt from "bcryptjs";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { z } from "zod";

import { db } from "@/lib/firebase";
import { actionClient } from "@/lib/next-safe-action";

const authenticateSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
});

export const authenticate = actionClient
    .schema(authenticateSchema)
    .action(async ({ parsedInput }) => {
        try {
            console.log("=== AUTENTICAÇÃO SERVER ACTION ===");
            console.log("Email:", parsedInput.email);

            // Buscar usuário pelo email
            const emailQuery = query(collection(db, "users"), where("email", "==", parsedInput.email));
            const emailSnapshot = await getDocs(emailQuery);

            if (emailSnapshot.empty) {
                console.log("Usuário não encontrado");
                return { success: false, error: "E-mail ou senha inválidos" };
            }

            const userDoc = emailSnapshot.docs[0];
            const userData = userDoc.data();

            console.log("Usuário encontrado:", userData.email);
            console.log("Hash armazenado:", userData.password);
            console.log("Senha fornecida:", parsedInput.password);

            if (!userData.emailVerified || userData.status === "pending") {
                return { success: false, error: "Confirme seu e-mail antes de acessar." };
            }

            // Verificar senha usando bcrypt no servidor
            const isValidPassword = await bcrypt.compare(parsedInput.password, userData.password);
            console.log("Senha válida:", isValidPassword);

            if (!isValidPassword) {
                return { success: false, error: "E-mail ou senha inválidos" };
            }

            // Criar sessão
            const token = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

            await setDoc(doc(db, "sessions", token), {
                userId: userData.id,
                token: token,
                expiresAt: expiresAt,
                createdAt: new Date(),
            });

            // Converter timestamps do Firestore para objetos Date simples
            const convertTimestamp = (timestamp: unknown) => {
                if (!timestamp) return new Date();
                if (typeof timestamp === 'object' && timestamp !== null && 'seconds' in timestamp) {
                    const ts = timestamp as { seconds: number };
                    return new Date(ts.seconds * 1000);
                }
                return new Date(timestamp as string | number | Date);
            };

            const userDataClean = {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                role: userData.role,
                createdAt: convertTimestamp(userData.createdAt),
                updatedAt: convertTimestamp(userData.updatedAt),
            };

            console.log("Autenticação realizada com sucesso");
            return {
                success: true,
                user: userDataClean,
                token: token
            };
        } catch (error) {
            console.error("Erro na autenticação:", error);
            return { success: false, error: "Erro interno do servidor" };
        }
    }); 