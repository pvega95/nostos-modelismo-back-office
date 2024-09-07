export interface IVoucherDetail {
    id: string | number;
    sku: string;
    name: string;
    quantity: number;
    igv: number;
    discount: number;
    unitaryAmountNC: number;
    brutoAmountNC: number;
    discountAmountNC: number;
    salesAmountNC: number;
    igvAmountNC: number;
    totalAmountNC: number;
}

export class VoucherDetail {
    id: string | number;
    sku: string;
    name: string;
    quantity: number;
    igv: number;
    discount: number;
    unitaryAmountNC: number;
    brutoAmountNC: number;
    discountAmountNC: number;
    salesAmountNC: number;
    igvAmountNC: number;
    totalAmountNC: number;
    constructor(voucherDetail: IVoucherDetail){
        this.id  = voucherDetail.id || null;
        this.sku = voucherDetail.sku || null;
        this.name = voucherDetail.name || null;
        this.quantity = voucherDetail.quantity || null;
        this.igv = voucherDetail.igv || null;
        this.discount = voucherDetail.discount || null;
        this.unitaryAmountNC = voucherDetail.unitaryAmountNC || null;
        this.brutoAmountNC = voucherDetail.brutoAmountNC || null;
        this.discountAmountNC = voucherDetail.discountAmountNC || null;
        this.salesAmountNC = voucherDetail.salesAmountNC || null;
        this.igvAmountNC = voucherDetail.igvAmountNC || null;
        this.totalAmountNC = voucherDetail.totalAmountNC || null;

    }
}
