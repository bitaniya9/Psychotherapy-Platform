import {Appointment} from '@domain/entities/Appointment'
import {User} from '@domain/entities/User'


export interface PaymentProps{
    id:string;
    appointmentId:string;
    appointment:Appointment;
    userId:string;
    user:User;
    amount:number;
    currency:string;
    chapaReference?:string|null;
    status:string;
    paidAt?:Date |null;
    createdAt:Date;
    updatedAt:Date;
}

export class Payment{
    private constructor(private props:PaymentProps){}

    static create(
        props:Omit<PaymentProps,"id"|"updatedAt"|"createdAt"|"currency"|"status">
    ):Payment{
        return new Payment({
            ...props,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            currency:"ETB",
            status:"PENDING"

        });

    }

    static fromPersistence(props:PaymentProps):Payment{
        return new Payment(props);

    }
    get id(): string {
        return this.props.id;
    }

    get appointmentId():string{
        return this.props.appointmentId;
    }

    get appointment(): Appointment{
        return this.props.appointment;
    }

    get userId(): string{
        return this.props.userId;
    }

    get user():User{
        return this.props.user;
    }

    get amount():number{
        return this.props.amount;
    }

    get currency():string{
        return this.props.currency;
    }

    get chapaReference():string|null|undefined{
        return this.props.chapaReference;
    }

    get status():string{
        return this.props.status;
    }

    get paidAt():Date|null|undefined{
        return this.props.paidAt;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    markAsCompleted(chapaReference:string):void{
        this.props.status="COMPLETED";
        this.props.chapaReference=chapaReference;
        this.props.paidAt=new Date();
        this.props.updatedAt = new Date();
    }

    markAsFailed():void{
        this.props.status="FAILED";
        this.props.updatedAt=new Date();
    }

    updateAmount(amount:number):void{
        if(this.props.status==="COMPLETED"){
            throw new Error("Can not change amount if already paid");
        }
        if(this.props.amount<0){
            throw new Error("Amount must be positive")
        }
        this.props.amount=amount;  
        this.props.updatedAt = new Date();
        
    }

    updateCurrency(currency:string):void{
        if(this.props.status==="COMPLETED"){
            throw new Error("Can not change currency if already paid")
        }
        this.props.currency=currency;
        this.props.updatedAt = new Date();

    }

    updateChapaReference(chapaReference:string):void{
        this.props.chapaReference=chapaReference;
        this.props.updatedAt = new Date();
    }

    deleteChapaReference():void{
        this.props.chapaReference=undefined;
        this.props.updatedAt = new Date();
    }

    deletepaidAt():void{
        this.props.paidAt=undefined;
        this.props.updatedAt = new Date();
    }


    toJSON() {
        return {
            id:this.props.id,
            appointmentId:this.props.appointmentId,
            appointment:this.props.appointment,
            userId:this.props.userId,
            user:this.props.user,
            amount:this.props.amount,
            currency:this.props.currency,
            chapaReference:this.props.chapaReference,
            status:this.props.status,
            paidAt:this.props.paidAt,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,     

        };
    }

}