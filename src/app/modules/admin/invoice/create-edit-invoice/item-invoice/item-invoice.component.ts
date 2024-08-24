import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { VoucherDetail } from 'app/models/voucher-detail';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-item-invoice',
    templateUrl: './item-invoice.component.html',
    styles: [
        `
            .inventory-grid-create-edit {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: repeat(9, 1fr);
                }

                @screen lg {
                    grid-template-columns: repeat(9, 1fr);
                }
            }
        `,
    ],
})
export class InvoiceItemComponent implements OnInit, OnChanges, OnDestroy {
    @Input() index: number;
    @Input() vouchersLength: number;
    @Input() voucher: FormGroup;
    @Output() quantityUpdated: EventEmitter<any> = new EventEmitter();
    @Output() invoiceDeleted: EventEmitter<number> = new EventEmitter();
    sku = '';
    name = '';
    quantity = 0;
    unitaryAmountNC = 0;
    brutoAmountNC = 0;
    discountAmountNC = 0;
    salesAmountNC = 0;
    igvAmountNC = 0;
    subscription: Subscription;

    ngOnInit(): void {
        this.setInitialData();
        this.subscription = this.voucher.valueChanges.subscribe(
            (voucher: VoucherDetail) => {
                this.quantityUpdated.emit(voucher);
                this.calculationTotals(voucher);
            }
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.voucher &&
            changes.voucher.currentValue !== changes.voucher.previousValue
        ) {
            this.calculationTotals(this.voucher.getRawValue());
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    calculationTotals(voucher: VoucherDetail): void {
         this.brutoAmountNC = voucher.quantity * voucher.unitaryAmountNC;
         this.discountAmountNC = this.brutoAmountNC * (voucher.discount / 100);
         this.salesAmountNC = this.brutoAmountNC - this.discountAmountNC;
         this.igvAmountNC = this.salesAmountNC * 0.18;
    }

    private setInitialData(): void {
        this.sku = this.voucher.get('sku').value;
        this.name = this.voucher.get('name').value;
        this.quantity = this.voucher.get('quantity').value;
        this.unitaryAmountNC = this.voucher.get('unitaryAmountNC').value;
        this.brutoAmountNC = this.voucher.get('brutoAmountNC').value;
        this.discountAmountNC = this.voucher.get('discountAmountNC').value;
        this.salesAmountNC = this.voucher.get('salesAmountNC').value;
        this.igvAmountNC = this.voucher.get('igvAmountNC').value;
    }
}
