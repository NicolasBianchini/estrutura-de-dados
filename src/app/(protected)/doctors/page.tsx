

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
import DoctorCard from "./_components/doctor-card";

const DoctorsPage = async () => {
  // Dados mockados
  const doctors = [
  {
    id: "1",
    name: "Dr. João Belém",
    specialty: "Direito Civil",
    avatarImageUrl: "/WhatsApp Image 2025-06-11 at 18.19.26.jpeg",
    availableFromTime: "08:00",
    availableToTime: "17:00",
    availableFromWeekDay: 1, // Segunda
    availableToWeekDay: 5,   // Sexta
  },
  {
    id: "2",
    name: "Dr. Felipe Vargas",
    specialty: "Direito Desportivo",
    avatarImageUrl: "https://i.pravatar.cc/150?img=8",
    availableFromTime: "09:00",
    availableToTime: "16:00",
    availableFromWeekDay: 1,
    availableToWeekDay: 5,
  },
  {
    id: "3",
    name: "Dr. Gabriel Klein",
    specialty: "Direito Digital",
    avatarImageUrl: "https://i.pravatar.cc/150?img=12",
    availableFromTime: "08:00",
    availableToTime: "17:00",
    availableFromWeekDay: 1, // Segunda
    availableToWeekDay: 5,   // Sexta
  },
  {
    id: "4",
    name: "Dr. Nicolas Bianchini",
    specialty: "Direito Administrativo",
    avatarImageUrl: "https://i.pravatar.cc/150?img=12",
    availableFromTime: "08:00",
    availableToTime: "17:00",
    availableFromWeekDay: 1, // Segunda
    availableToWeekDay: 5,   // Sexta
  },
];

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Advogados</PageTitle>
          <PageDescription>Gerencie os advogados da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddDoctorButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
