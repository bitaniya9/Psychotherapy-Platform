import {TherapistProfile} from '@domain/entities/TherapistProfile'
// import {Role} from '@prisma/client'
import {timeSlot} from '@domain/entities/TherapistProfile'
import {User} from '@domain/entities/User'

//DTO : things needed from the user(input)
export interface CreateTherapistProfileDTO{
    id:string,
    userId:string;
    licenseNumber:string;
    specialization:string[];
    bio?:string|null;
    experience?:number|null;
    availability:timeSlot[] |null;
    profileImgUrl?:string|null;
}

export interface PaginatedTherapistProfiles{
    therapistProfiles:TherapistProfile[];
    total:number;
}

export interface ITherapistProfileRepo{
    findById(id:string):Promise<TherapistProfile|null>;
    findByUserId(userId:string):Promise<TherapistProfile|null>;
    findByLicenseNumber(licenseNumber:string):Promise<TherapistProfile|null>
    create(data:CreateTherapistProfileDTO):Promise<TherapistProfile>
    update(therapistProfile:TherapistProfile):Promise<TherapistProfile>
    updateFields(
        id:string,
        data:Partial<{
            bio?:string;
            specialization?:string[];
            experience?:number;
            hourlyRate?:number;
            availability?:timeSlot[];
            profileImgUrl?:string;
            updatedAt: Date;
        }>
    ):Promise<TherapistProfile>
    delete(id:string):Promise<void>
    list(page:number,size:number):Promise<PaginatedTherapistProfiles>;
}