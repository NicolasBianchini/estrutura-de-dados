"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { getAllClients } from "@/actions/get-all-clients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import PatientCard from "./_components/patient-card";
import { createPatientsTableColumns } from "./_components/table-columns";

interface ClientData {
  id: string;
  name: string;
  email: string;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  lastContact: {
    lawyerName: string;
    specialty: string;
    description: string;
    status: string;
    preferredDate: string;
    preferredTime: string;
  } | null;
  appointments: Array<{
    id: string;
    lawyerName: string;
    specialty: string;
    description: string;
    status: string;
    preferredDate: string;
    preferredTime: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

const PatientsPage = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    clientsWithAppointments: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
  });

  const { execute: loadClients, isPending } = useAction(getAllClients, {
    onSuccess: (result) => {
      if (result.data?.success) {
        setClients(result.data.data.clients);
        setStats(result.data.data.stats);
      }
    },
    onError: (error) => {
      console.error("Erro ao carregar clientes:", error);
    },
  });

  useEffect(() => {
    loadClients({});
  }, [loadClients]);

  if (isPending) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Clientes</PageTitle>
          </PageHeaderContent>
        </PageHeader>
        <PageContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Carregando clientes...</span>
          </div>
        </PageContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Clientes</PageTitle>
          <PageDescription>
            Gerencie os clientes do seu escritório e visualize seus motivos de contato
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                Clientes registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clientsWithAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Clientes que já solicitaram consultas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Consultas solicitadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando confirmação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista responsiva de clientes */}
        <div className="block md:hidden space-y-4">
          {clients.map((client) => (
            <div key={client.id}>
              {/* Adaptando os dados para o PatientCard se necessário */}
              <PatientCard patient={{
                id: client.id,
                name: client.name,
                email: client.email,
                phoneNumber: '', // Adapte se houver telefone
                sex: 'male', // Adapte se houver sexo
                createdAt: new Date(client.createdAt),
                updatedAt: client.updatedAt ? new Date(client.updatedAt) : null,
                clinicId: '', // Adicionado para satisfazer o tipo
              }} />
            </div>
          ))}
        </div>
        <div className="hidden md:block">
          <DataTable
            data={clients}
            columns={createPatientsTableColumns()}
          />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default PatientsPage;
