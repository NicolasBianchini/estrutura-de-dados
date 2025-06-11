"use server";

import { actionClient } from "@/lib/next-safe-action";

import { upsertDoctorSchema } from "./schema";

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    // Converte horários como "15:30:00" para logs e simulação
    const from = parsedInput.availableFromTime;
    const to = parsedInput.availableToTime;

    console.log("Mock advogado salvo:", {
      ...parsedInput,
      availableFromTime: from,
      availableToTime: to,
    });

    // Simula delay de API
    await new Promise((res) => setTimeout(res, 500));

    return { success: true };
  });
