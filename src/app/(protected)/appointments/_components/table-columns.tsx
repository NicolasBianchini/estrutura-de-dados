"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import AppointmentsTableActions from "./table-actions";

type AppointmentWithRelations = {
  id: string;
  date: Date;
  appointmentPriceInCents: number;
  clinicId: string;
  patientId: string;
  doctorId: string;
  createdAt: Date;
  updatedAt: Date | null;
  patient: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    sex: "male" | "female";
  };
  doctor: {
    id: string;
    name: string;
    specialty: string;
  };
  status: string;
  description?: string;
  notes?: string;
};

export const createAppointmentsTableColumns = (
  onUpdate?: () => void
): ColumnDef<AppointmentWithRelations>[] => [
    {
      id: "patient",
      accessorKey: "patient.name",
      header: "Paciente",
    },
    {
      id: "doctor",
      accessorKey: "doctor.name",
      header: "Advogado",
      cell: (params) => {
        const appointment = params.row.original;
        return `${appointment.doctor.name}`;
      },
    },
    {
      id: "date",
      accessorKey: "date",
      header: "Data e Hora",
      cell: (params) => {
        const appointment = params.row.original;
        return format(new Date(appointment.date), "dd/MM/yyyy 'às' HH:mm", {
          locale: ptBR,
        });
      },
    },
    {
      id: "specialty",
      accessorKey: "doctor.specialty",
      header: "Especialidade",
    },
    {
      id: "price",
      accessorKey: "appointmentPriceInCents",
      header: "Valor",
      cell: (params) => {
        const appointment = params.row.original;
        const price = appointment.appointmentPriceInCents / 100;
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price);
      },
    },
    {
      id: "actions",
      cell: (params) => {
        const appointment = params.row.original;
        return <AppointmentsTableActions appointment={appointment} onUpdate={onUpdate} />;
      },
    },
  ];

// Manter compatibilidade com código existente
export const appointmentsTableColumns = createAppointmentsTableColumns();
