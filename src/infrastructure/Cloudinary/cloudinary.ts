import {v2 as cloudinary} from 'cloudinary'
import { ICloudinaryService } from '@application/interfaces/ICloudinaryService';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

export class CloudinaryService implements ICloudinaryService{
    async uploadImage(filepath:string,folder?:string,publicId?:string):Promise<{url:string,public_Id:string}>{
        try{
            const result=await cloudinary.uploader.upload(filepath,{
                folder:folder ||"uploads",
                public_id:publicId,
                overwrite:true,
                invalidate:true,
            });
            return {url:result.secure_url,public_Id:result.public_id}

        }catch(error:any){
            console.log(`Could not upload image:${error.message}`)
            throw new Error ("Image upload failed");
        }
        
    }

    async deleteImage(publicId: string): Promise<void> {
        try{
            const result= await cloudinary.uploader.destroy(publicId);
            console.log('Image has been deleted successfully')
        }catch(error:any){
            console.log(`Could not delete image:${error.message}`)
        }
        
    }
}

