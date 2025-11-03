export interface ICloudinaryService{
    uploadImage(
        filepath:string,
        folder?:string,
        publicId?:string
    ):Promise<{url:string,public_Id:string}>;
    deleteImage(publicId:string):Promise<void>;
}