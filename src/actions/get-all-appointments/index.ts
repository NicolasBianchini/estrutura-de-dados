"use server";

import { collection, getDocs, orderBy, query } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { actionClient } from "@/lib/next-safe-action";

// Definições de tipos auxiliares
interface LawyerStats {
    [lawyerId: string]: {
        id: string;
        name: string;
        specialty: string;
        appointments: number;
        avatarImageUrl: string | null;
    };
}

interface SpecialtyStats {
    [specialty: string]: {
        specialty: string;
        appointments: number;
    };
}

export const getAllAppointments = actionClient
    .action(async () => {
        try {
            // Buscar todos os agendamentos
            const appointmentsQuery = query(
                collection(db, "agendamentos"),
                orderBy("requestedAt", "desc")
            );

            const querySnapshot = await getDocs(appointmentsQuery);
            const appointments: Array<{
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
            }> = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                appointments.push({
                    id: data.id,
                    userId: data.userId,
                    userName: data.userName,
                    userEmail: data.userEmail,
                    lawyerId: data.lawyerId,
                    lawyerName: data.lawyerName,
                    specialty: data.specialty,
                    preferredDate: data.preferredDate,
                    preferredTime: data.preferredTime,
                    description: data.description,
                    price: data.price,
                    status: data.status,
                    requestedAt: data.requestedAt?.toDate?.() || new Date(data.requestedAt),
                    updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
                    confirmedAt: data.confirmedAt?.toDate?.() || null,
                    notes: data.notes || "",
                });
            });

            // Calcular estatísticas
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];

            const todayAppointments = appointments.filter(apt =>
                apt.status === "confirmed" && apt.preferredDate === todayStr
            );

            const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const monthlyAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.requestedAt);
                return aptDate >= thisMonth;
            });

            // Estatísticas por status
            const confirmedCount = appointments.filter(apt => apt.status === "confirmed").length;
            const pendingCount = appointments.filter(apt => apt.status === "pending").length;
            const cancelledCount = appointments.filter(apt => apt.status === "cancelled").length;
            const completedCount = appointments.filter(apt => apt.status === "completed").length;

            // Top advogados (baseado em agendamentos confirmados)
            const lawyerStats = appointments
                .filter(apt => apt.status === "confirmed")
                .reduce((acc: LawyerStats, apt) => {
                    if (!acc[apt.lawyerId]) {
                        acc[apt.lawyerId] = {
                            id: apt.lawyerId,
                            name: apt.lawyerName,
                            specialty: apt.specialty,
                            appointments: 0,
                            avatarImageUrl: null,
                        };
                    }
                    acc[apt.lawyerId].appointments++;
                    return acc;
                }, {} as LawyerStats);

            const topDoctors = Object.values(lawyerStats)
                .sort((a, b) => b.appointments - a.appointments)
                .slice(0, 5);

            // Top especialidades
            const specialtyStats = appointments
                .filter(apt => apt.status === "confirmed")
                .reduce((acc: SpecialtyStats, apt) => {
                    if (!acc[apt.specialty]) {
                        acc[apt.specialty] = {
                            specialty: apt.specialty,
                            appointments: 0,
                        };
                    }
                    acc[apt.specialty].appointments++;
                    return acc;
                }, {} as SpecialtyStats);

            const topSpecialties = Object.values(specialtyStats)
                .sort((a, b) => b.appointments - a.appointments)
                .slice(0, 5);

            // Receita total (apenas agendamentos confirmados)
            const totalRevenue = appointments
                .filter(apt => apt.status === "confirmed")
                .reduce((total, apt) => {
                    const price = parseFloat(apt.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                    return total + price;
                }, 0);

            return {
                success: true,
                data: {
                    appointments,
                    stats: {
                        total: appointments.length,
                        confirmed: confirmedCount,
                        pending: pendingCount,
                        cancelled: cancelledCount,
                        completed: completedCount,
                        todayAppointments: todayAppointments.length,
                        monthlyAppointments: monthlyAppointments.length,
                        totalRevenue,
                    },
                    todayAppointments,
                    topDoctors,
                    topSpecialties,
                }
            };
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
            throw new Error("Erro ao carregar dados do dashboard");
        }
    }); 