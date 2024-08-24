export interface IAddressClient {
    _id: string;
    department: string;
    province: string;
    district: string;
    address: string;
    reference?: string;
    createdAt: string;
    updatedAt: string;
}

export class AddressClient {
    _id?: string;
    department: string;
    province: string;
    district: string;
    address: string;
    reference?: string;
    createdAt?: string;
    updatedAt?: string;
    constructor(addressClient: IAddressClient){
        this._id  = addressClient._id || null;
        this.department = addressClient.department || null;
        this.province = addressClient.province || null;
        this.district = addressClient.district || null;
        this.address = addressClient.address || null;
        this.reference = addressClient.reference || null;
        this.createdAt = addressClient.createdAt || null;
        this.updatedAt = addressClient.updatedAt || null;
    }
}