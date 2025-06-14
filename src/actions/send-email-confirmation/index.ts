"use server";
import { sendEmailConfirmation } from "@/lib/email";

export async function sendEmailConfirmationAction({ userEmail, userName, confirmationUrl }: { userEmail: string, userName: string, confirmationUrl: string }) {
    return await sendEmailConfirmation({ userEmail, userName, confirmationUrl });
} 