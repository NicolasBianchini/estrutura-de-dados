"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/hooks/use-firebase-auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    console.log("=== PROTECTED ROUTE ===");
    console.log("Loading:", loading);
    console.log("User:", user);
    console.log("User exists:", !!user);

    useEffect(() => {
        console.log("=== PROTECTED ROUTE EFFECT ===");
        console.log("Loading:", loading);
        console.log("User:", user);

        if (!loading && !user) {
            console.log("Redirecionando para home - usuário não autenticado");
            router.push("/");
        } else if (!loading && user) {
            console.log("Usuário autenticado, permitindo acesso");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Será redirecionado
    }

    return <>{children}</>;
}; 