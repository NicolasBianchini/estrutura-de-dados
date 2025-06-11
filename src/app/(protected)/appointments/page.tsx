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

import AddAppointmentButton from "./_components/add-appointment-button";
import { appointmentsTableColumns } from "./_components/table-columns";

const AppointmentsPage = async () => {
  // Dados mockados
  const patients = [
    { id: "1", name: "L7NNON" },
    { id: "2", name: "TZ DA CORONEL" },
    { id: "3", name: "TRAVIS SCOTT" },
    { id: "4", name: "LUDMILLA" },
  ];

  const doctors = [
    { id: "1", name: "Dr. Felipe Vargas" },
    { id: "2", name: "Dr. João Belém" },
    { id: "3", name: "Dr. Gabriel Klein" },
    { id: "4", name: "Dr. Nicolas Bianchini" },
  ];

  const appointments = [
    {
      id: "1",
      date: new Date().toISOString(),
      doctor: { name: "Dr. Felipe Vargas" },
      patient: { name: "L7NNON" },
      appointmentPriceInCents: 15000,
    },
    {
      id: "2",
      date: new Date().toISOString(),
      doctor: { name: "Dr. João Belém" },
      patient: { name: "TRAVIS SCOTT" },
      appointmentPriceInCents: 18000,
    },
     {
      id: "3",
      date: new Date().toISOString(),
      doctor: { name: "Dr. Gabriel Klein" },
      patient: { name: "TZ DA CORONEL" },
      appointmentPriceInCents: 18000,
    },
     {
      id: "4",
      date: new Date().toISOString(),
      doctor: { name: "Dr. Nicolas Bianchini" },
      patient: { name: "LUDMILLA" },
      appointmentPriceInCents: 18000,
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable data={appointments} columns={appointmentsTableColumns} />
      </PageContent>
    </PageContainer>
  );
};

export default AppointmentsPage;
