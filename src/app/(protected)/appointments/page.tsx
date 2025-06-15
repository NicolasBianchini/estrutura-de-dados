"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { getAllAppointments } from "@/actions/get-all-appointments";
import { DataTable } from "@/components/ui/data-table";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { useAuth } from "@/hooks/use-firebase-auth";
import { getLawyerByUserId } from "@/utils/get-lawyer-by-user-id";

import AddAppointmentButton from "./_components/add-appointment-button";
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

interface MockPatient {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  email: string;
  clinicId: string;
  phoneNumber: string;
  sex: "male" | "female";
}

interface MockDoctor {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  specialty: string;
  appointmentPriceInCents: number;
  clinicId: string;
  avatarImageUrl: string | null;
  availableFromWeekDay: number;
  availableToWeekDay: number;
  availableFromTime: string;
  availableToTime: string;
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

  // Mock data para pacientes e médicos (para o botão de adicionar)
  const patients: MockPatient[] = [
    {
      id: "1",
      name: "L7NNON",
      createdAt: new Date(),
      updatedAt: null,
      email: "l7nnon@example.com",
      clinicId: "1",
      phoneNumber: "11999999999",
      sex: "male"
    },
    {
      id: "2",
      name: "TZ DA CORONEL",
      createdAt: new Date(),
      updatedAt: null,
      email: "tz@example.com",
      clinicId: "1",
      phoneNumber: "11999999999",
      sex: "male"
    },
    {
      id: "3",
      name: "TRAVIS SCOTT",
      createdAt: new Date(),
      updatedAt: null,
      email: "travis@example.com",
      clinicId: "1",
      phoneNumber: "11999999999",
      sex: "male"
    },
    {
      id: "4",
      name: "LUDMILLA",
      createdAt: new Date(),
      updatedAt: null,
      email: "ludmilla@example.com",
      clinicId: "1",
      phoneNumber: "11999999999",
      sex: "female"
    },
  ];

  const doctors: MockDoctor[] = [
    {
      id: "1",
      name: "Dr. Felipe Vargas",
      createdAt: new Date(),
      updatedAt: null,
      specialty: "Direito Civil",
      appointmentPriceInCents: 20000,
      clinicId: "1",
      avatarImageUrl: null,
      availableFromWeekDay: 1,
      availableToWeekDay: 5,
      availableFromTime: "08:00",
      availableToTime: "18:00"
    },
    {
      id: "2",
      name: "Dr. João Belém",
      createdAt: new Date(),
      updatedAt: null,
      specialty: "Direito Trabalhista",
      appointmentPriceInCents: 25000,
      clinicId: "1",
      avatarImageUrl: null,
      availableFromWeekDay: 1,
      availableToWeekDay: 5,
      availableFromTime: "09:00",
      availableToTime: "19:00"
    },
    {
      id: "3",
      name: "Dr. Gabriel Klein",
      createdAt: new Date(),
      updatedAt: null,
      specialty: "Direito Tributário",
      appointmentPriceInCents: 30000,
      clinicId: "1",
      avatarImageUrl: null,
      availableFromWeekDay: 1,
      availableToWeekDay: 5,
      availableFromTime: "10:00",
      availableToTime: "20:00"
    },
    {
      id: "4",
      name: "Dr. Nicolas Bianchini",
      createdAt: new Date(),
      updatedAt: null,
      specialty: "Direito Empresarial",
      appointmentPriceInCents: 35000,
      clinicId: "1",
      avatarImageUrl: null,
      availableFromWeekDay: 1,
      availableToWeekDay: 5,
      availableFromTime: "11:00",
      availableToTime: "21:00"
    },
  ];

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
        <PageActions>
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable
          data={appointments}
          columns={createAppointmentsTableColumns(refreshAppointments)}
        />
      </PageContent>
    </PageContainer>
  );
}
