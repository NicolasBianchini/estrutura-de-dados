"use client";

import { CheckIcon, ClockIcon, MoreVerticalIcon, TrashIcon, XIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteAppointment } from "@/actions/delete-appointment";
import { updateAppointmentStatus } from "@/actions/update-appointment-status";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AppointmentData {
  id: string;
  status: string;
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
  description?: string;
  notes?: string;
}

interface AppointmentsTableActionsProps {
  appointment: AppointmentData;
  onUpdate?: () => void;
}

const AppointmentsTableActions = ({
  appointment,
  onUpdate,
}: AppointmentsTableActionsProps) => {
  const [notes, setNotes] = useState(appointment.notes || "");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const deleteAppointmentAction = useAction(deleteAppointment, {
    onSuccess: (result) => {
      console.log("Agendamento deletado com sucesso:", result);
      if (result.data?.success) {
        toast.success(result.data.message || "Agendamento deletado com sucesso.");
        onUpdate?.();
      }
    },
    onError: (error) => {
      console.error("Erro ao deletar agendamento:", error);
      toast.error("Erro ao deletar agendamento.");
    },
  });

  const updateStatusAction = useAction(updateAppointmentStatus, {
    onSuccess: (result) => {
      if (result.data?.success) {
        toast.success(result.data.message);
        setIsConfirmDialogOpen(false);
        setIsCancelDialogOpen(false);
        onUpdate?.();
      }
    },
    onError: () => {
      toast.error("Erro ao atualizar agendamento.");
    },
  });

  const handleDeleteAppointmentClick = () => {
    if (!appointment) {
      console.error("Appointment não encontrado");
      return;
    }
    console.log("Tentando deletar agendamento:", appointment.id);
    deleteAppointmentAction.execute({ id: appointment.id });
  };

  const handleConfirmAppointment = () => {
    updateStatusAction.execute({
      appointmentId: appointment.id,
      status: "confirmed",
      notes: notes.trim() || undefined,
    });
  };

  const handleCancelAppointment = () => {
    updateStatusAction.execute({
      appointmentId: appointment.id,
      status: "cancelled",
      notes: notes.trim() || undefined,
    });
  };

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

  const isPending = appointment.status === "pending";
  const isConfirmed = appointment.status === "confirmed";

  return (
    <div className="flex items-center gap-2">
      {getStatusBadge(appointment.status)}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{appointment.patient.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {isPending && (
            <>
              <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e: Event) => e.preventDefault()}>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Confirmar Agendamento
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar Agendamento</DialogTitle>
                    <DialogDescription>
                      Confirmar o agendamento de {appointment.patient.name} com {appointment.doctor.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="confirm-notes">Observações (opcional)</Label>
                      <Textarea
                        id="confirm-notes"
                        placeholder="Adicione observações sobre o agendamento..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleConfirmAppointment}
                      disabled={updateStatusAction.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {updateStatusAction.isPending ? "Confirmando..." : "Confirmar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e: Event) => e.preventDefault()}>
                    <XIcon className="h-4 w-4 mr-2" />
                    Cancelar Agendamento
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancelar Agendamento</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja cancelar o agendamento de {appointment.patient.name}?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cancel-notes">Motivo do cancelamento</Label>
                      <Textarea
                        id="cancel-notes"
                        placeholder="Explique o motivo do cancelamento..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                      Voltar
                    </Button>
                    <Button
                      onClick={handleCancelAppointment}
                      disabled={updateStatusAction.isPending}
                      variant="destructive"
                    >
                      {updateStatusAction.isPending ? "Cancelando..." : "Cancelar Agendamento"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}

          {isConfirmed && (
            <DropdownMenuItem
              onSelect={() => {
                updateStatusAction.execute({
                  appointmentId: appointment.id,
                  status: "completed",
                });
              }}
            >
              <ClockIcon className="h-4 w-4 mr-2" />
              Marcar como Concluído
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e: Event) => e.preventDefault()}>
                <TrashIcon className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja deletar esse agendamento?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser revertida. Isso irá deletar o agendamento
                  permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAppointmentClick}>
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AppointmentsTableActions;
