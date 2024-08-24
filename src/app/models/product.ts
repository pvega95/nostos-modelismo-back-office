import { resizeImg } from 'app/utils/resize-img';

export interface IProduct {
    _id: string;
    sku: string;
    name: string;
    category: string;
    brand: string;
    unid: string;
    discount: number;
    listprice: number;
    descriptions: string[];
    images: File[];
    stock: number;
    hasIGV: boolean;
    grossPrice: number;
    igvPrice: number;
    netoprice: number;
}

export class Product {
    _id: string;
    sku: string;
    name: string;
    category: string;
    brand: string;
    unid: string;
    discount: number;
    listprice: number;
    descriptions: string[];
    images: File[];
    stock: number;
    hasIGV: boolean;
    grossPrice: number;
    igvPrice: number;
    netoprice: number;
    constructor(product: IProduct){
        this._id  = product._id || null;
        this.sku  = product.sku || null;
        this.name = product.name || null;
        this.category = product.category || null;
        this.brand = product.brand || null;
        this.unid = product.unid || null;
        this.discount = product.discount || 0;
        this.listprice = product.listprice || null;
        this.descriptions = product.descriptions || [];
        this.images = resizeImg(product.images, '/b_black,c_pad,h_54,w_54') || [];
        this.stock = product.stock || 99;
        this.hasIGV = product.hasIGV || true;
        this.grossPrice = product.grossPrice || null;
        this.igvPrice = product.igvPrice || null;
        this.netoprice = product.netoprice || null;
    }
}
