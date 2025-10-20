import { IUserRepository } from "@application/interfaces/IUserRepository";

export class CleanExpiredOTPUseCase{
    constructor(
        private userRepository:IUserRepository
    ){}

    async execute():Promise<void>{
        try{
            console.log("Cleaning expired OTP..");
            await this.userRepository.updateFieldsForExpiredTokens(new Date());
            console.log("Cleaned expired tokens")

        }catch(error:any){
            console.log("Failed to clean expired OTP:",error.message)

        }
    }
}