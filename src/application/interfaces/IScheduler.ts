export interface IScheduler{
    schedule(cronExpression:string,task:()=>Promise<void>):void
}