"use server";

import { z } from "zod";

import { actionClient } from "@/lib/next-safe-action";

export const createAppointment = actionClient
  .schema(
    z.object({
      patientId: z.string(),
      doctorId: z.string(),
      date: z.string(),
      appointmentPriceInCents: z.number(),
    }),
  )
  .action(async ({ parsedInput }) => {
    console.log("Novo agendamento (mock):", parsedInput);
    await new Promise((res) => setTimeout(res, 500));
    return { success: true };
  });
