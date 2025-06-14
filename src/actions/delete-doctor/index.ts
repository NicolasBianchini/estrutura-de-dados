"use server";

import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { z } from "zod";

import { db } from "@/lib/firebase";
import { actionClient } from "@/lib/next-safe-action";

export const deleteDoctor = actionClient
  .schema(z.object({ id: z.string().min(1, "ID é obrigatório") }))
  .action(async ({ parsedInput }) => {
    try {
      console.log("=== DELETANDO ADVOGADO ===");
      console.log("ID recebido:", parsedInput.id);

      // Buscar o documento do usuário pelo ID customizado
      const usersQuery = query(
        collection(db, "users"),
        where("id", "==", parsedInput.id)
      );
      const querySnapshot = await getDocs(usersQuery);

      if (querySnapshot.empty) {
        console.error("Advogado não encontrado para deletar");
        return { success: false, message: "Advogado não encontrado" };
      }

      // Pegar o primeiro documento encontrado
      const doctorDoc = querySnapshot.docs[0];
      const userData = doctorDoc.data();

      console.log("Advogado encontrado:", userData.name, userData.email);

      // Verificar se é realmente um advogado (role admin)
      if (userData.role !== "admin") {
        console.error("Usuário não é um advogado");
        return { success: false, message: "Usuário não é um advogado" };
      }

      // Deletar o documento do Firestore
      await deleteDoc(doc(db, "users", doctorDoc.id));

      // TODO: Também deletar sessões ativas do usuário
      // TODO: Deletar consultas agendadas com este advogado

      console.log("Advogado deletado com sucesso:", userData.name);
      return {
        success: true,
        message: `Advogado ${userData.name} deletado com sucesso`
      };
    } catch (error) {
      console.error("Erro ao deletar advogado:", error);
      return {
        success: false,
        message: "Erro ao deletar advogado"
      };
    }
  });
