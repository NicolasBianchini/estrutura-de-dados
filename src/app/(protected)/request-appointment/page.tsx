"use client";

import { collection, getDocs, query, where } from "firebase/firestore";
import { Calendar, User } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { requestAppointment } from "@/actions/request-appointment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    PageContainer,
    PageContent,
    PageDescription,
    PageHeader,
    PageHeaderContent,
    PageTitle,
} from "@/components/ui/page-container";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-firebase-auth";
import { db } from "@/lib/firebase";

interface Lawyer {
    id: string;
    name: string;
    specialty: string;
    appointmentPrice: string;
    availableFromTime: string;
    availableToTime: string;
    availableFromWeekDay: number;
    availableToWeekDay: number;
}

// Função para gerar horários disponíveis baseados no horário de trabalho do advogado
const generateAvailableTimeSlots = (fromTime: string, toTime: string): string[] => {
    const timeSlots: string[] = [];

    // Converter horários para minutos
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Converter minutos para horário
    const minutesToTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const startMinutes = timeToMinutes(fromTime);
    const endMinutes = timeToMinutes(toTime);

    // Gerar slots de 1 hora
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 60) {
        timeSlots.push(minutesToTime(minutes));
    }

    return timeSlots;
};

// Função para verificar se uma data está disponível para o advogado
const isDateAvailableForLawyer = (date: string, lawyer: Lawyer): boolean => {
    if (!date || !lawyer) return false;
    // Garantir que os dias da semana são números
    const fromWeekDay = Number(lawyer.availableFromWeekDay);
    const toWeekDay = Number(lawyer.availableToWeekDay);
    // Garantir que a data não tem offset de timezone
    const selectedDate = new Date(date + 'T00:00:00');
    const dayOfWeek = selectedDate.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    console.log({ dayOfWeek, fromWeekDay, toWeekDay, date });
    return dayOfWeek >= fromWeekDay && dayOfWeek <= toWeekDay;
};

// Função para obter o nome dos dias da semana
const getDayName = (dayNumber: number): string => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayNumber] || '';
};

// Função para obter a data mínima disponível para o advogado
const getMinAvailableDate = (lawyer: Lawyer): string => {
    const today = new Date();
    const checkDate = new Date(today);

    // Procurar a próxima data disponível (máximo 30 dias à frente)
    for (let i = 0; i < 30; i++) {
        const dayOfWeek = checkDate.getDay();
        if (dayOfWeek >= lawyer.availableFromWeekDay && dayOfWeek <= lawyer.availableToWeekDay) {
            return checkDate.toISOString().split('T')[0];
        }
        checkDate.setDate(checkDate.getDate() + 1);
    }

    // Se não encontrar, retorna hoje
    return today.toISOString().split('T')[0];
};

