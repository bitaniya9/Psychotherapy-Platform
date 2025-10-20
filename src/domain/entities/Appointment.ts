export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface AppointmentProps {
  id: string;
  patientId: string;
  therapistId: string;
  scheduledAt: Date;
  duration: number; // minutes
  meetLink?: string | null;
  status: AppointmentStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Appointment {
  private constructor(private props: AppointmentProps) {}

  static create(props: Omit<AppointmentProps, "id" | "createdAt" | "updatedAt" | "status">) {
    return new Appointment({
      ...props,
      id: crypto.randomUUID(),
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as AppointmentProps);
  }

  static fromPersistence(props: AppointmentProps) {
    return new Appointment(props);
  }

  get id() {
    return this.props.id;
  }

  get patientId() {
    return this.props.patientId;
  }

  get therapistId() {
    return this.props.therapistId;
  }

  get scheduledAt() {
    return this.props.scheduledAt;
  }

  get duration() {
    return this.props.duration;
  }

  get meetLink() {
    return this.props.meetLink;
  }

  get status() {
    return this.props.status;
  }

  get notes() {
    return this.props.notes;
  }

  reschedule(newDate: Date, newDuration?: number) {
    this.props.scheduledAt = newDate;
    if (typeof newDuration === "number") this.props.duration = newDuration;
    // when rescheduling, set back to pending until confirmed
    this.props.status = "PENDING";
    this.props.updatedAt = new Date();
  }

  changeStatus(status: AppointmentStatus) {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  setMeetLink(url: string) {
    this.props.meetLink = url;
    this.props.updatedAt = new Date();
  }

  setNotes(notes: string) {
    this.props.notes = notes;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return { ...this.props };
  }
}
