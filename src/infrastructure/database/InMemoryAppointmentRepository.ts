import { Appointment } from "../../domain/entities/Appointment";
import {
  IAppointmentRepository,
  CreateAppointmentDTO,
  AppointmentListResult,
} from "../../application/interfaces/IAppointmentRepository";

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private store: Map<string, any> = new Map();

  async create(data: CreateAppointmentDTO): Promise<Appointment> {
    const now = new Date();
    const obj = {
      id: crypto.randomUUID(),
      patientId: data.patientId,
      therapistId: data.therapistId,
      scheduledAt: data.scheduledAt,
      duration: data.duration ?? 60,
      meetLink: null,
      status: "PENDING",
      notes: data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    } as any;
    this.store.set(obj.id, obj);
    return Appointment.fromPersistence(obj as any);
  }

  async findById(id: string): Promise<Appointment | null> {
    const found = this.store.get(id);
    return found ? Appointment.fromPersistence(found as any) : null;
  }

  async listByUser(userId: string, page = 1, size = 10): Promise<AppointmentListResult> {
    const items = Array.from(this.store.values());
    const filtered = items.filter((a: any) => a.patientId === userId || a.therapistId === userId);
    const total = filtered.length;
    const skip = (page - 1) * size;
    const pageItems = filtered.sort((x: any, y: any) => +new Date(y.scheduledAt) - +new Date(x.scheduledAt)).slice(skip, skip + size);
    return {
      appointments: pageItems.map((a: any) => Appointment.fromPersistence(a as any)),
      total,
    };
  }

  async update(appointment: Appointment): Promise<Appointment> {
    const data = appointment.toJSON();
    this.store.set(data.id, { ...data });
    return Appointment.fromPersistence(this.store.get(data.id) as any);
  }

  async updateFields(id: string, data: any): Promise<Appointment> {
    const existing = this.store.get(id);
    if (!existing) throw new Error("Not found");
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.store.set(id, updated);
    return Appointment.fromPersistence(updated as any);
  }
}
