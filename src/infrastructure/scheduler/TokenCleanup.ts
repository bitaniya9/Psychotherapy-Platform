import { NodeCronScheduler } from "./NodeCronScheduler";
import { PrismaUserRepository } from "../database/UserRepository";
import { CleanExpiredOTPUseCase } from "../../application/use-cases/auth/CleanExpiredOTPUseCase";

export function startOTPCleanup(){
    const scheduler=new NodeCronScheduler;
    const userRepository=new PrismaUserRepository();
    const useCase=new CleanExpiredOTPUseCase(userRepository);

    scheduler.schedule("*/10 * * * *", async ()=>{
        console.log("Starting OTP cleanup..")
        await useCase.execute();
    });
    
    // scheduler.schedule("*/1 * * * *", async ()=>{
    //     console.log("Starting OTP cleanup..")
    //     await useCase.execute();
    // });

}