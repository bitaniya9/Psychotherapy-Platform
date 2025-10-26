import { Appointment } from "../../domain/entities/Appointment";

export interface CreateAppointmentDTO {
  patientId: string;
  therapistId: string;
  scheduledAt: Date;
  duration?: number;
  notes?: string;
}

export interface AppointmentListResult {
  appointments: Appointment[];
  total: number;
}

export interface IAppointmentRepository {
  create(data: CreateAppointmentDTO): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  listByUser(userId: string, page?: number, size?: number): Promise<AppointmentListResult>;
  update(appointment: Appointment): Promise<Appointment>;
  updateFields(id: string, data: any): Promise<Appointment>;
}
