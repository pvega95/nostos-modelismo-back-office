export interface IAccountBank {
    _id?: string;
    entity: string;
    typeAccount: string;
    currency: string;
    owner: string;
    numberAccount: string;
    cciAccount: string;
    createdAt?: string;
    updatedAt?: string;
}

export class AccountBank {
    _id?: string;
    entity: string;
    typeAccount: string;
    currency: string;
    owner: string;
    numberAccount: string;
    cciAccount: string;
    createdAt?: string;
    updatedAt?: string;
    constructor(accountBank: IAccountBank) {
        this._id  = accountBank._id || null;
        this.entity = accountBank.entity || null;
        this.typeAccount = accountBank.typeAccount || null;
        this.currency = accountBank.currency || null;
        this.owner = accountBank.owner || null;
        this.numberAccount = accountBank.numberAccount || null;
        this.cciAccount = accountBank.cciAccount || null;
        this.createdAt = accountBank.createdAt || null;
        this.updatedAt = accountBank.updatedAt || null;
    }
}
