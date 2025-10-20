import { IAppointmentRepository } from "../../application/interfaces/IAppointmentRepository";

// A very small scheduler that simulates creating a meeting (e.g., Zoom) asynchronously.
// It will wait a short time then add a fake meet link to the appointment.
export class MeetScheduler {
  constructor(private repo: IAppointmentRepository) {}

  scheduleMeetCreation(appointmentId: string) {
    // simulate background job (non-blocking)
    setTimeout(async () => {
      try {
        const ap = await this.repo.findById(appointmentId);
        if (!ap) return;
        // if already cancelled, skip
        if (ap.status === "CANCELLED") return;
        const url = `https://meet.example.com/${appointmentId}`;
        ap.setMeetLink(url);
        // mark as confirmed when meet created
        ap.changeStatus("CONFIRMED");
        await this.repo.update(ap);
      } catch (e) {
        // swallow errors for now — in real app log or push to job retry queue
        console.error("Meet creation failed", e);
      }
    }, 1000); // wait 1s to simulate
  }
}
