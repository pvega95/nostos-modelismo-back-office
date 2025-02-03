import { v4 as uuidv4 } from 'uuid';

interface IFullName {
    name: string;
    lastName: string;
}

interface IBillingAddress {
    _id: string;
    department: string;
    province: string;
    district: string;
    address: string;
    reference: string | null;
}

interface IClient {
    full_name: IFullName;
    status: boolean;
    email: string;
    typeDocument: string;
    numberDocument: string;
    billing_address: IBillingAddress[];
    phone: string;
    createdAt: string;
    updatedAt: string;
    uid: string;
}

class Client {
    full_name: IFullName;
    status: boolean;
    email: string;
    typeDocument: string;
    numberDocument: string;
    billing_address: IBillingAddress[];
    phone: string;
    createdAt: string;
    updatedAt: string;
    uid: string;

    constructor(
        client?: IClient
    ) {
        this.full_name = client?.full_name || { name: 'Nuevo Cliente', lastName: '' };
        this.status = client?.status || true;
        this.email = client?.email || '';
        this.typeDocument = client?.typeDocument || '';
        this.numberDocument = client?.numberDocument || '';
        this.billing_address = client?.billing_address || [];
        this.phone = client?.phone || '';
        this.createdAt = client?.createdAt;
        this.updatedAt = client?.updatedAt;
        this.uid = uuidv4();
    }

    setFullName(client): any {
       this.full_name = {
         name: client?.name || '',
         lastName: client?.lastName || ''
       }
    }

    // Example method to get the full name as a string
    getFullName(): string {
        return `${this.full_name.name} ${this.full_name.lastName}`;
    }

    // Example method to check if the client is active
    isActive(): boolean {
        return this.status;
    }

}

export default Client
