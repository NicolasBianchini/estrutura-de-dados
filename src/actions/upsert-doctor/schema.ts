import { z } from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().trim().min(1, {
      message: "Nome é obrigatório.",
    }),
    specialty: z.string().trim().min(1, {
      message: "Especialidade é obrigatória.",
    }),
    appointmentPriceInCents: z.number().min(1, {
      message: "Preço da consulta é obrigatório.",
    }),
    availableFromWeekDay: z.number().min(0).max(6),
    availableToWeekDay: z.number().min(0).max(6),
    availableFromTime: z.string().min(1, {
      message: "Hora de início é obrigatória.",
    }),
    availableToTime: z.string().min(1, {
      message: "Hora de término é obrigatória.",
    }),
    bio: z.string().max(500, { message: "A descrição deve ter no máximo 500 caracteres." }).optional(),
  })
  .refine(
    (data) => {
      // Converter horários para minutos para comparação correta
      const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };

      const fromMinutes = timeToMinutes(data.availableFromTime);
      const toMinutes = timeToMinutes(data.availableToTime);

      return fromMinutes < toMinutes;
    },
    {
      message:
        "O horário de início deve ser anterior ao horário de término.",
      path: ["availableToTime"],
    },
  );

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
