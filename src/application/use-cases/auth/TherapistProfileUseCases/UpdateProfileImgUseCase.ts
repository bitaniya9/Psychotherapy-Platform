import {TherapistProfile} from 'domain/entities/TherapistProfile'
import { ITherapistProfileRepo} from '@application/interfaces/ITherapistProfileRepo'
import { ICloudinaryService } from '@application/interfaces/ICloudinaryService'

export interface UploadTherapistProfileDTO{
    id:string;
    filePath:string;
    folder?:string; //cloudinary folder name
    publicId?:string; //if wanted to update an existing one

}

export class UploadTherapistProfileUseCase{
    constructor(
        private cloudinaryService:ICloudinaryService,
        private therapistProfileRepo:ITherapistProfileRepo,
    ){}

    async execute(dto:UploadTherapistProfileDTO){
        //check if therapist exist
        const therapist=await this.therapistProfileRepo.findById(dto.id);
        if(!therapist){
            throw new Error ("Therapist profile not found")
        }
        //method to upload
        const uploadImg=await this.cloudinaryService.uploadImage(dto.filePath,dto.folder,dto.publicId);

        //update entity
        therapist.updateProfileImgUrl(uploadImg.url,uploadImg.public_Id)

        //save updated entity on db
        await this.therapistProfileRepo.update(therapist);

        return{
            therapist:therapist.toJson(),
            secure_url:uploadImg.url,
            publicId:uploadImg.public_Id
        }
    }
}