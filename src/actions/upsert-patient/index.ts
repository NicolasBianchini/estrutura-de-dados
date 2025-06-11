"use server";

import { actionClient } from "@/lib/next-safe-action";

import { upsertPatientSchema } from "./schema";

export const upsertPatient = actionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    console.log("Mock paciente salvo:", parsedInput);

    // Simula delay
    await new Promise((res) => setTimeout(res, 500));

    return { success: true };
  });
