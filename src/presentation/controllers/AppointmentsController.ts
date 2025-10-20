import { Request, Response } from "express";
import { createAppointmentSchema, listAppointmentsSchema, updateAppointmentSchema } from "../validators/appointmentValidators";
import { PrismaAppointmentRepository } from "../../infrastructure/database/AppointmentRepository";
import { MeetScheduler } from "../../infrastructure/meet/MeetScheduler";
import { Appointment } from "../../domain/entities/Appointment";
import { AuthRequest } from "../middlewares/authenticate";

const repo = new PrismaAppointmentRepository();
const scheduler = new MeetScheduler();

export class AppointmentsController {
  static async create(req: AuthRequest, res: Response) {
    const parsed = createAppointmentSchema.parse(req.body);
    const patientId = req.user?.id;
    if (!patientId) return res.status(401).json({ success: false, message: "Authentication required" });
    const starts = new Date(parsed.startsAt);
    const ends = new Date(parsed.endsAt);
    const duration = Math.max(1, Math.round((ends.getTime() - starts.getTime()) / 60000));
    const dto = {
      patientId,
      therapistId: parsed.therapistId,
      scheduledAt: starts,
      duration,
      notes: parsed.reason,
    };
    const ap = await repo.create(dto as any);
    // schedule meet creation job
    scheduler.scheduleMeetCreation(ap.id);
    res.status(201).json({ success: true, data: ap.toJSON(), message: "Appointment created" });
  }

  static async list(req: AuthRequest, res: Response) {
    const parsed = listAppointmentsSchema.parse(req.query as any);
    const page = Number(parsed.page || 1);
    const size = Number(parsed.size || 10);
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const result = await repo.listByUser(userId, page, size);
    res.json({ success: true, data: result, message: "Appointments fetched" });
  }

  static async getById(req: AuthRequest, res: Response) {
    const id = req.params.id;
    const ap = await repo.findById(id);
    if (!ap) return res.status(404).json({ success: false, message: "Appointment not found" });
    res.json({ success: true, data: ap.toJSON(), message: "Appointment fetched" });
  }

  static async update(req: AuthRequest, res: Response) {
    const id = req.params.id;
    const ap = await repo.findById(id);
    if (!ap) return res.status(404).json({ success: false, message: "Appointment not found" });
    const parsed = updateAppointmentSchema.parse(req.body);
    if (parsed.startsAt || parsed.endsAt) {
      const starts = parsed.startsAt ? new Date(parsed.startsAt) : ap.scheduledAt;
      const ends = parsed.endsAt ? new Date(parsed.endsAt) : new Date(ap.scheduledAt.getTime() + ap.duration * 60000);
      const duration = Math.max(1, Math.round((ends.getTime() - starts.getTime()) / 60000));
      ap.reschedule(starts, duration);
    }
    if (parsed.status) ap.changeStatus(parsed.status as any);
    if (parsed.reason) ap.toJSON().notes = parsed.reason; // quick set; repo update will persist
    const updated = await repo.update(ap);
    res.json({ success: true, data: updated.toJSON(), message: "Appointment updated" });
  }

  static async remove(req: AuthRequest, res: Response) {
    const id = req.params.id;
    const ap = await repo.findById(id);
    if (!ap) return res.status(404).json({ success: false, message: "Appointment not found" });
    // soft delete via status
    ap.changeStatus(("CANCELLED" as any));
    const updated = await repo.update(ap);
    res.json({ success: true, data: updated.toJSON(), message: "Appointment cancelled" });
  }
}

export default AppointmentsController;
