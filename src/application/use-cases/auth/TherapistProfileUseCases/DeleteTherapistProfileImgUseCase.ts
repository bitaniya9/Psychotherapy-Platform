import { TherapistProfile } from "@domain/entities/TherapistProfile";
import { ICloudinaryService } from "@application/interfaces/ICloudinaryService";
import { ITherapistProfileRepo } from "@application/interfaces/ITherapistProfileRepo";

export interface DeleteTherapistProfileImgDTO{
    id:string
    publicId:string
}

export class DeleteTherapistProfileUseCase{
    constructor(
        private therapistProfileRepo:ITherapistProfileRepo,
        private cloudinaryService:ICloudinaryService
    ){}

    async execute(dto:DeleteTherapistProfileImgDTO){
        const therapist=await this.therapistProfileRepo.findById(dto.id);

        if(!therapist){
            throw new Error ("Therapist Profile not found")
        }

        const deletedProfile=await this.cloudinaryService.deleteImage(dto.publicId);

        therapist.removeProfileImg();

        await this.therapistProfileRepo.update(therapist);

        return {
            therapist:therapist.toJson(),
            deletedPublicId:dto.publicId,
        }


    }
}