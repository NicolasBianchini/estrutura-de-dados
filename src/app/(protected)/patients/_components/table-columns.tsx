"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

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
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
    case "completed":
      return <Badge className="bg-blue-100 text-blue-800">Concluído</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const createPatientsTableColumns = (): ColumnDef<ClientData>[] => [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
    cell: (params) => {
      const client = params.row.original;
      return (
        <div>
          <div className="font-medium">{client.name}</div>
          <div className="text-sm text-muted-foreground">{client.email}</div>
        </div>
      );
    },
  },
  {
    id: "appointments",
    header: "Agendamentos",
    cell: (params) => {
      const client = params.row.original;
      return (
        <div className="flex gap-2">
          <Badge variant="outline">
            Total: {client.totalAppointments}
          </Badge>
          {client.pendingAppointments > 0 && (
            <Badge className="bg-yellow-100 text-yellow-800">
              Pendentes: {client.pendingAppointments}
            </Badge>
          )}
          {client.confirmedAppointments > 0 && (
            <Badge className="bg-green-100 text-green-800">
              Confirmados: {client.confirmedAppointments}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "lastContact",
    header: "Último Contato",
    cell: (params) => {
      const client = params.row.original;
      if (!client.lastContact) {
        return <span className="text-muted-foreground">Nenhum contato</span>;
      }

      return (
        <div>
          <div className="font-medium">{client.lastContact.specialty}</div>
          <div className="text-sm text-muted-foreground">
            {new Date(client.lastContact.preferredDate).toLocaleDateString('pt-BR')}
          </div>
          {getStatusBadge(client.lastContact.status)}
        </div>
      );
    },
  },
  {
    id: "motivo",
    header: "Motivo do Contato",
    cell: (params) => {
      const client = params.row.original;
      if (!client.lastContact) {
        return <span className="text-muted-foreground">-</span>;
      }

      const description = client.lastContact.description;
      const shortDescription = description.length > 50
        ? description.substring(0, 50) + "..."
        : description;

      return (
        <div className="max-w-xs">
          <p className="text-sm">{shortDescription}</p>
          {description.length > 50 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  Ver mais
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Descrição Completa do Caso</DialogTitle>
                  <DialogDescription>
                    Cliente: {client.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Especialidade:</h4>
                    <p>{client.lastContact.specialty}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Advogado:</h4>
                    <p>{client.lastContact.lawyerName}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Descrição do Caso:</h4>
                    <p className="text-sm">{description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Data Solicitada:</h4>
                    <p>{new Date(client.lastContact.preferredDate).toLocaleDateString('pt-BR')} às {client.lastContact.preferredTime}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Status:</h4>
                    {getStatusBadge(client.lastContact.status)}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: (params) => {
      const client = params.row.original;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Ver Histórico
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Histórico de Agendamentos - {client.name}</DialogTitle>
              <DialogDescription>
                Todos os agendamentos e solicitações do cliente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-auto">
              {client.appointments.length === 0 ? (
                <p className="text-muted-foreground">Nenhum agendamento encontrado.</p>
              ) : (
                client.appointments.map((appointment, index) => (
                  <div key={appointment.id} className="border p-4 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Agendamento {index + 1}</h4>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Advogado:</strong> {appointment.lawyerName}
                      </div>
                      <div>
                        <strong>Especialidade:</strong> {appointment.specialty}
                      </div>
                      <div>
                        <strong>Data:</strong> {new Date(appointment.preferredDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <strong>Horário:</strong> {appointment.preferredTime}
                      </div>
                    </div>
                    <div className="mt-2">
                      <strong>Descrição:</strong>
                      <p className="text-sm text-muted-foreground mt-1">{appointment.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

// Manter compatibilidade com código existente
export const patientsTableColumns = createPatientsTableColumns();
