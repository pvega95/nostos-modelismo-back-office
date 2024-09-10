import { AsyncPipe, DecimalPipe } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { VoucherDetail } from 'app/models/voucher-detail';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
// import { environment } from '../../../../../../environments/environment';
@Component({
    selector: 'app-sale-note-item',
    templateUrl: './sale-note-item.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
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
            .editIcon:hover{
                color: blue !important;
            }
            .deleteIcon:hover{
                color: red !important;
            }
        `,
    ],
    imports: [
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        AsyncPipe,
        RouterModule,
        DecimalPipe
    ],
})
export class SaleNoteItemComponent implements OnInit, OnChanges, OnDestroy {
    @Input() index: number;
    @Input() vouchersLength: number;
    @Input() voucher: FormGroup;
    @Output() quantityUpdated: EventEmitter<any> = new EventEmitter();
    @Output() saleNoteDeleted: EventEmitter<number> = new EventEmitter();
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
        console.log('voucher', this.voucher)
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
        // this.brutoAmountNC = this.voucher.get('brutoAmountNC').value;
        // this.discountAmountNC = this.voucher.get('discountAmountNC').value;
        // this.salesAmountNC = this.voucher.get('salesAmountNC').value;
        // this.igvAmountNC = this.voucher.get('igvAmountNC').value;
         this.brutoAmountNC = voucher.quantity * voucher.unitaryAmountNC;
         this.discountAmountNC = this.brutoAmountNC * (voucher.discount / 100);
         this.salesAmountNC = this.brutoAmountNC - this.discountAmountNC;
         this.igvAmountNC = this.salesAmountNC * environment.IGV;
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
