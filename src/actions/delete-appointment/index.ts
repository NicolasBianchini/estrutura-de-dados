"use server";

import { deleteDoc,doc } from "firebase/firestore";
import { z } from "zod";

import { db } from "@/lib/firebase";
import { actionClient } from "@/lib/next-safe-action";

const deleteAppointmentSchema = z.object({
  id: z.string().min(1, "ID do agendamento é obrigatório"),
});

export const deleteAppointment = actionClient
  .schema(deleteAppointmentSchema)
  .action(async ({ parsedInput }) => {
    try {
      console.log("Deletando agendamento:", parsedInput.id);

      // Deletar documento do Firestore
      await deleteDoc(doc(db, "agendamentos", parsedInput.id));

      console.log("Agendamento deletado com sucesso:", parsedInput.id);

      return {
        success: true,
        message: "Agendamento deletado com sucesso!"
      };
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
      throw new Error("Erro ao deletar agendamento");
    }
  });
