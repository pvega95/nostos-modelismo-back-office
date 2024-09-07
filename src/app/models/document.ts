export interface IDocument {
    _id?: string;
    description: string;
    abreviation: string;
    typeDocument: string;
}

export class Document {
    _id?: string;
    description: string;
    abreviation: string;
    typeDocument: string;
    constructor(document: IDocument){
        this._id  = document._id || null;
        this.description = document.description || null;
        this.abreviation = document.abreviation || null;
        this.typeDocument = document.typeDocument || null;
    }
}