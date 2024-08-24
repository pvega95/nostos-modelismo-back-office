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


export class Invoice implements IInvoice {
    constructor(
      public client: IClient,
      public company: ICompany,
      public serie: string,
      public documentNumber: number,
      public registryDate: string,
      public paymentDeadline: IPayment,
      public paymentMethod: string,
      public status: string,
      public reference: string,
      public note: string,
      public voucherDetail: IDetail[],
      public brutoTotalNC: number,
      public discountTotalNC: number,
      public gravTotalNC: number,
      public exonTotalNC: number,
      public igvTotalNC: number,
      public salesTotalNC: number,
      public createdAt: string,
      public updatedAt: string
    ) {}
  
    static fromAPI(invoice: IInvoice): Invoice {
      const clientAddress: IAddress = {
        direccion: invoice.client.address.direccion,
        provincia: invoice.client.address.provincia,
        departamento: invoice.client.address.departamento,
        distrito: invoice.client.address.distrito,
        ubigueo: invoice.client.address.ubigueo,
      };
      const client: IClient = {
        tipoDoc: invoice.client.tipoDoc,
        numDoc: invoice.client.numDoc,
        rznSocial: invoice.client.rznSocial,
        address: clientAddress,
      };
      const companyAddress: IAddress = {
        direccion: invoice.company.address.direccion,
        provincia: invoice.company.address.provincia,
        departamento: invoice.company.address.departamento,
        distrito: invoice.company.address.distrito,
        ubigueo: invoice.company.address.ubigueo,
      };
      const company: ICompany = {
        ruc: invoice.company.ruc,
        razonSocial: invoice.company.razonSocial,
        nombreComercial: invoice.company.nombreComercial,
        address: companyAddress,
      };
      const payment: IPayment = {
        moneda: invoice.paymentDeadline.moneda,
        tipo: invoice.paymentDeadline.description,
      };
      const details: IDetail[] = invoice.voucherDetail.map((vd) => {
        return {
          codProducto: vd.sku,
          unidad: 'NIU',
          descripcion: vd.name,
          cantidad: vd.quantity,
          mtoValorUnitario: vd.unitaryAmountNC,
          mtoValorVenta: vd.quantity * vd.unitaryAmountNC,
          mtoBaseIgv: vd.quantity * vd.unitaryAmountNC,
          porcentajeIgv: 18,
          igv: 18,
          tipAfeIgv: 10,
          totalImpuestos: 18,
          mtoPrecioUnitario: vd.listprice,
        };
      });
      return new Invoice(
        client,
        company,
        invoice.serie,
        invoice.documentNumber,
        invoice.registryDate,
        payment,
        invoice.paymentMethod,
        invoice.status,
        invoice.reference,
        invoice.note,
        details,
        invoice.brutoTotalNC,
        invoice.discountTotalNC,
        invoice.gravTotalNC,
        invoice.exonTotalNC,
        invoice.igvTotalNC,
        invoice.salesTotalNC,
        invoice.createdAt,
        invoice.updatedAt
      );
    }
  }
  