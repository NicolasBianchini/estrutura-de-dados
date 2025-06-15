"use client";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

import { AlertCircle, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { getUserAppointments } from "@/actions/get-user-appointments";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PageContainer,
    PageContent,
    PageDescription,
    PageHeader,
    PageHeaderContent,
    PageTitle,
} from "@/components/ui/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-firebase-auth";

type Appointment = {
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
    requestedAt: Date;
    updatedAt: Date;
    confirmedAt: Date | null;
    notes: string;
    dateTime?: string;
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case "confirmed":
            return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Confirmado</Badge>;
        case "pending":
            return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Pendente</Badge>;
        case "cancelled":
            return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Cancelado</Badge>;
        case "completed":
            return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Concluído</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export default function MyAppointmentsPage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<{
        confirmed: Appointment[];
        pending: Appointment[];
        cancelled: Appointment[];
        completed: Appointment[];
    }>({
        confirmed: [],
        pending: [],
        cancelled: [],
        completed: [],
    });

    const { execute: loadAppointments, isPending } = useAction(getUserAppointments, {
        onSuccess: (result) => {
            console.log("Resultado da busca de agendamentos:", result);
            if (result.data?.success) {
                console.log("Dados dos agendamentos:", result.data.data);
                setAppointments({
                    confirmed: result.data.data.confirmed,
                    pending: result.data.data.pending,
                    cancelled: result.data.data.cancelled,
                    completed: result.data.data.completed,
                });
            }
        },
        onError: (error) => {
            console.error("Erro ao carregar agendamentos:", error);
        },
    });

    useEffect(() => {
        console.log("User data:", user);
        if (user?.id) {
            console.log("Carregando agendamentos para o usuário:", user.id);
            loadAppointments({ userId: user.id });
        } else {
            console.log("Usuário não encontrado ou sem ID");
        }
    }, [user, loadAppointments]);

    if (isPending) {
        return (
            <PageContainer>
                <PageHeader>
                    <PageHeaderContent>
                        <PageTitle>Meus Agendamentos</PageTitle>
                        <PageDescription>
                            Acompanhe suas consultas confirmadas e solicitações pendentes
                        </PageDescription>
                    </PageHeaderContent>
                </PageHeader>
                <PageContent>
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Carregando agendamentos...</span>
                    </div>
                </PageContent>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Meus Agendamentos</PageTitle>
                    <PageDescription>
                        Acompanhe suas consultas confirmadas e solicitações pendentes
                    </PageDescription>
                </PageHeaderContent>
            </PageHeader>

            <PageContent>
                <Tabs defaultValue="confirmed" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="confirmed">
                            <span className="block sm:hidden">Confirmados ({appointments.confirmed.length})</span>
                            <span className="hidden sm:block">Agendamentos Confirmados ({appointments.confirmed.length})</span>
                        </TabsTrigger>
                        <TabsTrigger value="pending">
                            <span className="block sm:hidden">Pendentes ({appointments.pending.length})</span>
                            <span className="hidden sm:block">Solicitações Pendentes ({appointments.pending.length})</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="confirmed" className="space-y-4">
                        {appointments.confirmed.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">Nenhum agendamento confirmado</h3>
                                    <p className="text-muted-foreground text-center">
                                        Você ainda não tem consultas confirmadas. Solicite um agendamento para começar.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {appointments.confirmed.map((appointment) => (
                                    <Card key={appointment.id} className="w-full max-w-full">
                                        <CardHeader>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <CardTitle className="text-base sm:text-lg">{appointment.lawyerName}</CardTitle>
                                                {getStatusBadge(appointment.status)}
                                            </div>
                                            <CardDescription className="text-xs sm:text-sm">{appointment.specialty}</CardDescription>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-xs sm:text-sm">
                                                        {appointment.dateTime
                                                            ? dayjs(appointment.dateTime).tz("America/Sao_Paulo").format("DD/MM/YYYY")
                                                            : new Date(appointment.preferredDate).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-xs sm:text-sm">
                                                        {appointment.dateTime
                                                            ? dayjs(appointment.dateTime).tz("America/Sao_Paulo").format("HH:mm")
                                                            : appointment.preferredTime}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs sm:text-sm font-medium">{appointment.price}</span>
                                                </div>
                                            </div>

                                            {appointment.notes && (
                                                <div className="pt-2 border-t">
                                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                                        <strong>Observações:</strong> {appointment.notes}
                                                    </p>
                                                </div>
                                            )}

                                            {appointment.description && (
                                                <div className="pt-2 border-t">
                                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                                        <strong>Descrição do caso:</strong> {appointment.description}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-4">
                        {appointments.pending.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">Nenhuma solicitação pendente</h3>
                                    <p className="text-muted-foreground text-center">
                                        Você não tem solicitações de agendamento aguardando confirmação.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {appointments.pending.map((request) => (
                                    <Card key={request.id}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">{request.lawyerName}</CardTitle>
                                                {getStatusBadge(request.status)}
                                            </div>
                                            <CardDescription>{request.specialty}</CardDescription>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">Data solicitada: {new Date(request.preferredDate).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">Horário: {request.preferredTime}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">{request.price}</span>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t">
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    <strong>Descrição do caso:</strong>
                                                </p>
                                                <p className="text-sm">{request.description}</p>
                                            </div>

                                            <div className="pt-2 border-t">
                                                <p className="text-xs text-muted-foreground">
                                                    Solicitação enviada em: {new Date(request.requestedAt).toLocaleDateString('pt-BR')} às {new Date(request.requestedAt).toLocaleTimeString('pt-BR')}
                                                </p>
                                            </div>

                                            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                                <p className="text-sm text-yellow-800">
                                                    <AlertCircle className="h-4 w-4 inline mr-1" />
                                                    Aguardando confirmação do advogado. Você será notificado quando houver uma resposta.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </PageContent>
        </PageContainer>
    );
} 