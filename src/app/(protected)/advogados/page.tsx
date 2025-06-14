"use client";

import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import {
    PageContainer,
    PageContent,
    PageDescription,
    PageHeader,
    PageHeaderContent,
    PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/lib/firebase";

import DoctorCardPublic from "../doctors/_components/doctor-card-public";

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
    bio?: string;
}

const PublicDoctorsPage = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);

    const loadDoctors = async () => {
        try {
            setLoading(true);
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
                    bio: data.bio || data.description || "",
                });
            });
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

    if (loading) {
        return (
            <PageContainer>
                <PageHeader>
                    <PageHeaderContent>
                        <PageTitle>Conheça nossos Advogados</PageTitle>
                        <PageDescription>Veja o perfil dos profissionais disponíveis para te ajudar</PageDescription>
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
                    <PageTitle>Conheça nossos Advogados</PageTitle>
                    <PageDescription>Veja o perfil dos profissionais disponíveis para te ajudar</PageDescription>
                </PageHeaderContent>
            </PageHeader>
            <PageContent>
                {doctors.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Nenhum advogado cadastrado ainda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <DoctorCardPublic key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                )}
            </PageContent>
        </PageContainer>
    );
};

export default PublicDoctorsPage; 