import { Document } from './document';
import { PaymentDeadline } from './payment-deadline';
import { VoucherDetail } from './voucher-detail';

export interface ISaleNote {
    _id?: string;
    client: string;
    company: string;
    document: Document;
    serie: string;
    documentNumber: number;
    registryDate: string;
    paymentDeadline: PaymentDeadline;
    paymentMethod: string;
    status: string;
    reference: string;
    note: string;
    dispatchStatus: string;
    voucherDetail: VoucherDetail[];
    brutoTotalNC: number;
    discountTotalNC: number;
    gravTotalNC: number;
    exonTotalNC: number;
    igvTotalNC: number;
    salesTotalNC: number;
    createdAt: string;
    updatedAt: string;
}

export class SaleNote {
    _id?: string;
    client: string;
    company: string;
    document: Document;
    serie: string;
    documentNumber: number;
    registryDate: string;
    paymentDeadline: PaymentDeadline;
    paymentMethod: string;
    status: string;
    reference: string;
    note: string;
    dispatchStatus: string;
    voucherDetail: VoucherDetail[];
    brutoTotalNC: number;
    discountTotalNC: number;
    gravTotalNC: number;
    exonTotalNC: number;
    igvTotalNC: number;
    salesTotalNC: number;
    createdAt: string;
    updatedAt: string;
    constructor(saleNote: ISaleNote){
        this._id  = saleNote._id || null;
        this.client = saleNote.client || null;
        this.company = saleNote.company || null;
        this.document = saleNote.document || null;
        this.serie = saleNote.serie || null;
        this.documentNumber = saleNote.documentNumber || 0;
        this.registryDate = saleNote.registryDate || null;
        this.paymentDeadline = saleNote.paymentDeadline || null;
        this.paymentMethod = saleNote.paymentMethod || null;
        this.status = saleNote.status || null;
        this.reference = saleNote.reference || null;
        this.note = saleNote.note || null;
        this.dispatchStatus = saleNote.dispatchStatus || null;
        this.voucherDetail = saleNote.voucherDetail || [];
        this.brutoTotalNC = saleNote.brutoTotalNC || 0;
        this.discountTotalNC = saleNote.discountTotalNC || 0;
        this.gravTotalNC = saleNote.gravTotalNC || 0;
        this.exonTotalNC = saleNote.exonTotalNC || 0;
        this.igvTotalNC = saleNote.igvTotalNC || 0;
        this.salesTotalNC = saleNote.salesTotalNC || 0;
        this.createdAt = saleNote.createdAt || null;
        this.updatedAt = saleNote.updatedAt || null;
    }
}
