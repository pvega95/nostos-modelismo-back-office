export interface IUnid {
    _id?: string;
    description: string;
    abreviation: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

export class Unid {
    _id?: string;
    description: string;
    abreviation: string;
    status: boolean;
    createdAt?: string;
    updatedAt?: string;
    constructor(unid: Unid) {
        this._id  = unid._id || null;
        this.description = unid.description || null;
        this.abreviation = unid.abreviation || null;
        this.status = unid.status || false;
        this.createdAt = unid.createdAt || null;
        this.updatedAt = unid.updatedAt || null;
    }
}
