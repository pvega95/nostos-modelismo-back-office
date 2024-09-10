export interface IPaymentMethod {
    _id?: string;
    description: string;
    status?: boolean;
    createdAt: string;
    updatedAt: string;
}

export class PaymentMethod {
    _id?: string;
    description: string;
    status?: boolean;
    createdAt?: string;
    updatedAt?: string;
    constructor(paymentMethod: IPaymentMethod){
        this._id  = paymentMethod._id || null;
        this.description = paymentMethod.description || null;
        this.createdAt = paymentMethod.createdAt || null;
        this.updatedAt = paymentMethod.updatedAt || null;
    }
}
