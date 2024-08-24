import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-summary-invoice',
    templateUrl: './summary-invoice.component.html',
    // styles: [``],
})
export class SummaryInvoiceComponent implements OnInit {
    @Input() form: FormGroup;
    totalGrossNC: number;
    totalDiscountNC: number;
    totalOperationGravNC: number;
    totalOperationExonNC: number;
    totalIGV: number;
    totalAmountNC: number;
    subscriptionProducts: Subscription;
    ngOnInit(): void {
        this.calculationTotals(this.products.getRawValue());
        this.subscriptionProducts = this.products.valueChanges.subscribe(
            (products) => {
                this.calculationTotals(products);
            }
        );
    }

    public get products(): FormArray {
        return this.form.get('voucherDetail') as FormArray;
    }

    calculationTotals(products: any[]): void {
        this.totalGrossNC = products.reduce((a, b) => a + b.unitaryAmountNC * b.quantity , 0);
        this.totalDiscountNC = products.reduce((a, b) => a + (b.unitaryAmountNC * b.quantity) * ( b.discount / 100 ) , 0);
        this.totalOperationGravNC = products.reduce((a, b) => a + b.brutoAmountNC - b.discountAmountNC , 0);
        // this.totalOperationGravNC = this.totalGrossNC - this.totalDiscountNC;
        this.totalOperationExonNC = 0;
        this.totalIGV = products.reduce((a, b) => a + b.igvAmountNC, 0);
        this.totalAmountNC = this.totalOperationGravNC + this.totalOperationExonNC + this.totalIGV;
    }
}