export default function RequestAppointmentPage() {
    const { user } = useAuth();
    const [availableLawyers, setAvailableLawyers] = useState<Lawyer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLawyer, setSelectedLawyer] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [description, setDescription] = useState("");

    const selectedLawyerData = availableLawyers.find(lawyer => lawyer.id === selectedLawyer);

    // Gerar horários disponíveis baseados no advogado selecionado
    const availableTimeSlots = selectedLawyerData
        ? generateAvailableTimeSlots(selectedLawyerData.availableFromTime, selectedLawyerData.availableToTime)
        : [];

    // Buscar advogados disponíveis
    const loadLawyers = async () => {
        try {
            setLoading(true);

            const lawyersQuery = query(
                collection(db, "users"),
                where("role", "==", "admin")
            );

            const querySnapshot = await getDocs(lawyersQuery);
            const lawyersData: Lawyer[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                lawyersData.push({
                    id: data.id || doc.id,
                    name: data.name || "Nome não informado",
                    specialty: data.specialty || "Especialidade não informada",
                    appointmentPrice: data.appointmentPrice || "R$ 0,00",
                    availableFromTime: data.availableFromTime || "08:00",
                    availableToTime: data.availableToTime || "17:00",
                    availableFromWeekDay: Number(data.availableFromWeekDay) || 0,
                    availableToWeekDay: Number(data.availableToWeekDay) || 0,
                });
            });
            setAvailableLawyers(lawyersData);
        } catch {
            toast.error("Erro ao carregar advogados disponíveis");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLawyers();
    }, []);

    // Limpar horário selecionado quando trocar de advogado
    useEffect(() => {
        setSelectedTime("");
        setSelectedDate("");
    }, [selectedLawyer]);

    const { execute: submitRequest, isPending } = useAction(requestAppointment, {
        onSuccess: (result) => {
            if (result.data?.success) {
                toast.success(result.data.message);
                // Limpar formulário
                setSelectedLawyer("");
                setSelectedDate("");
                setSelectedTime("");
                setDescription("");
            }
        },
        onError: (error) => {
            console.error("Erro ao enviar solicitação:", error);
            console.error("Detalhes do erro:", error.error?.validationErrors);

            // Mostrar erros específicos de validação
            if (error.error?.validationErrors) {
                const validationErrors = error.error.validationErrors as Record<string, { _errors: string[] }>;
                Object.keys(validationErrors).forEach(field => {
                    const fieldErrors = validationErrors[field];
                    if (fieldErrors && fieldErrors._errors && fieldErrors._errors.length > 0) {
                        toast.error(`${field}: ${fieldErrors._errors[0]}`);
                    }
                });
            } else {
                toast.error("Erro ao enviar solicitação. Tente novamente.");
            }
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("Usuário não autenticado");
            return;
        }

        if (!selectedLawyer || !selectedDate || !selectedTime || !description.trim()) {
            toast.error("Por favor, preencha todos os campos obrigatórios");
            return;
        }

        if (description.trim().length < 10) {
            toast.error("A descrição do caso deve ter pelo menos 10 caracteres");
            return;
        }

        if (!selectedLawyerData) {
            toast.error("Advogado selecionado não encontrado");
            return;
        }

        // Validar se o horário selecionado está dentro do horário de trabalho do advogado
        const timeToMinutes = (time: string): number => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const selectedTimeMinutes = timeToMinutes(selectedTime);
        const availableFromMinutes = timeToMinutes(selectedLawyerData.availableFromTime);
        const availableToMinutes = timeToMinutes(selectedLawyerData.availableToTime);

        if (selectedTimeMinutes < availableFromMinutes || selectedTimeMinutes >= availableToMinutes) {
            toast.error(`Horário inválido. ${selectedLawyerData.name} atende das ${selectedLawyerData.availableFromTime} às ${selectedLawyerData.availableToTime}`);
            return;
        }

        // Validar se a data selecionada está dentro dos dias de trabalho do advogado
        if (!isDateAvailableForLawyer(selectedDate, selectedLawyerData)) {
            const fromDay = getDayName(selectedLawyerData.availableFromWeekDay);
            const toDay = getDayName(selectedLawyerData.availableToWeekDay);
            toast.error(`Data inválida. ${selectedLawyerData.name} atende de ${fromDay} à ${toDay}`);
            return;
        }

        // Preparar dados para envio
        const requestData = {
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            lawyerId: selectedLawyerData.id,
            lawyerName: selectedLawyerData.name,
            specialty: selectedLawyerData.specialty,
            preferredDate: selectedDate,
            preferredTime: selectedTime,
            description: description.trim(),
            price: selectedLawyerData.appointmentPrice,
        };

        // Verificar se todos os campos obrigatórios estão preenchidos
        const requiredFields = {
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            lawyerId: selectedLawyerData.id,
            lawyerName: selectedLawyerData.name,
            specialty: selectedLawyerData.specialty,
            preferredDate: selectedDate,
            preferredTime: selectedTime,
            description: description.trim(),
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([, value]) => !value || value.toString().trim() === '')
            .map(([key]) => key);

        if (missingFields.length > 0) {
            console.error("Campos obrigatórios faltando:", missingFields);
            toast.error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
            return;
        }

        // Enviar dados para o Firestore
        submitRequest(requestData);
    };

    if (loading) {
        return (
            <PageContainer>
                <PageHeader>
                    <PageHeaderContent>
                        <PageTitle>Solicitar Agendamento</PageTitle>
                        <PageDescription>
                            Solicite uma consulta com um de nossos advogados especializados
                        </PageDescription>
                    </PageHeaderContent>
                </PageHeader>
                <PageContent>
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Carregando advogados...</span>
                    </div>
                </PageContent>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Solicitar Agendamento</PageTitle>
                    <PageDescription>
                        Solicite uma consulta com um de nossos advogados especializados
                    </PageDescription>
                </PageHeaderContent>
            </PageHeader>

            <PageContent>
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Nova Solicitação de Consulta
                            </CardTitle>
                            <CardDescription>
                                Preencha os dados abaixo para solicitar seu agendamento
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Informações do usuário */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Seus Dados
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Nome</Label>
                                            <Input value={user?.name || ""} disabled />
                                        </div>
                                        <div>
                                            <Label>E-mail</Label>
                                            <Input value={user?.email || ""} disabled />
                                        </div>
                                    </div>
                                </div>

                                {/* Seleção do advogado */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Escolha o Advogado</h3>
                                    <div>
                                        <Label htmlFor="lawyer">Advogado *</Label>
                                        <Select value={selectedLawyer} onValueChange={setSelectedLawyer}>
                                            <SelectTrigger className="w-full max-w-full truncate">
                                                <SelectValue placeholder="Selecione um advogado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableLawyers.map((lawyer) => (
                                                    <SelectItem key={lawyer.id} value={lawyer.id}>
                                                        {lawyer.name} - {lawyer.specialty} ({lawyer.appointmentPrice})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedLawyerData && (
                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="font-medium">{selectedLawyerData.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Especialidade: {selectedLawyerData.specialty}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Valor da consulta: {selectedLawyerData.appointmentPrice}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Horário de atendimento: {selectedLawyerData.availableFromTime} às {selectedLawyerData.availableToTime}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Dias de atendimento: {getDayName(selectedLawyerData.availableFromWeekDay)} à {getDayName(selectedLawyerData.availableToWeekDay)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Data e horário */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Data e Horário
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="date">Data Preferida *</Label>
                                            <Input
                                                id="date"
                                                type="date"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                                min={selectedLawyerData ? getMinAvailableDate(selectedLawyerData) : new Date().toISOString().split('T')[0]}
                                                disabled={!selectedLawyerData}
                                            />
                                            {selectedLawyerData && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Disponível: {getDayName(selectedLawyerData.availableFromWeekDay)} à {getDayName(selectedLawyerData.availableToWeekDay)}
                                                </p>
                                            )}
                                            {selectedDate && selectedLawyerData && !isDateAvailableForLawyer(selectedDate, selectedLawyerData) && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    Data indisponível. Escolha uma data entre {getDayName(selectedLawyerData.availableFromWeekDay)} e {getDayName(selectedLawyerData.availableToWeekDay)}.
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="time">Horário Preferido *</Label>
                                            <Select value={selectedTime} onValueChange={setSelectedTime} disabled={!selectedLawyerData}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={
                                                        !selectedLawyerData
                                                            ? "Selecione um advogado primeiro"
                                                            : availableTimeSlots.length === 0
                                                                ? "Nenhum horário disponível"
                                                                : "Selecione um horário"
                                                    } />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableTimeSlots.length > 0 ? (
                                                        availableTimeSlots.map((time) => (
                                                            <SelectItem key={time} value={time}>
                                                                {time}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        selectedLawyerData && (
                                                            <div className="p-2 text-sm text-muted-foreground">
                                                                Nenhum horário disponível para este advogado
                                                            </div>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {selectedLawyerData && availableTimeSlots.length === 0 && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Este advogado não possui horários configurados para atendimento.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Descrição do caso */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Descrição do Caso</h3>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <Label htmlFor="description">Descreva brevemente seu caso *</Label>
                                            <span className={`text-xs ${description.length < 10 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                                {description.length}/10 caracteres mínimos
                                            </span>
                                        </div>
                                        <textarea
                                            id="description"
                                            className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${description.length > 0 && description.length < 10
                                                ? 'border-red-300 focus-visible:ring-red-500'
                                                : 'border-input'
                                                }`}
                                            placeholder="Descreva sua situação, o tipo de ajuda que precisa e qualquer informação relevante... (mínimo 10 caracteres)"
                                            value={description}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                            rows={4}
                                        />
                                        {description.length > 0 && description.length < 10 && (
                                            <p className="text-xs text-red-500 mt-1">
                                                A descrição deve ter pelo menos 10 caracteres
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Informações importantes */}
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-medium text-blue-900 mb-2">Informações Importantes:</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Sua solicitação será enviada para o advogado selecionado</li>
                                        <li>• O advogado entrará em contato para confirmar o agendamento</li>
                                        <li>• O pagamento será discutido diretamente com o advogado</li>
                                        <li>• Você receberá uma confirmação por e-mail</li>
                                    </ul>
                                </div>

                                <Button type="submit" className="w-full" disabled={isPending}>
                                    {isPending ? "Enviando Solicitação..." : "Solicitar Agendamento"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </PageContent>
        </PageContainer>
    );
} 