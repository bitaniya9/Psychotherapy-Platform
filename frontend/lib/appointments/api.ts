import api from "@/lib/api";
import type { Appointment } from "@/types/appointment";

export async function listAppointments() {
  const res = await api.get("/appointments");
  return res.data as Appointment[];
}

export async function createAppointment(payload: Partial<Appointment>) {
  const res = await api.post("/appointments", payload);
  return res.data as Appointment;
}
