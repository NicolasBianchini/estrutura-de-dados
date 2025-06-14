"use client";

import { Calendar, CalendarPlus, Clock, FileText, User } from "lucide-react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { getUserAppointments } from "@/actions/get-user-appointments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PageContainer,
    PageContent,
    PageDescription,
    PageHeader,
    PageHeaderContent,
    PageTitle,
} from "@/components/ui/page-container";
import { useAuth } from "@/hooks/use-firebase-auth";

type Appointment = {
    lawyerName: string;
    specialty: string;
    preferredDate: string;
    preferredTime: string;
    // Adicione outros campos usados conforme necessário
};

export default function UserDashboardPage() {
    const { user } = useAuth();
    const [userStats, setUserStats] = useState<{
        totalAppointments: number;
        pendingRequests: number;
        confirmedAppointments: number;
        nextAppointment: Appointment | null;
    }>({
        totalAppointments: 0,
        pendingRequests: 0,
        confirmedAppointments: 0,
        nextAppointment: null,
    });

    const { execute: loadAppointments, isPending } = useAction(getUserAppointments, {
        onSuccess: (result) => {
            if (result.data?.success) {
                const stats = result.data.data.stats;
                const confirmed: Appointment[] = result.data.data.confirmed;

                // Encontrar próximo agendamento
                const nextAppointment = confirmed.length > 0
                    ? [...confirmed].sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime())[0]
                    : null;

                setUserStats({
                    totalAppointments: stats.total,
                    pendingRequests: stats.pending,
                    confirmedAppointments: stats.confirmed,
                    nextAppointment,
                });
            }
        },
        onError: (error) => {
            console.error("Erro ao carregar estatísticas:", error);
        },
    });

    useEffect(() => {
        if (user?.id) {
            loadAppointments({ userId: user.id });
        }
    }, [user?.id, loadAppointments]);

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Bem-vindo, {user?.name || "Usuário"}!</PageTitle>
                    <PageDescription>
                        Gerencie suas consultas jurídicas e acompanhe seus agendamentos
                    </PageDescription>
                </PageHeaderContent>
            </PageHeader>

            <PageContent>
                {/* Ação rápida */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-900">
                            <CalendarPlus className="h-5 w-5" />
                            Precisa de ajuda jurídica?
                        </CardTitle>
                        <CardDescription className="text-blue-700">
                            Solicite uma consulta com um de nossos advogados especializados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/request-appointment">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <CalendarPlus className="h-4 w-4 mr-2" />
                                Solicitar Agendamento
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Estatísticas */}
                {isPending ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{userStats.totalAppointments}</div>
                                <p className="text-xs text-muted-foreground">
                                    Consultas realizadas e agendadas
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{userStats.pendingRequests}</div>
                                <p className="text-xs text-muted-foreground">
                                    Aguardando confirmação
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Agendamentos Confirmados</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{userStats.confirmedAppointments}</div>
                                <p className="text-xs text-muted-foreground">
                                    Consultas confirmadas
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Próximo agendamento */}
                {userStats.nextAppointment && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Próxima Consulta
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">{userStats.nextAppointment.lawyerName}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{userStats.nextAppointment.specialty}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(userStats.nextAppointment.preferredDate).toLocaleDateString('pt-BR')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {userStats.nextAppointment.preferredTime}
                                        </span>
                                    </div>
                                </div>
                                <Link href="/my-appointments">
                                    <Button variant="outline" size="sm">
                                        Ver Detalhes
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Links rápidos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <Link href="/my-appointments">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Calendar className="h-5 w-5" />
                                    Meus Agendamentos
                                </CardTitle>
                                <CardDescription>
                                    Visualize todas as suas consultas e solicitações
                                </CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <Link href="/profile">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <User className="h-5 w-5" />
                                    Meu Perfil
                                </CardTitle>
                                <CardDescription>
                                    Gerencie suas informações pessoais
                                </CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>
                </div>

                {/* Informações úteis */}
                <Card className="bg-gray-50">
                    <CardHeader>
                        <CardTitle>Como funciona?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                                <p>Solicite um agendamento escolhendo o advogado e horário de sua preferência</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                                <p>O advogado analisará sua solicitação e entrará em contato para confirmar</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                                <p>Compareça no horário marcado e receba a orientação jurídica necessária</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </PageContent>
        </PageContainer>
    );
} 