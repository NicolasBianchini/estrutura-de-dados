"use server";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { appointmentsTable, doctorsTable } from "@/db/schema";
import { generateTimeSlots } from "@/helpers/time";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getAvailableTimes = actionClient
  .schema(
    z.object({
      doctorId: z.string(),
      date: z.string().date(), // YYYY-MM-DD,
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("Unauthorized");
    }
    if (!session.user.clinic) {
      throw new Error("Clínica não encontrada");
    }
    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.id, parsedInput.doctorId),
    });
    if (!doctor) {
      throw new Error("Advogado não encontrado");
    }
    const selectedDayOfWeek = dayjs(parsedInput.date).day();
    const doctorIsAvailable =
      selectedDayOfWeek >= doctor.availableFromWeekDay &&
      selectedDayOfWeek <= doctor.availableToWeekDay;
    if (!doctorIsAvailable) {
      return [];
    }

    // Buscar todos os agendamentos do advogado para a data selecionada
    const appointments = await db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.doctorId, parsedInput.doctorId),
    });

    // Filtrar agendamentos para a data selecionada e que não estejam cancelados
    const appointmentsOnSelectedDate = appointments
      .filter((appointment) => {
        const appointmentDate = dayjs(appointment.date).utc();
        return (
          appointmentDate.isSame(dayjs(parsedInput.date).utc(), "day") &&
          appointment.status !== "cancelled"
        );
      });

    // Gerar todos os horários possíveis
    const timeSlots = generateTimeSlots(doctor.availableFromTime, doctor.availableToTime);

    // Filtrar horários baseado no horário de trabalho do advogado
    const doctorAvailableFrom = dayjs()
      .utc()
      .set("hour", Number(doctor.availableFromTime.split(":")[0]))
      .set("minute", Number(doctor.availableFromTime.split(":")[1]))
      .set("second", 0)
      .local();
    const doctorAvailableTo = dayjs()
      .utc()
      .set("hour", Number(doctor.availableToTime.split(":")[0]))
      .set("minute", Number(doctor.availableToTime.split(":")[1]))
      .set("second", 0)
      .local();

    // Filtrar horários dentro do horário de trabalho do advogado
    const doctorTimeSlots = timeSlots.filter((time) => {
      const date = dayjs()
        .utc()
        .set("hour", Number(time.split(":")[0]))
        .set("minute", Number(time.split(":")[1]))
        .set("second", 0);
      return date.isAfter(doctorAvailableFrom) && date.isBefore(doctorAvailableTo);
    });

    // Retornar horários disponíveis
    return doctorTimeSlots.map((time) => {
      const slotDateTime = dayjs(`${parsedInput.date}T${time}`).utc();
      const isBooked = appointmentsOnSelectedDate.some((appointment) =>
        dayjs(appointment.date).utc().isSame(slotDateTime, "minute")
      );
      return {
        value: time,
        label: time.split(":")[0] + ":" + time.split(":")[1],
        available: !isBooked,
      };
    });
  });
