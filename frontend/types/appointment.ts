export type Appointment = {
  id: string;
  userId: string;
  therapistId: string;
  startsAt: string; // ISO
  endsAt?: string;
  notes?: string;
};
