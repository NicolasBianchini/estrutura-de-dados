"use server";

import bcrypt from "bcryptjs";
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { actionClient } from "@/lib/next-safe-action";

import { upsertDoctorSchema } from "./schema";

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    try {
      console.log("=== INÍCIO DA ACTION ===");
      console.log("Dados recebidos:", parsedInput);

      // Se tem ID, é uma atualização
      if (parsedInput.id) {
        // Primeiro, encontrar o documento correto
        const usersQuery = query(
          collection(db, "users"),
          where("id", "==", parsedInput.id)
        );
        const querySnapshot = await getDocs(usersQuery);

        if (querySnapshot.empty) {
          console.error("Advogado não encontrado para atualização");
          return { success: false, message: "Advogado não encontrado" };
        }

        const doctorDoc = querySnapshot.docs[0];
        const doctorRef = doc(db, "users", doctorDoc.id);

        await updateDoc(doctorRef, {
          name: parsedInput.name,
          specialty: parsedInput.specialty,
          availableFromTime: parsedInput.availableFromTime,
          availableToTime: parsedInput.availableToTime,
          availableFromWeekDay: parsedInput.availableFromWeekDay,
          availableToWeekDay: parsedInput.availableToWeekDay,
          appointmentPrice: `R$ ${(parsedInput.appointmentPriceInCents / 100).toFixed(2).replace('.', ',')}`,
          bio: parsedInput.bio,
          updatedAt: new Date(),
        });

        console.log("Advogado atualizado com sucesso");
        return { success: true, message: "Advogado atualizado com sucesso" };
      }

      // Se não tem ID, é uma criação
      // Gerar email temporário baseado no nome
      console.log("=== GERANDO EMAIL ===");
      console.log("Nome original:", parsedInput.name);

      const normalizeString = (str: string) => {
        const step1 = str.normalize("NFD");
        console.log("Após normalize:", step1);

        const step2 = step1.replace(/[\u0300-\u036f]/g, ""); // Remove acentos
        console.log("Após remover acentos:", step2);

        const step3 = step2.toLowerCase();
        console.log("Após lowercase:", step3);

        const step4 = step3.replace(/[^a-z0-9\s]/g, ""); // Remove caracteres especiais
        console.log("Após remover especiais:", step4);

        const step5 = step4.trim();
        console.log("Após trim:", step5);

        const step6 = step5.replace(/\s+/g, "."); // Substitui espaços por pontos
        console.log("Resultado final:", step6);

        return step6;
      };

      const emailBase = normalizeString(parsedInput.name);
      let email = `${emailBase}@fgjn.adv.br`;

      console.log("Email base gerado:", emailBase);
      console.log("Email completo:", email);

      // Verificar se o email já existe
      const existingEmailQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const existingEmailSnapshot = await getDocs(existingEmailQuery);

      // Se email já existe, adicionar número sequencial
      if (!existingEmailSnapshot.empty) {
        let counter = 1;
        let newEmail = `${emailBase}${counter}@fgjn.adv.br`;

        while (true) {
          const checkQuery = query(
            collection(db, "users"),
            where("email", "==", newEmail)
          );
          const checkSnapshot = await getDocs(checkQuery);

          if (checkSnapshot.empty) {
            email = newEmail;
            break;
          }

          counter++;
          newEmail = `${emailBase}${counter}@fgjn.adv.br`;
        }
      }

      // Senha padrão temporária
      const tempPassword = "123456";
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // Gerar ID único
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Criar usuário advogado no Firestore
      const userData = {
        id: userId,
        name: parsedInput.name,
        email: email,
        password: hashedPassword,
        role: "admin", // Advogados são admins
        specialty: parsedInput.specialty,
        availableFromTime: parsedInput.availableFromTime,
        availableToTime: parsedInput.availableToTime,
        availableFromWeekDay: parsedInput.availableFromWeekDay,
        availableToWeekDay: parsedInput.availableToWeekDay,
        appointmentPrice: `R$ ${(parsedInput.appointmentPriceInCents / 100).toFixed(2).replace('.', ',')}`,
        bio: parsedInput.bio,
        createdAt: new Date(),
        updatedAt: null,
      };

      // Usar setDoc com o ID customizado como chave do documento
      await setDoc(doc(db, "users", userId), userData);

      console.log("Advogado criado com sucesso:", {
        name: parsedInput.name,
        email: email,
        tempPassword: tempPassword,
      });

      console.log("=== RETORNANDO SUCESSO ===");
      return {
        success: true,
        message: "Advogado criado com sucesso",
        data: {
          email: email,
          tempPassword: tempPassword,
        }
      };
    } catch (error) {
      console.error("=== ERRO NA ACTION ===");
      console.error("Erro ao criar/atualizar advogado:", error);
      console.error("Stack trace:", error instanceof Error ? error.stack : "N/A");
      return {
        success: false,
        message: "Erro ao criar/atualizar advogado"
      };
    }
  });
