"use server";

import { z } from "zod";

import { actionClient } from "@/lib/next-safe-action";

export const deletePatient = actionClient
  .schema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    console.log("Paciente deletado (mock):", parsedInput.id);
    await new Promise((res) => setTimeout(res, 500));
    return { success: true };
  });
