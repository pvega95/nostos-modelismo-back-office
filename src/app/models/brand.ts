export interface IBrand {
    _id?: string;
    description: string;
    abreviation: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

export class Brand {
    _id?: string;
    description: string;
    abreviation: string;
    status: boolean;
    createdAt?: string;
    updatedAt?: string;
    constructor(brand: IBrand) {
        this._id  = brand._id || null;
        this.description = brand.description || null;
        this.abreviation = brand.abreviation || null;
        this.status = brand.status || false;
        this.createdAt = brand.createdAt || null;
        this.updatedAt = brand.updatedAt || null;
    }
}
