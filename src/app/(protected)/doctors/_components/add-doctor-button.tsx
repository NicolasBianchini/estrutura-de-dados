"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertDoctorForm from "./upsert-doctor-form";

interface AddDoctorButtonProps {
  onSuccess?: () => void;
}

const AddDoctorButton = ({ onSuccess }: AddDoctorButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar advogado
        </Button>
      </DialogTrigger>
      <UpsertDoctorForm onSuccess={handleSuccess} isOpen={isOpen} />
    </Dialog>
  );
};

export default AddDoctorButton;
