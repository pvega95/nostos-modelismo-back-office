import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-summary-sale-note',
    templateUrl: './summary-sale-note.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        DecimalPipe
    ],
})
export class SummarySaleNoteComponent implements OnInit {
    @Input() form: FormGroup;
    totalGrossNC: number;
    totalDiscountNC: number;
    totalOperationGravNC: number;
    totalOperationExonNC: number;
    totalIGV: number;
    totalAmountNC: number;
    deliveryAmount: number;
    subscriptionProducts: Subscription;
    ngOnInit(): void {
        console.log(this.form)
        this.calculationTotals(this.products.getRawValue());
        this.setDelivery(this.deliveryForm.get('price').value);
        this.subscriptionProducts = this.products.valueChanges.subscribe(
            (products) => {
                this.calculationTotals(products);
            }
        );

        this.deliveryForm.valueChanges.subscribe(
            ({ price }) => {
                this.setDelivery(price);
            }
        );
    }

    public get products(): FormArray {
        return this.form.get('voucherDetail') as FormArray;
    }

    public get deliveryForm(): FormGroup {
        return this.form.get('delivery') as FormGroup;
    }

    calculationTotals(products: any[]): void {
        this.totalGrossNC = products.reduce((a, b) => a + b.unitaryAmountNC * b.quantity, 0);
        this.totalDiscountNC = products.reduce((a, b) => a + (b.unitaryAmountNC * b.quantity) * (b.discount / 100), 0);
        this.totalOperationGravNC = products.reduce((a, b) => a + b.brutoAmountNC - b.discountAmountNC, 0);
        // this.totalOperationGravNC = this.totalGrossNC - this.totalDiscountNC;
        this.totalOperationExonNC = 0;
        this.totalIGV = products.reduce((a, b) => a + b.igvAmountNC, 0);
        this.totalAmountNC = this.totalOperationGravNC + this.totalOperationExonNC + this.totalIGV;
    }

    setDelivery(price: number): void {
        this.deliveryAmount = price;
    }
}
