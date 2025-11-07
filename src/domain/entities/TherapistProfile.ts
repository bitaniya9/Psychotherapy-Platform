import {User} from '@domain/entities/User'
import {Appointment} from '@domain/entities/Appointment'


export type timeSlot={
    day:string,
    start:string;
    end:string,
}

export interface TherapistProps{
    id:string;
    userId:string;
    user:User;
    licenseNumber:string;
    specialization:string[];
    bio?:string |null;
    experience?:number |null;
    hourlyRate?:number | null;
    availability?:timeSlot[] |null ;
    isVerified:boolean;
    profileImgUrl?:string|null;
    profileImgPublicId?:string|null;
    createdAt:Date;
    updatedAt:Date;
    
    appointments:Appointment[]

}

export class TherapistProfile{
    private constructor(private props:TherapistProps){}

    static create(
        props:Omit<TherapistProps,"id"|"createdAt" |"updatedAt"|"isVerified">
    ):TherapistProfile{
        return new TherapistProfile({
            ...props,
            id:crypto.randomUUID(),
            createdAt:new Date(),
            updatedAt:new Date(),
            isVerified:false,
        })
    }

    static formPersistance(props:TherapistProps):TherapistProfile{
        return new TherapistProfile (props);
    }

    get id():string{
        return this.props.id;

    }

    get userId():string{
        return this.props.userId;
    }

    get user():User{
        return this.props.user;
    }

    get licenseNumber():string{
        return this.props.licenseNumber;
        
    }

    get specialization():string[]{
        return this.props.specialization;
    }

    get bio():string|null |undefined{
        return this.props.bio;
    }

    get experience():number|null|undefined{
        return this.props.experience;
    }
    
    get hourlyRate ():number|null|undefined{
        return this.props.hourlyRate;
    }

    get availability():Record<string,any>|null|undefined{
        return 
    }

    get isVerified():boolean{
        return this.props.isVerified;
    }

    get profileImgUrl():string|null|undefined{
        return this.props.profileImgUrl;
    }
    get profileImgPublicId():string|null|undefined{
        return this.props.profileImgPublicId;
    }

    get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get appointments():Appointment[]{
    return this.props.appointments;
  }

  updateSpecialization(newSpecialization:string):void{
    if(!this.props.specialization.includes(newSpecialization)){

        this.props.specialization=[...this.props.specialization,newSpecialization];
        this.props.updatedAt=new Date();
    }
  }
  addBio(newbio:string):void{
    if(!this.props.bio){
        this.props.bio=newbio;
        this.props.createdAt=new Date();
        this.props.updatedAt=new Date();
    }
    
  }

  updateBio(newBio:string):void{
    this.props.bio=newBio;
    this.props.updatedAt=new Date();
  }

  removeBio():void{
    this.props.bio=undefined;
    this.props.updatedAt=new Date();
  }

  updateExperience(newExperience:number):void{
    this.props.experience=newExperience;
    this.props.updatedAt=new Date();
  }

  removeExperience():void{
    this.props.experience=undefined;
    this.props.updatedAt=new Date();
  }

  updateHourlyRate(newHourlyRate:number):void{
    this.props.hourlyRate=newHourlyRate;
    this.props.updatedAt=new Date();
  }

  removeHourlyRate():void{
    this.props.hourlyRate=undefined;
    this.props.updatedAt=new Date();
  }

//   verify(licenseNumber:string):void{
//     if(licenseNumber){
//         this.props.isVerified=true;
//         this.props.updatedAt=new Date();
//     }
//     else{
//         this.props.isVerified=false;
//     }
//   }

    updateAvailability(newAvailability:timeSlot[]):void{
        this.props.availability=newAvailability;
        this.props.updatedAt=new Date();

    }

    addAvailability(slot:timeSlot):void{
        if(!this.props.availability){
            this.props.availability=[];  //initialize array if missing
            this.props.availability=[...this.props.availability,slot];
            this.props.updatedAt=new Date();
        }
    }

    removeAvailabilty(slot:timeSlot):void{
        if(this.props.availability?.includes(slot)){
            this.props.availability=this.props.availability.filter(s=>!(s.day===slot.day && s.start===slot.start && s.end===slot.end))
            this.props.updatedAt=new Date();
        }
        return;
    }

    verifyTherapist():void{
        this.props.isVerified=true;
        this.props.updatedAt=new Date();

    }

    updateProfileImgUrl(url:string,profileImgPublicId:string|null|undefined):void{
        this.props.profileImgUrl=url;
        this.props.profileImgPublicId=profileImgPublicId;
        this.props.updatedAt = new Date();
    }

    removeProfileImg():void{
        this.props.profileImgUrl=undefined;
        this.props.profileImgPublicId=undefined;
        this.props.updatedAt = new Date();
    }


    setAppointments(appointments:Appointment[]):void{
        this.props.appointments=appointments;
        this.props.updatedAt=new Date();
    }

    updateAppointments(appointment:Appointment):void{
        if(!this.props.appointments.find(a=>a.id===appointment.id)){
            this.props.appointments=[...this.props.appointments,appointment];
            this.props.updatedAt=new Date();
        }
    }

    cancelAppointment(appointmentId:string):void{
        this.props.appointments=this.props.appointments.filter(a=>!(a.id===appointmentId));
        this.props.updatedAt=new Date();
    }

    toJson(){
        return{
            id:this.props.id,
            userId:this.props.id,
            licenseNumber:this.props.licenseNumber,
            specialization:this.props.specialization,
            bio:this.props.bio,
            experience:this.props.experience,
            availabilty:this.props.availability,
            hourlyRate:this.props.hourlyRate,
            isVerified:this.props.isVerified,
        };
    }    
}
