"use server";

import { doc, setDoc } from "firebase/firestore";
import { z } from "zod";

import { db } from "@/lib/firebase";
import { actionClient } from "@/lib/next-safe-action";

const requestAppointmentSchema = z.object({
    userId: z.string().min(1, "ID do usuário é obrigatório"),
    userName: z.string().min(1, "Nome do usuário é obrigatório"),
    userEmail: z.string().email("E-mail inválido"),
    lawyerId: z.string().min(1, "Advogado é obrigatório"),
    lawyerName: z.string().min(1, "Nome do advogado é obrigatório"),
    specialty: z.string().min(1, "Especialidade é obrigatória"),
    preferredDate: z.string().min(1, "Data é obrigatória"),
    preferredTime: z.string().min(1, "Horário é obrigatório"),
    description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
    price: z.string().optional(),
});

export const requestAppointment = actionClient
    .schema(requestAppointmentSchema)
    .action(async ({ parsedInput }) => {
        try {
            // Gerar ID único para o agendamento
            const appointmentId = `appointment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Combinar data e hora no fuso de São Paulo
            const dateTimeString = `${parsedInput.preferredDate}T${parsedInput.preferredTime}:00-03:00`;
            const dateTime = new Date(dateTimeString);

            // Dados do agendamento
            const appointmentData = {
                id: appointmentId,
                userId: parsedInput.userId,
                userName: parsedInput.userName,
                userEmail: parsedInput.userEmail,
                lawyerId: parsedInput.lawyerId,
                lawyerName: parsedInput.lawyerName,
                specialty: parsedInput.specialty,
                preferredDate: parsedInput.preferredDate,
                preferredTime: parsedInput.preferredTime,
                dateTime: dateTime.toISOString(), // novo campo ISO
                description: parsedInput.description,
                price: parsedInput.price || "",
                status: "pending", // pending, confirmed, cancelled, completed
                requestedAt: new Date(),
                updatedAt: new Date(),
                confirmedAt: null,
                notes: "",
            };

            // Salvar no Firestore
            await setDoc(doc(db, "agendamentos", appointmentId), appointmentData);

            return {
                success: true,
                appointmentId,
                message: "Solicitação de agendamento enviada com sucesso!"
            };
        } catch (error) {
            console.error("Erro ao salvar agendamento:", error);
            throw new Error("Erro ao processar solicitação de agendamento");
        }
    }); 