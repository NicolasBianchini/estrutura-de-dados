import { Calendar, CheckCircle, Clock, DollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardsProps {
    totalAppointments: number;
    confirmedAppointments: number;
    pendingAppointments: number;
    monthlyRevenue: number;
}

export default function DashboardCards({
    totalAppointments,
    confirmedAppointments,
    pendingAppointments,
    monthlyRevenue,
}: DashboardCardsProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalAppointments}</div>
                    <p className="text-xs text-muted-foreground">
                        Todos os agendamentos
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Agendamentos Confirmados</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{confirmedAppointments}</div>
                    <p className="text-xs text-muted-foreground">
                        Consultas confirmadas
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{pendingAppointments}</div>
                    <p className="text-xs text-muted-foreground">
                        Aguardando confirmação
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(monthlyRevenue)}</div>
                    <p className="text-xs text-muted-foreground">
                        Agendamentos confirmados
                    </p>
                </CardContent>
            </Card>
        </div>
    );
} 