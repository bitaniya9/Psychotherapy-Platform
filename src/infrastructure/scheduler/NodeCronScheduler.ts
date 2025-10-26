import cron from "node-cron"
import { IScheduler } from "@application/interfaces/IScheduler"

export class NodeCronScheduler implements IScheduler{
    schedule(cronExpression:string, task:()=>Promise<void>):void{
        cron.schedule(cronExpression,async()=>{
            try{
                await task();

            }catch(error:any){
                console.log("Cron task failed:",error.message)
            }
        });

    }
}