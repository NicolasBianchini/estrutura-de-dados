"use server";

import { collection, getDocs, query, where } from "firebase/firestore";
import { z } from "zod";

import { db } from "@/lib/firebase";
import { actionClient } from "@/lib/next-safe-action";

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

export const getAllDoctors = actionClient
    .schema(z.object({}))
    .action(async () => {
        try {
            console.log("Buscando todos os advogados...");

            // Buscar todos os usuários com role 'admin'
            const usersQuery = query(
                collection(db, "users"),
                where("role", "==", "admin")
            );
            const usersSnapshot = await getDocs(usersQuery);

            const doctors = [];

            for (const userDoc of usersSnapshot.docs) {
                const userData = userDoc.data();
                doctors.push({
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    specialty: userData.specialty || '',
                    avatarImageUrl: userData.avatarImageUrl || '',
                    availableFromTime: userData.availableFromTime || '',
                    availableToTime: userData.availableToTime || '',
                    availableFromWeekDay: userData.availableFromWeekDay || 1,
                    availableToWeekDay: userData.availableToWeekDay || 5,
                    appointmentPrice: userData.appointmentPrice || '',
                    bio: userData.bio || '',
                    createdAt: convertTimestamp(userData.createdAt),
                    updatedAt: userData.updatedAt ? convertTimestamp(userData.updatedAt) : null,
                });
            }

            // Ordenar advogados por data de criação (mais recente primeiro)
            doctors.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime();
            });

            console.log(`Encontrados ${doctors.length} advogados`);

            return {
                success: true,
                data: {
                    doctors,
                }
            };
        } catch (error) {
            console.error("Erro ao buscar advogados:", error);
            throw new Error("Erro ao carregar advogados");
        }
    }); 