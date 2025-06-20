"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/hooks/use-firebase-auth";

export default function NewSubscriptionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
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
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="mb-8 w-full max-w-3xl text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Desbloqueie todo o potencial da sua clínica
        </h1>
        <p className="mb-6 text-xl text-gray-600">
          Para continuar utilizando nossa plataforma e transformar a gestão do
          seu consultório, é necessário escolher um plano que se adapte às suas
          necessidades.
        </p>
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-medium text-amber-800">
            🚀{" "}
            <span className="font-semibold">
              Profissionais que utilizam nossa plataforma economizam em média 15
              horas por semana
            </span>{" "}
            em tarefas administrativas. Não perca mais tempo com agendas manuais
            e processos ineficientes!
          </p>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Planos em breve</h2>
          <p className="text-gray-600">
            Estamos preparando os melhores planos para você.
            Entre em contato: {user.email}
          </p>
        </div>
      </div>

      <div className="mt-8 max-w-lg text-center">
        <p className="text-sm text-gray-500">
          Junte-se a mais de 2.000 profissionais de saúde que já transformaram
          sua rotina com nossa solução. Garantia de satisfação de 30 dias ou seu
          dinheiro de volta.
        </p>
      </div>
    </div>
  );
}
