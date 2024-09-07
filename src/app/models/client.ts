export interface IClient {
    id: string | number;
    typeDocument: string;
    numberDocument: string;
    comercialName: string;
}

export class Client {
    id: string | number;
    typeDocument: string;
    numberDocument: string;
    comercialName: string;
    constructor(client: IClient){
        this.id  = client.id || null;
        this.typeDocument = client.typeDocument || null;
        this.numberDocument = client.numberDocument || null;
        this.comercialName = client.comercialName || null;
    }
}