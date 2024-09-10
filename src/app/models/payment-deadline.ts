export interface IPaymentDeadline {
    _id?: string;
    description: string;
    days: number;
    createdAt?: string;
    updatedAt?: string;
}

export class PaymentDeadline {
    _id?: string;
    description: string;
    days: number;
    createdAt?: string;
    updatedAt?: string;
    constructor(PaymentDeadline: IPaymentDeadline){
        this._id  = PaymentDeadline._id || null;
        this.description = PaymentDeadline.description || null;
        this.days = PaymentDeadline.days || null;
        this.createdAt = PaymentDeadline.createdAt || null;
        this.updatedAt = PaymentDeadline.updatedAt || null;
    }
}