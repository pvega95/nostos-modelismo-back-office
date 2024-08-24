export interface IDelivery {
    address: string;
    price: number;
}

export class Delivery {
    address: string;
    price: number;
    constructor(delivery: IDelivery) {
        this.address = delivery.address || null;
        this.price = delivery.price || 0;
    }
}
