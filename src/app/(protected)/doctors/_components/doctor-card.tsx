"use client";

import {
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  TrashIcon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteDoctor } from "@/actions/delete-doctor";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import UpsertDoctorForm from "./upsert-doctor-form";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  avatarImageUrl?: string;
  availableFromTime: string;
  availableToTime: string;
  availableFromWeekDay: number;
  availableToWeekDay: number;
  appointmentPrice?: string;
}

interface DoctorCardProps {
  doctor: Doctor;
  onUpdate?: () => void;
}

const DoctorCard = ({ doctor, onUpdate }: DoctorCardProps) => {
  const [isUpsertDoctorDialogOpen, setIsUpsertDoctorDialogOpen] =
    useState(false);
  const deleteDoctorAction = useAction(deleteDoctor, {
    onSuccess: (result) => {
      if (result.data?.success) {
        toast.success(result.data.message || "Advogado deletado com sucesso.");
        onUpdate?.();
      } else {
        toast.error(result.data?.message || "Erro ao deletar advogado.");
      }
    },
    onError: (error) => {
      console.error("Erro ao deletar advogado:", error);
      toast.error("Erro ao deletar advogado.");
    },
  });
  const handleDeleteDoctorClick = () => {
    if (!doctor) return;
    console.log("Deletando advogado:", doctor.name, "ID:", doctor.id);
    deleteDoctorAction.execute({ id: doctor.id });
  };

  const doctorInitials = doctor.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  // Criar objeto de disponibilidade simples sem usar getAvailability
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const fromDay = weekDays[doctor.availableFromWeekDay];
  const toDay = weekDays[doctor.availableToWeekDay];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{doctor.name}</h3>
            <p className="text-muted-foreground text-sm">{doctor.specialty}</p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline">
          <CalendarIcon className="mr-1" />
          {fromDay} a {toDay}
        </Badge>
        <Badge variant="outline">
          <ClockIcon className="mr-1" />
          {doctor.availableFromTime} às {doctor.availableToTime}
        </Badge>
        {doctor.appointmentPrice && (
          <Badge variant="outline">
            <DollarSignIcon className="mr-1" />
            {doctor.appointmentPrice}
          </Badge>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2">
        <Dialog
          open={isUpsertDoctorDialogOpen}
          onOpenChange={setIsUpsertDoctorDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertDoctorForm
            doctor={doctor}
            onSuccess={() => {
              setIsUpsertDoctorDialogOpen(false);
              onUpdate?.();
            }}
            isOpen={isUpsertDoctorDialogOpen}
          />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <TrashIcon />
              Deletar advogado
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza que deseja deletar esse advogado?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser revertida. Isso irá deletar o advogado e
                todas as consultas agendadas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteDoctorClick}>
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
