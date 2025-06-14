import { Calendar, Clock, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Appointment {
    id: string;
    userName: string;
    lawyerName: string;
    specialty: string;
    preferredTime: string;
    status: string;
    description: string;
}

interface TodayAppointmentsProps {
    appointments: Appointment[];
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "confirmed":
            return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
        case "pending":
            return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
        case "cancelled":
            return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
        case "completed":
            return <Badge className="bg-blue-100 text-blue-800">Concluído</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export default function TodayAppointments({ appointments }: TodayAppointmentsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Agendamentos de Hoje ({appointments.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {appointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum agendamento para hoje</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{appointment.userName}</span>
                                    </div>
                                    {getStatusBadge(appointment.status)}
                                </div>

                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Advogado:</span>
                                        <span>{appointment.lawyerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Especialidade:</span>
                                        <span>{appointment.specialty}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3" />
                                        <span>{appointment.preferredTime}</span>
                                    </div>
                                </div>

                                {appointment.description && (
                                    <div className="mt-2 pt-2 border-t">
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium">Descrição:</span> {appointment.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 