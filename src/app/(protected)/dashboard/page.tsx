"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { getAllAppointments } from "@/actions/get-all-appointments";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import AddDoctorButton from "./_components/add-doctor-button";
import DashboardCards from "./_components/dashboard-cards";
import TodayAppointments from "./_components/today-appointments";
import TopDoctors from "./_components/top-doctors";
import TopSpecialties from "./_components/top-specialties";

// Definir o tipo DashboardData
type DashboardData = {
  stats: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    completed: number;
    todayAppointments: number;
    monthlyAppointments: number;
    totalRevenue: number;
  };
  todayAppointments: {
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
    requestedAt: string;
    notes?: string;
  }[];
  topDoctors: {
    id: string;
    name: string;
    specialty: string;
    appointments: number;
    avatarImageUrl: string | null;
  }[];
  topSpecialties: {
    specialty: string;
    appointments: number;
  }[];
};

// Definir o tipo TodayAppointment
type TodayAppointment = {
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
  requestedAt: string | Date;
  notes?: string;
};

export default function DashboardPage() {
  console.log("=== DASHBOARD PAGE CARREGANDO ===");

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      completed: 0,
      todayAppointments: 0,
      monthlyAppointments: 0,
      totalRevenue: 0,
    },
    todayAppointments: [],
    topDoctors: [],
    topSpecialties: [],
  });

  const { execute: loadDashboardData, isPending } = useAction(getAllAppointments, {
    onSuccess: (result) => {
      console.log("=== DASHBOARD DATA CARREGADO ===");
      console.log("Resultado:", result);
      if (result.data?.success) {
        console.log("Dados do dashboard:", result.data.data);
        setDashboardData({
          stats: result.data.data.stats,
          todayAppointments: result.data.data.todayAppointments.map((apt: TodayAppointment) => ({
            ...apt,
            requestedAt: typeof apt.requestedAt === 'string' ? apt.requestedAt : (apt.requestedAt instanceof Date ? apt.requestedAt.toISOString() : String(apt.requestedAt)),
          })),
          topDoctors: result.data.data.topDoctors,
          topSpecialties: result.data.data.topSpecialties,
        });
      } else {
        console.log("Falha ao carregar dados do dashboard");
      }
    },
    onError: (error) => {
      console.error("=== ERRO NO DASHBOARD ===");
      console.error("Erro ao carregar dados do dashboard:", error);
    },
  });

  useEffect(() => {
    console.log("=== DASHBOARD EFFECT - CARREGANDO DADOS ===");
    loadDashboardData();
  }, [loadDashboardData]);

  console.log("=== DASHBOARD STATE ===");
  console.log("isPending:", isPending);
  console.log("dashboardData:", dashboardData);

  if (isPending) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Dashboard</PageTitle>
            <PageDescription>
              Visão geral da sua clínica e agendamentos
            </PageDescription>
          </PageHeaderContent>
        </PageHeader>
        <PageContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Carregando dados...</span>
          </div>
        </PageContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Visão geral da sua clínica e agendamentos
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddDoctorButton />
        </PageActions>
      </PageHeader>

      <PageContent>
        <DashboardCards
          totalAppointments={dashboardData.stats.total}
          confirmedAppointments={dashboardData.stats.confirmed}
          pendingAppointments={dashboardData.stats.pending}
          monthlyRevenue={dashboardData.stats.totalRevenue}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TodayAppointments appointments={dashboardData.todayAppointments} />
          <TopDoctors doctors={dashboardData.topDoctors} />
        </div>

        <TopSpecialties topSpecialties={dashboardData.topSpecialties} />
      </PageContent>
    </PageContainer>
  );
}
