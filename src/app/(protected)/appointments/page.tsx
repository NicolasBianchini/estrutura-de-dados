"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { getAllAppointments } from "@/actions/get-all-appointments";
import { DataTable } from "@/components/ui/data-table";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { useAuth } from "@/hooks/use-firebase-auth";
import { getLawyerByUserId } from "@/utils/get-lawyer-by-user-id";

import AppointmentsTableActions from "./_components/table-actions";
import { createAppointmentsTableColumns } from "./_components/table-columns";

interface Appointment {
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
}

interface RawAppointment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  lawyerId: string;
  lawyerName: string;
  specialty: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
  price: string;
  status: string;
  notes?: string;
}

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [lawyerId, setLawyerId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role === "admin") {
      getLawyerByUserId(user.id).then((lawyer) => {
        setLawyerId(lawyer?.id ?? null);
      });
    }
  }, [user]);

  const { execute: loadAppointments, isPending } = useAction(getAllAppointments, {
    onSuccess: (result) => {
      if (result.data?.success) {
        let formattedAppointments = result.data.data.appointments.map((apt: RawAppointment) => {
          const formatted: Appointment = {
            id: apt.id,
            date: new Date(apt.preferredDate + 'T' + apt.preferredTime),
            appointmentPriceInCents: parseFloat(apt.price.replace(/[^\d,]/g, '').replace(',', '.')) * 100 || 0,
            clinicId: "1", // Mock clinic ID
            patientId: apt.userId,
            doctorId: apt.lawyerId,
            createdAt: new Date(),
            updatedAt: null,
            patient: {
              id: apt.userId,
              name: apt.userName,
              email: apt.userEmail,
              phoneNumber: "",
              sex: "male" as const,
            },
            doctor: {
              id: apt.lawyerId,
              name: apt.lawyerName,
              specialty: apt.specialty,
            },
            status: apt.status,
            description: apt.description,
            notes: apt.notes,
          };
          return formatted;
        });

        // Logs para depuração
        console.log("user.id:", user?.id);
        console.log("lawyerId:", lawyerId);
        console.log("IDs dos advogados dos agendamentos:", formattedAppointments.map(a => a.doctor.id));

        // Só aplicar o filtro se o usuário estiver carregado, for admin e já buscou o lawyerId
        if (!authLoading && user?.role === "admin" && lawyerId) {
          formattedAppointments = formattedAppointments.filter((apt) => apt.doctor.id === lawyerId);
        }
        setAppointments(formattedAppointments);
      }
    },
    onError: (error) => {
      console.error("Erro ao carregar agendamentos:", error);
    },
  });

  const refreshAppointments = () => {
    loadAppointments();
  };

  // Novo useEffect: só carrega agendamentos quando lawyerId estiver definido
  useEffect(() => {
    if (
      !authLoading &&
      user?.role === "admin" &&
      user?.id &&
      lawyerId
    ) {
      loadAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, lawyerId]);

  if (isPending) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Agendamentos</PageTitle>
          </PageHeaderContent>
        </PageHeader>
        <PageContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Carregando agendamentos...</span>
          </div>
        </PageContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos do seu escritório
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        {/* Mobile: Cards */}
        <div className="flex flex-col gap-4 md:hidden">
          {appointments.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Nenhum agendamento encontrado.</div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="rounded-lg border p-4 shadow-sm bg-white flex flex-col gap-2">
                <div className="font-semibold text-base truncate">{apt.patient.name}</div>
                <div className="text-sm text-muted-foreground truncate">Advogado: {apt.doctor.name}</div>
                <div className="text-sm text-muted-foreground truncate">Especialidade: {apt.doctor.specialty}</div>
                <div className="text-sm">{apt.date.toLocaleDateString()} às {apt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="mt-2">
                  <AppointmentsTableActions appointment={apt} onUpdate={refreshAppointments} />
                </div>
              </div>
            ))
          )}
        </div>
        {/* Desktop: Tabela */}
        <div className="hidden md:block">
          <DataTable
            data={appointments}
            columns={createAppointmentsTableColumns(refreshAppointments)}
          />
        </div>
      </PageContent>
    </PageContainer>
  );
}
