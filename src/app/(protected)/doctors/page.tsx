"use client";

import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/lib/firebase";

import AddDoctorButton from "./_components/add-doctor-button";
import DoctorCard from "./_components/doctor-card";

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

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      console.log("Buscando advogados...");

      // Buscar usuários com role "admin" (advogados)
      const doctorsQuery = query(
        collection(db, "users"),
        where("role", "==", "admin")
      );

      const querySnapshot = await getDocs(doctorsQuery);
      const doctorsData: Doctor[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        doctorsData.push({
          id: data.id || doc.id,
          name: data.name || "Nome não informado",
          specialty: data.specialty || "Especialidade não informada",
          email: data.email || "",
          avatarImageUrl: data.avatarImageUrl,
          availableFromTime: data.availableFromTime || "08:00",
          availableToTime: data.availableToTime || "17:00",
          availableFromWeekDay: data.availableFromWeekDay || 1,
          availableToWeekDay: data.availableToWeekDay || 5,
          appointmentPrice: data.appointmentPrice,
        });
      });

      console.log("Advogados encontrados:", doctorsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Erro ao buscar advogados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const refreshDoctors = () => {
    loadDoctors();
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Advogados</PageTitle>
            <PageDescription>Gerencie os advogados do seu escritório</PageDescription>
          </PageHeaderContent>
        </PageHeader>
        <PageContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Carregando advogados...</span>
          </div>
        </PageContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Advogados</PageTitle>
          <PageDescription>Gerencie os advogados do seu escritório</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddDoctorButton onSuccess={refreshDoctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        {doctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum advogado cadastrado ainda.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Use o botão &quot;Adicionar advogado&quot; para cadastrar o primeiro advogado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} onUpdate={refreshDoctors} />
            ))}
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
