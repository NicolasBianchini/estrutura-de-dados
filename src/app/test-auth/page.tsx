"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-firebase-auth";

export default function TestAuthPage() {
    const [email, setEmail] = useState("admin@test.com");
    const [password, setPassword] = useState("123456");
    const [name, setName] = useState("Admin Teste");
    const { signUp, signIn, user, authLoading } = useAuth();

    const handleSignUp = async () => {
        console.log("Tentando criar usuário...");
        const result = await signUp(email, password, name, "admin");
        console.log("Resultado do cadastro:", result);
    };

    const handleSignIn = async () => {
        console.log("Tentando fazer login...");
        const result = await signIn(email, password);
        console.log("Resultado do login:", result);
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Teste de Autenticação</h1>

            {user ? (
                <div className="mb-4 p-4 bg-green-100 rounded">
                    <p>Usuário logado: {user.name} ({user.email})</p>
                    <p>Role: {user.role}</p>
                </div>
            ) : (
                <div className="mb-4 p-4 bg-gray-100 rounded">
                    <p>Nenhum usuário logado</p>
                </div>
            )}

            <div className="space-y-4">
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    placeholder="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="flex gap-2">
                    <Button
                        onClick={handleSignUp}
                        disabled={authLoading}
                        variant="outline"
                    >
                        Criar Conta
                    </Button>
                    <Button
                        onClick={handleSignIn}
                        disabled={authLoading}
                    >
                        Login
                    </Button>
                </div>
            </div>
        </div>
    );
} 