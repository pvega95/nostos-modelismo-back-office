import { tipoComprobante } from 'app/const/sunat/tipo-comprobante';
import { tipoOperacion } from 'app/const/sunat/tipo-operacion';
import * as moment from 'moment';

interface IPayment {
    moneda: string;
    tipo: string;
}

interface IAddress {
    direccion: string;
    provincia: string;
    departamento: string;
    distrito: string;
    ubigueo: string;
}

interface IClient {
    tipoDoc: string;
    numDoc: number;
    rznSocial: string;
    address: IAddress;
}

interface ICompany {
    ruc: number;
    razonSocial: string;
    nombreComercial: string;
    address: IAddress;
}

interface IDetail {
    codProducto: string;
    unidad: string;
    descripcion: string;
    cantidad: number;
    mtoValorUnitario: number;
    mtoValorVenta: number;
    mtoBaseIgv: number;
    porcentajeIgv: number;
    igv: number;
    tipAfeIgv: number;
    totalImpuestos: number;
    mtoPrecioUnitario: number;
}

interface ILegend {
    code: string;
    value: string;
}

interface IInvoice {
    ublVersion: string;
    tipoOperacion: string;
    tipoDoc: string;
    serie: string;
    correlativo: string;
    fechaEmision: string;
    formaPago: IPayment;
    tipoMoneda: string;
    client: IClient;
    company: ICompany;
    mtoOperGravadas: number;
    mtoIGV: number;
    valorVenta: number;
    totalImpuestos: number;
    subTotal: number;
    mtoImpVenta: number;
    details: IDetail[];
    legends: ILegend[];
}

class Legends {
    code: string;
    value: string;
    setLegends(data: any): void {
        this.code = '1000';
        this.value = data.salesTotalNC;
    }
}

class Detail {
    codProducto: string;
    unidad: string;
    descripcion: string;
    cantidad: number;
    mtoValorUnitario: number;
    mtoValorVenta: number;
    mtoBaseIgv: number;
    porcentajeIgv: number;
    igv: number;
    tipAfeIgv: number;
    totalImpuestos: number;
    mtoPrecioUnitario: number;
    setDetail(data: any): void {
        this.codProducto = data.sku;
        this.unidad = 'NIU';
        this.descripcion = data.name;
        this.cantidad = data.quantity;
        this.mtoValorUnitario = data.unitaryAmountNC;
        this.mtoValorVenta = data.quantity * data.unitaryAmountNC;
        this.mtoBaseIgv = data.quantity * data.unitaryAmountNC;
        this.porcentajeIgv = 18;
        this.igv = 18;
        this.tipAfeIgv = 10;
        this.totalImpuestos = 18;
        this.mtoPrecioUnitario = data.listprice;
    }
}

class Company {
    ruc: number;
    razonSocial: string;
    nombreComercial: string;
    address: IAddress;
    setCompany(data: any): void {
        // por actualizar
        this.ruc = 20601958113;
        this.razonSocial = 'OPEN LAB S.A.C.';
        this.nombreComercial = 'OPEN LAB S.A.C.';
        this.address = {
            departamento: '',
            direccion: '',
            distrito: '',
            provincia: '',
            ubigueo: '',
        };
    }
}

class Payment {
    moneda: string;
    tipo: string;
    setPayment(data: any): void {
        this.moneda = 'PEN';
        this.tipo = data.description;
    }
}

class Client {
    tipoDoc: string;
    numDoc: number;
    rznSocial: string;
    address: IAddress;

    setClient(data: any): void {
        this.tipoDoc = '1';
        this.numDoc = data.numberDocument;
        this.rznSocial = data.comercialName;
        this.address = {
            departamento: '',
            direccion: '',
            distrito: '',
            provincia: '',
            ubigueo: '',
        };
    }
}

export class Invoice implements IInvoice {
    ublVersion: string;
    tipoOperacion: string;
    tipoDoc: string;
    serie: string;
    correlativo: string;
    fechaEmision: string;
    formaPago: IPayment;
    tipoMoneda: string;
    client: IClient;
    company: ICompany;
    mtoOperGravadas: number;
    mtoIGV: number;
    valorVenta: number;
    totalImpuestos: number;
    subTotal: number;
    mtoImpVenta: number;
    details: IDetail[];
    legends: ILegend[];

    constructor(invoice?: IInvoice) {
        this.ublVersion = invoice?.ublVersion || '2.1';
        this.tipoOperacion = invoice?.tipoOperacion || tipoOperacion[1].codigo;
        this.tipoDoc = invoice?.tipoDoc || tipoComprobante[0].codigo;
        this.serie = invoice?.serie || '';
        this.correlativo = invoice?.correlativo || '';
        this.fechaEmision = invoice?.fechaEmision || '';
        this.formaPago = invoice?.formaPago || null;
        this.tipoMoneda = invoice?.tipoMoneda || '';
        this.client = invoice?.client || null;
        this.company = invoice?.company || null;
        this.mtoOperGravadas = invoice?.mtoOperGravadas || 0;
        this.mtoIGV = invoice?.mtoIGV || 0;
        this.valorVenta = invoice?.valorVenta || 0;
        this.totalImpuestos = invoice?.totalImpuestos || 0;
        this.subTotal = invoice?.subTotal || 0;
        this.mtoImpVenta = invoice?.mtoImpVenta || 0;
        this.details = invoice?.details || [];
        this.legends = invoice?.legends || [];
    }

    setPayment(data: any): void {
        const payment = new Payment();
        payment.setPayment(data.paymentDeadline);
        this.formaPago = payment;
    }

    setClient(data: any): void {
        const client = new Client();
        client.setClient(data.client);
        this.client = client;
    }

    setCompany(data: any): void {
        const company = new Company();
        company.setCompany(data.company);
        this.company = company;
    }

    setDetails(data: any): void {
        const details = data.voucherDetail.map((x: any) => {
            const detail = new Detail();
            detail.setDetail(x);
            return detail;
        });
        this.details = details;
    }

    setLegends(data: any): void {
        const legend = new Legends();
        legend.setLegends(data);
        const array: ILegend[] = [];
        array.push(legend);
        this.legends = array;
    }

    setOthers(data: any): void {
        this.serie = data.serie;
        this.correlativo = data.documentNumber;
        this.fechaEmision = moment(data.createdAt).format('YYYY-MM-DD\THH:mm:ssZ');
        this.tipoMoneda = 'PEN';
        this.mtoOperGravadas = data.gravTotalNC;
        this.mtoIGV = 18;
        this.valorVenta = data.brutoTotalNC;
        this.totalImpuestos = data.igvTotalNC;
        this.subTotal = data.salesTotalNC;
        this.mtoImpVenta = data.salesTotalNC;
    }
}
