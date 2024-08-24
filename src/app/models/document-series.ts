import { Company } from "./company";
import { Document } from "./document";

export interface IDocumentSeries {
    _id?: string;
    document: Document;
    series: string;
    company: Company;
    currentCorrelative: number;
}

export class DocumentSeries {
    _id?: string;
    document: Document;
    series: string;
    company: Company;
    currentCorrelative: number;
    constructor(DocumentSeries: IDocumentSeries){
        this._id  = DocumentSeries._id || null;
        this.document = DocumentSeries.document || null;
        this.series = DocumentSeries.series || null;
        this.company = DocumentSeries.company || null;
        this.currentCorrelative = DocumentSeries.currentCorrelative || null;
    }
}