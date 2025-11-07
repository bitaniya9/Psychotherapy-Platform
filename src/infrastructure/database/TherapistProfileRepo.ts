import { TherapistProfile,timeSlot} from "../../domain/entities/TherapistProfile"
import { ITherapistProfileRepo,CreateTherapistProfileDTO, PaginatedTherapistProfiles } from "../../application/interfaces/ITherapistProfileRepo"
import prisma from "./prisma";
import { AppError, NotFoundError } from "../../domain/exceptions/AppError";


export class PrismaTherapistProfileRepository implements ITherapistProfileRepo{
    async findById(id: string): Promise<TherapistProfile | null> {
        if(!id || typeof id!=="string") return null;
        
        try{
            const therapistProfileData=await prisma.therapistProfile.findUnique({ where:{id}});
            return therapistProfileData? TherapistProfile.formPersistance(therapistProfileData as any):null;

        }catch(e:any){
            throw new AppError(
                `Database error when finding user by id: ${e.message || e}`,
                "PRISMA_ERROR",
                500
            );
        }
        
    }

    async findByUserId(userId: string): Promise<TherapistProfile | null> {
        if(!userId || typeof userId!=="string") return null;
        
        try{
            const userData=await prisma.therapistProfile.findUnique({ where:{userId}});
            return userData? TherapistProfile.formPersistance(userData as any):null;

        }catch(e:any){
            throw new AppError(
                `Database error when finding therapistProfile by id: ${e.message || e}`,
                "PRISMA_ERROR",
                500
            );
        }
        
    }

    async findByLicenseNumber(licenseNumber:string):Promise<TherapistProfile|null>{
        if(!licenseNumber || typeof licenseNumber !== "string") return null;

        try{
            const therapistProfileData=await prisma.therapistProfile.findUnique({where:{licenseNumber}})
            return therapistProfileData? TherapistProfile.formPersistance(therapistProfileData as any):null;

        }catch(e:any){
            throw new AppError(
                `Database error when finding therapist by license number: ${e.message ||e}`,
                "PRISMA_ERROR",
                500

            );

        }
        

    }

    async create(data:CreateTherapistProfileDTO):Promise<TherapistProfile>{
        try{
            const therapistProfileData=await prisma.therapistProfile.create({data: {...data} as any});
            return TherapistProfile.formPersistance(therapistProfileData as any);

        }catch(e:any){
            throw new AppError(
                `Database error when creating therapist profile: ${e.message || e}`,
                "PRISMA_ERROR",
                500
            );

        }


    }
    async update(therapistProfile:TherapistProfile):Promise<TherapistProfile>{
        try{
            const updatedData=await prisma.therapistProfile.update({
                where:{id:therapistProfile.id},
                data:{
                    bio:therapistProfile.bio,
                    specialization:therapistProfile.specialization,
                    experience:therapistProfile.experience,
                    hourlyRate:therapistProfile.hourlyRate,
                    availability: therapistProfile.availability
                    ? therapistProfile.availability.map((slot:timeSlot)=> ({
                        day: slot.day,
                        start: slot.start,
                        end: slot.end
                    }))
                    : null,
                    profileImgUrl:therapistProfile.profileImgUrl,
                    isVerified:therapistProfile.isVerified,
                    updatedAt:new Date()


                },
            });
            return TherapistProfile.formPersistance(updatedData as any);

        }catch(e:any){
            throw new AppError(
                `Database error when updating therapist profile: ${e.message||e}`,
                "PRISMA_ERROR",
                500

            );
        }
    }

    async updateFields(id: string, data: any): Promise<TherapistProfile> {
        try{
            const updatedData=await prisma.therapistProfile.update({
                where:{id},
                data:{...data,updatedAt:new Date()},
            });
            return TherapistProfile.formPersistance(updatedData as any);
        }catch(e:any){
            throw new AppError(
                `Database error when updating therapist profile fields: ${e.message ||e}`,
                "PRISMA_ERROR",
                500
            );
        }
        
    }

    async delete(id:string):Promise<void>{

        try{
            await prisma.therapistProfile.delete({where:{id}});

        }catch(e:any){
            throw new AppError(
                `Database error when deleting therapist profile: ${e.message ||e}`,
                "PRISMA_ERROR",
                500
            );
        }
    }

    async list(page=1,size=10):Promise<PaginatedTherapistProfiles>{
        try{
            const skip=(page-1)*size;
            const [therapistProfile,total]=await prisma.$transaction([
                prisma.therapistProfile.findMany({
                    skip,
                    take:size,
                    orderBy:{createdAt:"desc"}
                }),
                prisma.therapistProfile.count()
            ]);
            return{
                therapistProfiles:therapistProfile.map((t:any)=>TherapistProfile.formPersistance(t as any)),
                total,
            };

        }catch(e:any){
            throw new AppError(
                `Database error when listing therapist profiles: ${e.message ||e}`,
                "PRISMA_ERROR",
                500

            );

        }
    }
    
}