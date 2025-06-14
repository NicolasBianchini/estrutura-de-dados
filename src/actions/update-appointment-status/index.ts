"use server";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { z } from "zod";

import { sendAppointmentCancellationEmail, sendAppointmentCompletionEmail, sendAppointmentConfirmationEmail } from "@/lib/email";
import { db } from "@/lib/firebase";
import { actionClient } from "@/lib/next-safe-action";

const updateAppointmentStatusSchema = z.object({
    appointmentId: z.string().min(1, "ID do agendamento é obrigatório"),
    status: z.enum(["pending", "confirmed", "cancelled", "completed"], {
        errorMap: () => ({ message: "Status inválido" }),
    }),
    notes: z.string().optional(),
});

export const updateAppointmentStatus = actionClient
    .schema(updateAppointmentStatusSchema)
    .action(async ({ parsedInput }) => {
        try {
            const updateData: {
                status: string;
                updatedAt: Date;
                confirmedAt?: Date;
                notes?: string;
            } = {
                status: parsedInput.status,
                updatedAt: new Date(),
            };

            // Buscar dados do agendamento para enviar o email
            const appointmentDoc = await getDoc(doc(db, "agendamentos", parsedInput.appointmentId));
            if (!appointmentDoc.exists()) {
                throw new Error("Agendamento não encontrado");
            }
            const appointmentData = appointmentDoc.data();

            // Preparar dados para o email
            const emailData = {
                userName: appointmentData.userName,
                userEmail: appointmentData.userEmail,
                lawyerName: appointmentData.lawyerName,
                preferredDate: appointmentData.preferredDate,
                preferredTime: appointmentData.preferredTime,
                description: appointmentData.description,
                notes: parsedInput.notes
            };

            // Enviar email apropriado baseado no status
            switch (parsedInput.status) {
                case "confirmed":
                    updateData.confirmedAt = new Date();
                    await sendAppointmentConfirmationEmail(emailData);
                    break;
                case "cancelled":
                    await sendAppointmentCancellationEmail(emailData);
                    break;
                case "completed":
                    await sendAppointmentCompletionEmail(emailData);
                    break;
            }

            // Se houver notas, adicionar
            if (parsedInput.notes) {
                updateData.notes = parsedInput.notes;
            }

            // Atualizar no Firestore
            await updateDoc(doc(db, "agendamentos", parsedInput.appointmentId), updateData);

            return {
                success: true,
                message: `Agendamento ${parsedInput.status === "confirmed" ? "confirmado" :
                    parsedInput.status === "cancelled" ? "cancelado" :
                        parsedInput.status === "completed" ? "concluído" : "atualizado"} com sucesso!`,
            };
        } catch (error) {
            console.error("Erro ao atualizar status do agendamento:", error);
            throw new Error("Erro ao atualizar agendamento");
        }
    }); 