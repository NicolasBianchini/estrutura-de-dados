"use client";

import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";

export default function ConfirmarEmailPage() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const url = new URL(window.location.href);
        const token = url.searchParams.get("token");
        if (!token) {
            setStatus("error");
            setMessage("Token de confirmação não informado.");
            return;
        }

        async function confirmEmail() {
            try {
                const usersQuery = query(collection(db, "users"), where("confirmationToken", "==", token));
                const snapshot = await getDocs(usersQuery);
                if (snapshot.empty) {
                    setStatus("error");
                    setMessage("Token inválido ou já utilizado.");
                    return;
                }
                const userDoc = snapshot.docs[0];
                await updateDoc(doc(db, "users", userDoc.id), {
                    emailVerified: true,
                    status: "active",
                    confirmationToken: null,
                });
                setStatus("success");
                setMessage("E-mail confirmado com sucesso! Sua conta está ativada. Você já pode fazer login.");
            } catch {
                setStatus("error");
                setMessage("Erro ao confirmar e-mail. Tente novamente mais tarde.");
            }
        }
        confirmEmail();
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>Confirmação de E-mail</CardTitle>
                </CardHeader>
                <CardContent>
                    {status === "loading" ? (
                        <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Confirmando...</div>
                    ) : (
                        <div className={status === "success" ? "text-green-600" : "text-red-600"}>{message}</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 