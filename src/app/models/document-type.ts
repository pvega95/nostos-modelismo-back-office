export interface ITypeDocument {
    _id?: string;
    name: string;
    maxDigits: number;
}

export class TypeDocument {
    _id?: string;
    name: string;
    maxDigits: number;
    constructor(TypeDocument: ITypeDocument){
        this._id  = TypeDocument._id || null;
        this.name = TypeDocument.name || null;
        this.maxDigits = TypeDocument.maxDigits || null;
    }
}