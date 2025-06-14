"use client";

import bcrypt from "bcryptjs";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { authenticate } from "@/actions/authenticate";
import { sendEmailConfirmationAction } from "@/actions/send-email-confirmation";
import { db } from "@/lib/firebase";

interface UserData {
    id: string;
    email: string;
    name: string;
    role: "admin" | "user";
    createdAt: Date;
    updatedAt: Date;
}

// Função para hash de senha usando bcrypt
const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};



export const useAuth = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);

    console.log("=== USE AUTH HOOK ===");
    console.log("User state:", user);
    console.log("Loading state:", loading);
    console.log("Auth loading state:", authLoading);

    useEffect(() => {
        console.log("=== USE AUTH EFFECT - CHECKING SESSION ===");
        checkAuthSession();
    }, []);

    const checkAuthSession = async () => {
        try {
            console.log("=== CHECK AUTH SESSION ===");
            const token = localStorage.getItem("auth_token");
            console.log("Token encontrado:", token);

            if (!token) {
                console.log("Nenhum token encontrado, definindo loading como false");
                setLoading(false);
                return;
            }

            console.log("Verificando token no Firestore...");
            // Verificar se o token é válido
            const sessionDoc = await getDoc(doc(db, "sessions", token));
            if (!sessionDoc.exists()) {
                console.log("Sessão não encontrada no Firestore, removendo token");
                localStorage.removeItem("auth_token");
                setLoading(false);
                return;
            }

            const sessionData = sessionDoc.data();
            const expiresAt = new Date(sessionData.expiresAt.seconds * 1000);
            console.log("Sessão expira em:", expiresAt);
            console.log("Data atual:", new Date());

            if (expiresAt < new Date()) {
                console.log("Token expirado, removendo sessão");
                // Token expirado
                localStorage.removeItem("auth_token");
                await setDoc(doc(db, "sessions", token), { deleted: true }, { merge: true });
                setLoading(false);
                return;
            }

            console.log("Token válido, buscando dados do usuário...");
            // Buscar dados do usuário
            const userDoc = await getDoc(doc(db, "users", sessionData.userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log("Dados do usuário encontrados:", userData.email);

                // Converter timestamps do Firestore para objetos Date simples
                const convertTimestamp = (timestamp: unknown) => {
                    if (!timestamp) return new Date();
                    if (typeof timestamp === 'object' && timestamp !== null && 'seconds' in timestamp) {
                        const ts = timestamp as { seconds: number };
                        return new Date(ts.seconds * 1000);
                    }
                    return new Date(timestamp as string | number | Date);
                };

                const userDataClean: UserData = {
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    role: userData.role,
                    createdAt: convertTimestamp(userData.createdAt),
                    updatedAt: convertTimestamp(userData.updatedAt),
                };

                console.log("Definindo usuário no estado:", userDataClean);
                setUser(userDataClean);
            } else {
                console.log("Usuário não encontrado no Firestore");
            }
        } catch (error) {
            console.error("Erro ao verificar sessão:", error);
            localStorage.removeItem("auth_token");
        } finally {
            console.log("Definindo loading como false");
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, name: string, role: "admin" | "user" = "user") => {
        setAuthLoading(true);
        try {
            // Verificar se o email já existe
            const emailQuery = query(collection(db, "users"), where("email", "==", email));
            const emailSnapshot = await getDocs(emailQuery);

            if (!emailSnapshot.empty) {
                toast.error("E-mail já está em uso");
                return { success: false, error: "E-mail já está em uso" };
            }

            // Hash da senha
            const hashedPassword = await hashPassword(password);

            // Criar novo usuário
            const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const userData: UserData = {
                id: userId,
                email: email,
                name: name,
                role: role,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Gerar token de confirmação
            const confirmationToken = uuidv4();

            // Salvar usuário no Firestore com emailVerified: false e confirmationToken
            await setDoc(doc(db, "users", userId), {
                ...userData,
                password: hashedPassword,
                emailVerified: false,
                status: "pending",
                confirmationToken,
            });

            // Montar URL de confirmação
            const confirmationUrl = `${window.location.origin}/confirmar-email?token=${confirmationToken}`;
            await sendEmailConfirmationAction({
                userEmail: email,
                userName: name,
                confirmationUrl,
            });

            toast.success("Conta criada! Verifique seu e-mail para ativar a conta. Caso não veja o e-mail, olhe sua caixa de spam.");
            return { success: true, user: userData };
        } catch (error) {
            console.error("Erro ao criar conta:", error);
            toast.error("Erro ao criar conta");
            return { success: false, error: "Erro ao criar conta" };
        } finally {
            setAuthLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        setAuthLoading(true);
        try {
            console.log("Tentando fazer login com:", email);

            // Usar Server Action para autenticação
            const result = await authenticate({ email, password });

            if (!result?.data?.success) {
                toast.error(result?.data?.error || "E-mail ou senha inválidos");
                return { success: false, error: result?.data?.error || "E-mail ou senha inválidos" };
            }

            // Salvar token e dados do usuário
            if (result.data.token && result.data.user) {
                localStorage.setItem("auth_token", result.data.token);
                setUser(result.data.user as UserData);

                console.log("Login realizado com sucesso para:", result.data.user.email);
                console.log("Estado do usuário atualizado:", result.data.user);
                console.log("Token salvo:", result.data.token);

                toast.success("Login realizado com sucesso!");
                return { success: true, user: result.data.user };
            } else {
                console.log("Dados incompletos:", { token: result.data.token, user: result.data.user });
                toast.error("Erro na autenticação");
                return { success: false, error: "Erro na autenticação" };
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            toast.error("Erro ao fazer login");
            return { success: false, error: "Erro ao fazer login" };
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (token) {
                // Marcar sessão como deletada
                await setDoc(doc(db, "sessions", token), { deleted: true }, { merge: true });
                localStorage.removeItem("auth_token");
            }
            setUser(null);
            toast.success("Logout realizado com sucesso!");
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            toast.error("Erro ao fazer logout");
        }
    };

    const isAdmin = () => {
        return user?.role === "admin";
    };

    return {
        user,
        userData: user, // Para compatibilidade com o código existente
        loading,
        authLoading,
        signUp,
        signIn,
        logout,
        isAdmin,
    };
}; 