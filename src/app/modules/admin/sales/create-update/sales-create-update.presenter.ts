import { Injectable } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
// import { Product } from 'app/models/product';
import { SaleNote } from 'app/models/sale-note';
// import { VoucherDetail } from 'app/models/voucher-detail';
import { environment } from '../../../../../environments/environment';
import { Product } from 'app/models/product';
import { VoucherDetail } from 'app/models/voucher-detail';
import { formatDate, stringToDate } from 'app/utils/date';

@Injectable()
export class SaleNotePresenter {
    form: FormGroup;
    _id: FormControl;
    client: FormControl;
    company: FormControl;
    document: FormControl;
    serie: FormControl;
    documentNumber: FormControl;
    registryDate: FormControl;
    paymentDeadline: FormControl;
    paymentMethod: FormControl;
    status: FormControl;
    reference: FormControl;
    note: FormControl;
    dispatchStatus: FormControl;
    voucherDetail: FormArray;
    brutoTotalNC: FormControl;
    discountTotalNC: FormControl;
    gravTotalNC: FormControl;
    exonTotalNC: FormControl;
    igvTotalNC: FormControl;
    salesTotalNC: FormControl;
    createdAt: FormControl;
    updatedAt: FormControl;

    constructor(
        protected fb: FormBuilder,
        private fuseUtilsService: FuseUtilsService
        ) {
        this.createValidators();
        this.createForm();
    }

    createForm(): void {
        this.form = this.fb.group({
            _id: this._id,
            client: this.client,
            company: this.company,
            document: this.document,
            serie: this.serie,
            documentNumber: this.documentNumber,
            registryDate: this.registryDate,
            paymentDeadline: this.paymentDeadline,
            paymentMethod: this.paymentMethod,
            status: this.status,
            reference: this.reference,
            note: this.note,
            dispatchStatus: this.dispatchStatus,
            voucherDetail: this.voucherDetail,
            brutoTotalNC: this.brutoTotalNC,
            discountTotalNC: this.discountTotalNC,
            gravTotalNC: this.gravTotalNC,
            exonTotalNC: this.exonTotalNC,
            igvTotalNC: this.igvTotalNC,
            salesTotalNC: this.salesTotalNC,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        });
        this.form.controls.createdAt.disable();
        this.form.controls.updatedAt.disable();
    }

    public addVoucherDetail(product: Product): void {
        const existProduct = this.voucherDetail.controls.findIndex(
            (x: FormControl) => x.value.sku === product.sku
        );
        if (existProduct > -1) {
            const quantityControl = this.voucherDetail
                .at(existProduct)
                .get('quantity');
            const quantity = quantityControl.value ;
            const unitaryAmountNC = product.grossPrice;
            const sku = product.sku;
            const brutoAmountNC = quantity * unitaryAmountNC;
            const discountAmountNC = brutoAmountNC * (product.discount / 100);
            const salesAmountNC = brutoAmountNC - discountAmountNC;
            const igvAmountNC = salesAmountNC * environment.IGV;
            this.voucherDetail.at(existProduct).patchValue(
                {
                    quantity,
                    sku,
                    brutoAmountNC,
                    discountAmountNC,
                    salesAmountNC,
                    igvAmountNC,
                }
            );
            this.updateSaleNoteTotals();
        } else {
            const formProduct = this.createVoucherDetailForm();
            const quantity = 1;
            const unitaryAmountNC = product.grossPrice;
            const sku = product.sku;
            const brutoAmountNC = unitaryAmountNC * quantity;
            const discountAmountNC = brutoAmountNC * (product.discount / 100);
            const salesAmountNC = brutoAmountNC - discountAmountNC;
            const igvAmountNC = salesAmountNC * environment.IGV;
            formProduct.patchValue({
                ...product,
                sku,
                quantity,
                unitaryAmountNC,
                brutoAmountNC,
                discountAmountNC,
                salesAmountNC,
                igvAmountNC,
            });
            this.voucherDetail.push(formProduct);
        }
    }

