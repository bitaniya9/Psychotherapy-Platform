import { NodeCronScheduler } from "./NodeCronScheduler";
import { PrismaUserRepository } from "../database/UserRepository";
import { CleanExpiredOTPUseCase } from "../../application/use-cases/auth/CleanExpiredOTPUseCase";

export class startOTPCleanup{
    
    constructor(
        private scheduler:NodeCronScheduler,
        // private userRepository:PrismaUserRepository,
        private useCase:CleanExpiredOTPUseCase
    ){}

    start(){
        this.scheduler.schedule("*/10 * * * *", async ()=>{
            console.log("Starting OTP cleanup..")
            await this.useCase.execute();
        });
    }
}


    
    // this.scheduler.schedule("*/1 * * * *", async ()=>{
    //     console.log("Starting OTP cleanup..")
    //     await useCase.execute();
    // });
