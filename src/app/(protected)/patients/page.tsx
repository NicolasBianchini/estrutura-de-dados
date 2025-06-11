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

import AddPatientButton from "./_components/add-patient-button";
import { patientsTableColumns } from "./_components/table-columns";

const PatientsPage = async () => {
  // Mock de pacientes
  const patients = [
    {
      id: "1",
      name: "L7NNON",
      email: "l7@gmail.com",
      phone: "(11) 98765-4321",
    },
    {
      id: "2",
      name: "TRAVIS SCOTT",
      email: "travis@gmail.com",
      phone: "(21) 91234-5678",
    },
    {
      id: "3",
      name: "TZ DA CORONEL",
      email: "tz@gmail.com",
      phone: "(31) 99876-5432",
    },
     {
      id: "4",
      name: "LUDMILLA",
      email: "ludmilla@gmail.com",
      phone: "(31) 93476-5432",
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>
            Gerencie os pacientes da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable data={patients} columns={patientsTableColumns} />
      </PageContent>
    </PageContainer>
  );
};

export default PatientsPage;
