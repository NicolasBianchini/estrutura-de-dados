"use server";

import { collection, getDocs, query, where } from "firebase/firestore";
import { z } from "zod";

import { db } from "@/lib/firebase";
import { actionClient } from "@/lib/next-safe-action";

interface UserAppointment {
    id: string;
    lawyerName: string;
    specialty: string;
    preferredDate: string;
    preferredTime: string;
    description: string;
    status: string;
    requestedAt: Date | { toDate(): Date };
}

// Helper function to convert Firestore timestamps to ISO strings
function isFirestoreTimestamp(obj: unknown): obj is { toDate: () => Date } {
    return typeof obj === 'object' && obj !== null && 'toDate' in obj && typeof (obj as { toDate: unknown }).toDate === 'function';
}

const convertTimestamp = (timestamp: unknown): string => {
    if (!timestamp) return new Date().toISOString();
    if (isFirestoreTimestamp(timestamp)) {
        return timestamp.toDate().toISOString();
    }
    return new Date(timestamp as string | number | Date).toISOString();
};

export const getAllClients = actionClient
    .schema(z.object({}))
    .action(async () => {
        try {
            console.log("Buscando todos os clientes...");

            // Buscar todos os usuários
            const usersQuery = query(
                collection(db, "users"),
                where("role", "==", "user")
            );
            const usersSnapshot = await getDocs(usersQuery);

            // Buscar todos os agendamentos
            const appointmentsSnapshot = await getDocs(collection(db, "agendamentos"));

            const clients = [];

            for (const userDoc of usersSnapshot.docs) {
                const userData = userDoc.data();

                // Buscar agendamentos deste usuário
                const userAppointments: UserAppointment[] = [];
                appointmentsSnapshot.forEach((appointmentDoc) => {
                    const appointmentData = appointmentDoc.data();
                    if (appointmentData.userId === userData.id) {
                        userAppointments.push({
                            id: appointmentDoc.id,
                            lawyerName: appointmentData.lawyerName,
                            specialty: appointmentData.specialty,
                            preferredDate: appointmentData.preferredDate,
                            preferredTime: appointmentData.preferredTime,
                            description: appointmentData.description,
                            status: appointmentData.status,
                            requestedAt: appointmentData.requestedAt,
                        });
                    }
                });

                // Ordenar agendamentos por data de solicitação (mais recente primeiro)
                userAppointments.sort((a, b) => {
                    const dateA = new Date(convertTimestamp(a.requestedAt));
                    const dateB = new Date(convertTimestamp(b.requestedAt));
                    return dateB.getTime() - dateA.getTime();
                });

                clients.push({
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    createdAt: convertTimestamp(userData.createdAt),
                    totalAppointments: userAppointments.length,
                    pendingAppointments: userAppointments.filter(apt => apt.status === "pending").length,
                    confirmedAppointments: userAppointments.filter(apt => apt.status === "confirmed").length,
                    lastContact: userAppointments.length > 0 ? {
                        ...userAppointments[0],
                        requestedAt: convertTimestamp(userAppointments[0].requestedAt)
                    } : null,
                    appointments: userAppointments.map(apt => ({
                        ...apt,
                        requestedAt: convertTimestamp(apt.requestedAt)
                    })),
                });
            }

            // Ordenar clientes por data de criação (mais recente primeiro)
            clients.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime();
            });

            console.log(`Encontrados ${clients.length} clientes`);

            return {
                success: true,
                data: {
                    clients,
                    stats: {
                        totalClients: clients.length,
                        clientsWithAppointments: clients.filter(c => c.totalAppointments > 0).length,
                        totalAppointments: clients.reduce((sum, c) => sum + c.totalAppointments, 0),
                        pendingAppointments: clients.reduce((sum, c) => sum + c.pendingAppointments, 0),
                    }
                }
            };
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            throw new Error("Erro ao carregar clientes");
        }
    }); 