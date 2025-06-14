"use client";

import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PageContainer,
    PageContent,
    PageDescription,
    PageHeader,
    PageHeaderContent,
    PageTitle,
} from "@/components/ui/page-container";
import { useAuth } from "@/hooks/use-firebase-auth";
import { db } from "@/lib/firebase";

interface AppointmentData {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    lawyerId: string;
    lawyerName: string;
    specialty: string;
    preferredDate: string;
    preferredTime: string;
    description: string;
    price: string;
    status: string;
    [key: string]: unknown;
}

export default function DebugAppointmentsPage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentData[]>([]);
    const [loading, setLoading] = useState(false);

    const loadAllAppointments = async () => {
        setLoading(true);
        try {
            const appointmentsRef = collection(db, "agendamentos");
            const snapshot = await getDocs(appointmentsRef);

            const appointmentsList: AppointmentData[] = [];
            snapshot.forEach((doc) => {
                appointmentsList.push({
                    id: doc.id,
                    ...doc.data()
                } as AppointmentData);
            });

            console.log("Todos os agendamentos:", appointmentsList);
            setAppointments(appointmentsList);
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllAppointments();
    }, []);

    const userAppointments = appointments.filter(apt => apt.userId === user?.id);

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Debug - Agendamentos</PageTitle>
                    <PageDescription>
                        Página de debug para verificar os dados dos agendamentos
                    </PageDescription>
                </PageHeaderContent>
            </PageHeader>

            <PageContent>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <Button onClick={loadAllAppointments} disabled={loading}>
                            {loading ? "Carregando..." : "Recarregar Dados"}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações do Usuário</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                                    {JSON.stringify(user, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Estatísticas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p>Total de agendamentos: {appointments.length}</p>
                                    <p>Agendamentos do usuário: {userAppointments.length}</p>
                                    <p>ID do usuário: {user?.id || "Não encontrado"}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Todos os Agendamentos ({appointments.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-96 overflow-auto">
                                {appointments.map((appointment, index) => (
                                    <div key={appointment.id} className="border p-4 rounded">
                                        <h4 className="font-medium">Agendamento {index + 1}</h4>
                                        <div className="text-sm space-y-1 mt-2">
                                            <p><strong>ID:</strong> {appointment.id}</p>
                                            <p><strong>User ID:</strong> {appointment.userId}</p>
                                            <p><strong>User Name:</strong> {appointment.userName}</p>
                                            <p><strong>Lawyer:</strong> {appointment.lawyerName}</p>
                                            <p><strong>Status:</strong> {appointment.status}</p>
                                            <p><strong>Date:</strong> {appointment.preferredDate}</p>
                                            <p><strong>Time:</strong> {appointment.preferredTime}</p>
                                            <p className={appointment.userId === user?.id ? "text-green-600 font-bold" : ""}>
                                                {appointment.userId === user?.id ? "✅ PERTENCE AO USUÁRIO ATUAL" : "❌ Não pertence ao usuário atual"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Agendamentos do Usuário Atual ({userAppointments.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {userAppointments.length === 0 ? (
                                    <p className="text-muted-foreground">Nenhum agendamento encontrado para este usuário.</p>
                                ) : (
                                    userAppointments.map((appointment, index) => (
                                        <div key={appointment.id} className="border p-4 rounded bg-green-50">
                                            <h4 className="font-medium">Agendamento {index + 1}</h4>
                                            <div className="text-sm space-y-1 mt-2">
                                                <p><strong>Lawyer:</strong> {appointment.lawyerName}</p>
                                                <p><strong>Status:</strong> {appointment.status}</p>
                                                <p><strong>Date:</strong> {appointment.preferredDate}</p>
                                                <p><strong>Time:</strong> {appointment.preferredTime}</p>
                                                <p><strong>Description:</strong> {appointment.description}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </PageContent>
        </PageContainer>
    );
} 