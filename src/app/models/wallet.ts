export interface IWallet {
    _id?: string;
    entity: string;
    name: string;
    images: any;
    createdAt?: string;
    updatedAt?: string;
}

export class Wallet {
    _id?: string;
    entity: string;
    name: string;
    images: any;
    createdAt?: string;
    updatedAt?: string;
    constructor(wallet: IWallet) {
        this._id  = wallet._id || null;
        this.entity = wallet.entity || null;
        this.name = wallet.name || null;
        this.images = wallet.images || null;
        this.createdAt = wallet.createdAt || null;
        this.updatedAt = wallet.updatedAt || null;
    }
}
