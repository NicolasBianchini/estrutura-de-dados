export const generateTimeSlots = (fromTime?: string, toTime?: string) => {
  const slots = [];
  const startHour = fromTime ? parseInt(fromTime.split(':')[0]) : 8;
  const endHour = toTime ? parseInt(toTime.split(':')[0]) : 18;

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Pular horário de almoço (12:00 às 13:30)
      if (hour === 12 && minute === 0) continue;
      if (hour === 12 && minute === 30) continue;
      if (hour === 13 && minute === 0) continue;

      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`;
      slots.push(timeString);
    }
  }
  return slots;
};
