"use server";

import { collection, getDocs,query, where } from "firebase/firestore";
import { z } from "zod";

import { db } from "@/lib/firebase";
import { actionClient } from "@/lib/next-safe-action";

const getUserAppointmentsSchema = z.object({
    userId: z.string().min(1, "ID do usuário é obrigatório"),
});

export const getUserAppointments = actionClient
    .schema(getUserAppointmentsSchema)
    .action(async ({ parsedInput }) => {
        try {
            console.log("Buscando agendamentos para o usuário:", parsedInput.userId);

            // Buscar agendamentos do usuário
            const appointmentsQuery = query(
                collection(db, "agendamentos"),
                where("userId", "==", parsedInput.userId)
            );

            const querySnapshot = await getDocs(appointmentsQuery);
            console.log("Documentos encontrados:", querySnapshot.size);
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

            // Ordenar por data de solicitação (mais recente primeiro)
            appointments.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());

            // Separar por status
            const confirmedAppointments = appointments.filter(apt => apt.status === "confirmed");
            const pendingRequests = appointments.filter(apt => apt.status === "pending");
            const cancelledAppointments = appointments.filter(apt => apt.status === "cancelled");
            const completedAppointments = appointments.filter(apt => apt.status === "completed");

            return {
                success: true,
                data: {
                    all: appointments,
                    confirmed: confirmedAppointments,
                    pending: pendingRequests,
                    cancelled: cancelledAppointments,
                    completed: completedAppointments,
                    stats: {
                        total: appointments.length,
                        confirmed: confirmedAppointments.length,
                        pending: pendingRequests.length,
                        cancelled: cancelledAppointments.length,
                        completed: completedAppointments.length,
                    }
                }
            };
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
            throw new Error("Erro ao carregar agendamentos");
        }
    }); 