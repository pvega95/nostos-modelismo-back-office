export interface IClient {
    id: string | number;
    typeDocument: string;
    numberDocument: string;
    comercialName: string;
    email: string;
    phone: string;
    avatar: string;
    background: string;
}

export class Client {
    id: string | number;
    typeDocument: string;
    numberDocument: string;
    comercialName: string;
    email: string;
    phone: string;
    avatar: string;
    background: string;
    constructor(client: IClient){
        this.id  = client.id || null;
        this.typeDocument = client.typeDocument || null;
        this.numberDocument = client.numberDocument || null;
        this.comercialName = client.comercialName || null;
        this.email = client.email || null;
        this.phone = client.phone || null;
        this.avatar = client.avatar || null;
        this.background = client.background || null;
    }
}
