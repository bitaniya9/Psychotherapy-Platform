import prisma from "./prisma";
import { Appointment } from "../../domain/entities/Appointment";
import {
  IAppointmentRepository,
  CreateAppointmentDTO,
  AppointmentListResult,
} from "../../application/interfaces/IAppointmentRepository";
import { AppError } from "../../domain/exceptions/AppError";

export class PrismaAppointmentRepository implements IAppointmentRepository {
  async create(data: CreateAppointmentDTO): Promise<Appointment> {
    try {
      const ap = await prisma.appointment.create({ data: {
        patientId: data.patientId,
        therapistId: data.therapistId,
        scheduledAt: data.scheduledAt,
        duration: data.duration ?? 60,
        notes: data.notes,
      } as any });
      return Appointment.fromPersistence(ap as any);
    } catch (e: any) {
      throw new AppError(`DB error creating appointment: ${e.message || e}`, "PRISMA_ERROR", 500);
    }
  }

  async findById(id: string): Promise<Appointment | null> {
    try {
      const ap = await prisma.appointment.findUnique({ where: { id } });
      return ap ? Appointment.fromPersistence(ap as any) : null;
    } catch (e: any) {
      throw new AppError(`DB error finding appointment: ${e.message || e}`, "PRISMA_ERROR", 500);
    }
  }

  async listByUser(userId: string, page = 1, size = 10): Promise<AppointmentListResult> {
    try {
      const skip = (page - 1) * size;
      const [appointments, total] = await prisma.$transaction([
        prisma.appointment.findMany({
          where: { OR: [{ patientId: userId }, { therapist: { userId } as any }] } as any,
          skip,
          take: size,
          orderBy: { scheduledAt: "desc" },
        }),
        prisma.appointment.count({ where: { OR: [{ patientId: userId }, { therapist: { userId } as any }] } as any }),
      ]);
      return {
        appointments: (appointments as any[]).map((a) => Appointment.fromPersistence(a)),
        total,
      };
    } catch (e: any) {
      throw new AppError(`DB error listing appointments: ${e.message || e}`, "PRISMA_ERROR", 500);
    }
  }

  async update(appointment: Appointment): Promise<Appointment> {
    try {
      const ap = await prisma.appointment.update({
        where: { id: appointment.id },
        data: { ...appointment.toJSON() } as any,
      });
      return Appointment.fromPersistence(ap as any);
    } catch (e: any) {
      throw new AppError(`DB error updating appointment: ${e.message || e}`, "PRISMA_ERROR", 500);
    }
  }

  async updateFields(id: string, data: any): Promise<Appointment> {
    try {
      const ap = await prisma.appointment.update({ where: { id }, data: { ...data, updatedAt: new Date() } as any });
      return Appointment.fromPersistence(ap as any);
    } catch (e: any) {
      throw new AppError(`DB error updating appointment fields: ${e.message || e}`, "PRISMA_ERROR", 500);
    }
  }
}
