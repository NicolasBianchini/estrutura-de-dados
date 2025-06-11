import dayjs from "dayjs";

interface Params {
  from: string;
  to: string;
  session?: any; // ignorado
}

export const getDashboard = async ({ from, to }: Params) => {
  return {
    totalRevenue: { total: 5890000 },
    totalAppointments: { total: 78 },
    totalPatients: { total: 52 },
    totalDoctors: { total: 9 },
    topDoctors: [
      {
        id: "1",
        name: "Dr. João Belém",
        avatarImageUrl: "https://i.pravatar.cc/100?img=12",
        specialty: "Direito Civil",
        appointments: 23,
      },
      {
        id: "2",
        name: "Dr. Felipe Vargas",
        avatarImageUrl: "https://i.pravatar.cc/100?img=8",
        specialty: "Direito Desportivo",
        appointments: 33,
      },
      {
        id: "2",
        name: "Dr. Gabriel Klein",
        avatarImageUrl: "https://i.pravatar.cc/100?img=8",
        specialty: "Direito Digital",
        appointments: 20,
      },
      {
        id: "2",
        name: "Dr. Nicolas Bianchini",
        avatarImageUrl: "https://i.pravatar.cc/100?img=8",
        specialty: "Direito Administrativo",
        appointments: 33,
      },
    ],
    topSpecialties: [
      { specialty: "Direito Civil", appointments: 30 },
      { specialty: "Direito Desportivo", appointments: 20 },
      { specialty: "Direito Administrativo", appointments: 10 },
      { specialty: "Direito Digital", appointments: 10 },
    ],
    todayAppointments: [
      {
        id: "1",
        doctor: {
          name: "Dr. Felipe Vargas",
        },
        patient: {
          name: "Lucas Pereira",
        },
        date: new Date().toISOString(),
      },
      {
        id: "2",
        doctor: {
          name: "Dr. João Belém",
        },
        patient: {
          name: "Beatriz Ramos",
        },
        date: new Date().toISOString(),
      },
    ],
    dailyAppointmentsData: [
      {
        date: dayjs().subtract(3, "day").format("YYYY-MM-DD"),
        appointments: 4,
        revenue: 15000,
      },
      {
        date: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
        appointments: 7,
        revenue: 28000,
      },
      {
        date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
        appointments: 6,
        revenue: 25000,
      },
    ],
  };
};