    public updateVoucherDetail(voucherDetail: VoucherDetail): void {
        const existProduct = this.voucherDetail.controls.findIndex(
            (x: FormControl) => x.value.sku === voucherDetail.sku
        );
        if (existProduct > -1) {
            const quantity = voucherDetail.quantity;
            const unitaryAmountNC = voucherDetail.unitaryAmountNC;
            const brutoAmountNC = quantity * unitaryAmountNC;
            const discountAmountNC =
                brutoAmountNC * (voucherDetail.discount / 100);
            const salesAmountNC = brutoAmountNC - discountAmountNC;
            const igvAmountNC = salesAmountNC * environment.IGV;
            this.voucherDetail.at(existProduct).patchValue(
                {
                    quantity,
                    brutoAmountNC,
                    discountAmountNC,
                    salesAmountNC,
                    igvAmountNC,
                },
                {
                    emitEvent: false,
                }
            );
        } else {
            const formProduct = this.createVoucherDetailForm();
            formProduct.patchValue(
                {
                    ...voucherDetail,
                },
                {
                    emitEvent: false,
                }
            );
            this.voucherDetail.push(formProduct);
        }
    }

    public createVoucherDetailForm(): FormGroup {
        return this.fb.group({
            _id: new FormControl(),
            sku: new FormControl(),
            name: new FormControl(),
            quantity: new FormControl(),
            igv: new FormControl(),
            discount: new FormControl(),
            //VALOR UNITARIO X ITEM
            unitaryAmountNC: new FormControl(),
            //VALOR VENTA BRUTO
            brutoAmountNC: new FormControl(),
            //DESCUENTO X ITEM
            discountAmountNC: new FormControl(),
            //VALOR VENTA X ITEM
            salesAmountNC: new FormControl(),
            //IGV
            igvAmountNC: new FormControl(),
            // totalAmountNC: new FormControl(),
        });
    }

    public addVoucherDetails(products: any): void {
        products.forEach((product) => {
            this.addVoucherDetail(product);
        });
        this.voucherDetail.markAsPristine();
    }

    public updateSaleNoteTotals(): void {
        const voucherDetail = this.form.get('voucherDetail').value;
        const brutoTotalNC = voucherDetail.reduce(
            (a, b) => a + b.unitaryAmountNC * b.quantity,
            0
        );
        const discountTotalNC = voucherDetail.reduce(
            (a, b) => a + b.unitaryAmountNC * b.quantity * (b.discount / 100),
            0
        );
        const gravTotalNC = voucherDetail.reduce(
            (a, b) => a + b.brutoAmountNC - b.discountAmountNC,
            0
        );
        const exonTotalNC = 0;
        const igvTotalNC = voucherDetail.reduce((a, b) => a + b.igvAmountNC, 0);
        const salesTotalNC = gravTotalNC + exonTotalNC + igvTotalNC;
        this.form.patchValue(
            {
                brutoTotalNC,
                discountTotalNC,
                gravTotalNC,
                exonTotalNC,
                igvTotalNC,
                salesTotalNC,
            },
            {
                onlySelf: true,
                emitEvent: false,
            }
        );
    }

    public updateSeriesForm(serie: string, correlative: string): void {
        this.form.patchValue({
            serie: serie,
            documentNumber: correlative + 1,
        });
    }

    public updateSaleNoteForm(saleNote: SaleNote): void {
        const voucherDetail = saleNote?.voucherDetail;
        saleNote.createdAt = formatDate(stringToDate(saleNote.createdAt));
        saleNote.updatedAt = formatDate(stringToDate(saleNote.updatedAt));
        this.form.patchValue(saleNote);
        if (voucherDetail && voucherDetail.length > 0) {
            voucherDetail.forEach((product) => {
                this.updateVoucherDetail(product);
            });
            this.voucherDetail.markAsPristine();
        }
    }

    public removeVoucherDetail(index: number ): void {
        this.voucherDetail.removeAt(index);
    }

    private createValidators(): void {
        this._id = new FormControl('');
        this.client = new FormControl('', [Validators.required]);
        this.company = new FormControl('', [Validators.required]);
        this.document = new FormControl('', [Validators.required]);
        this.serie = new FormControl({ value: '', disabled: true });
        this.documentNumber = new FormControl({ value: '', disabled: true });
        this.registryDate = new FormControl('');
        this.paymentDeadline = new FormControl('', [Validators.required]);
        this.paymentMethod = new FormControl('');
        this.status = new FormControl('PENDIENTE');
        this.reference = new FormControl('');
        this.note = new FormControl('');
        this.dispatchStatus = new FormControl('PENDIENTE');
        this.voucherDetail = new FormArray([], [Validators.required]);
        this.brutoTotalNC = new FormControl(0);
        this.discountTotalNC = new FormControl(0);
        this.gravTotalNC = new FormControl(0);
        this.exonTotalNC = new FormControl(0);
        this.igvTotalNC = new FormControl(0);
        this.salesTotalNC = new FormControl(0);
        this.createdAt = new FormControl('');
        this.updatedAt = new FormControl('');
    }
}
