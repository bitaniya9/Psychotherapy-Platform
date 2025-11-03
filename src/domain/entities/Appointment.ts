import {AppointmentStatus} from '@prisma/client'
import {User} from '@domain/entities/User'
import { TherapistProfile } from '@domain/entities/TherapistProfile';
import {Payment} from '@domain/entities/Payment'

export interface AppointmentProps{
    id:string;
    patientId:string;
    patient:User;
    therapistId:string;
    therapist:TherapistProfile;
    scheduledAt:Date;
    duration:number;
    meetLink?:string|null;
    status:AppointmentStatus;
    notes?:string |null ;
    createdAt:Date;
    updatedAt:Date;
    payment?:Payment|null;

}

export class Appointment{
  private constructor( private props:AppointmentProps){}

  static create(
      props:Omit<AppointmentProps,"id" |"createdAt" |"updatedAt"|"duration"|"status">
  ):Appointment{
      return new Appointment({
          ...props,
          id:crypto.randomUUID(),
          createdAt:new Date(),
          updatedAt:new Date(),
          duration:60,
          status:"PENDING"

      });

  }
  static fromPersistance(props:AppointmentProps):Appointment{
      return new Appointment(props);
  }
  get id(): string {
      return this.props.id;
  }
  get patientId():string{
      return this.props.patientId;
  }
  get patient():User{
      return this.props.patient;
  }
  get therapistId():string{
      return this.props.therapistId
  }

  get therapist():TherapistProfile{
      return this.props.therapist;
  }

  get scheduleAt():Date{
      return this.props.scheduledAt;
  }

  get duration():Number{
      return this.props.duration;
  }

  get meetLink():string|null|undefined{
      return this.props.meetLink;
  }

  get status():AppointmentStatus{
      return this.props.status;
  }

  get notes():string|null|undefined{
      return this.props.notes;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  } 

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

setPatientId(patientId:string):void{
  this.props.patientId=patientId;
  this.props.updatedAt=new Date();
}

  setPatient(patient:User):void{
    this.props.patient=patient;
    this.props.updatedAt=new Date();
  }

  setTherapistId(therapistId:string):void{
    this.props.therapistId=therapistId;
    this.props.updatedAt=new Date();
  }

  setTherapist(therapist:TherapistProfile):void{
    this.props.therapist=therapist;
    this.props.updatedAt=new Date();
  }

  setScheduledAt(date:Date):void{
    this.props.scheduledAt=date;
    this.props.updatedAt=new Date();
  }

  updateDuration(duration:number):void{
    this.props.duration=duration;
    this.props.updatedAt=new Date();
  }

  setMeeetingLink(meetingLink:string|null|undefined):void{
    this.props.meetLink=meetingLink;
    this.props.updatedAt=new Date();
  }

  removeMeetingLink():void{
    this.props.meetLink=undefined;
    this.props.updatedAt=new Date();
  }
  
  updateStatus(status:AppointmentStatus):void{
    this.props.status=status;
    this.props.updatedAt=new Date();
  }

  updateNotes(notes:string|null|undefined):void{
    this.props.notes=notes;
    
  }

  clearNotes():void{
    this.props.notes=undefined;
    this.props.updatedAt=new Date();
  }

  setPayment(payment:Payment):void{
    this.props.payment=payment;
    this.props.updatedAt=new Date();
  }
  removePayment():void{ 
    this.props.payment=undefined;
    this.props.updatedAt=new Date();
  }


  toJSON(){
    return{
      id:this.props.id,
      patientId:this.props.patientId,
      therapistId:this.props.therapistId, 
      scheduledAt:this.props.scheduledAt,
      duration:this.props.duration,
      meetLink:this.props.meetLink,
      status:this.props.status,
      notes:this.props.notes,
      createdAt:this.props.createdAt,
      updatedAt:this.props.updatedAt,
      // payment:this.props.payment,
    };
  }
}
