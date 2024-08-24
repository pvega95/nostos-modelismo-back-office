import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { Company } from '../../../../models/company';
import { Document } from '../../../../models/document';
import { PaymentDeadline } from '../../../../models/payment-deadline';
import { CompanyService } from '../../setting/company/company.service';
import { DocumentService } from '../../setting/document/document.service';
import { PaymentDeadlineService } from '../../setting/payment-deadline/payment-deadline.service';
import { SaleNote } from 'app/models/sale-note';
import { WindowModalComponent } from '../../../../shared/window-modal/window-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Modal } from '../../../../enums/modal.enum';
import { Product } from 'app/models/product';
import { map, takeUntil } from 'rxjs/operators';
import { PaymentMethod } from 'app/models/payment-method';
import { PaymentMethodService } from '../../setting/payment-method/payment-method.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../invoice.service';
import { InvoicePresenter } from './create-edit-invoice.presenter';

@Component({
    selector: 'app-create-edit-invoice',
    templateUrl: './create-edit-invoice.component.html',
    styleUrls: ['./create-edit-invoice.component.scss'],
    providers: [InvoicePresenter],
})
export class CreateEditInvoiceComponent implements OnInit, OnDestroy {
    @Input() salesNoteInput: SaleNote = null;
    public companies: Company[];
    public documents: Document[];
    public paymentDeadlines: PaymentDeadline[];
    public paymentMethods: PaymentMethod[];
    public id: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private companyService: CompanyService,
        private documentService: DocumentService,
        private paymentDeadlineService: PaymentDeadlineService,
        private paymentMethodService: PaymentMethodService,
        private invoiceService: InvoiceService,
        public dialog: MatDialog,
        public presenter: InvoicePresenter,
        private _changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private route: ActivatedRoute
    ) {
        // this.initForm();
    }

    public get form(): FormGroup {
        return this.presenter.form;
    }

    public get vouchers(): FormArray {
        return this.form.get('voucherDetail') as FormArray;
    }

    public get voucherControls(): FormGroup[] {
        return this.vouchers.controls as FormGroup[];
    }

    ngOnInit(): void {
        this.route.params.subscribe(({ id }) => {
            if (id) {
                this.id = id;
                this.invoiceService
                    .getListInvoiceById(id)
                    .pipe(map((resp) => resp.data))
                    .subscribe((saleNote) => {
                        this.presenter.updateSaleNoteForm(saleNote[0]);
                    });
            }
        });

        // Get the categories
        this.companyService.companies$
            .pipe(
                map((resp: any) => resp.data),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((companies: Company[]) => {
                this.companies = companies;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the documents
        this.documentService.documents$
            .pipe(
                map((resp: any) => resp.data),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((documents: Document[]) => {
                this.documents = documents;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the paymentDeadlines
        this.paymentDeadlineService.paymentDeadlines$
            .pipe(
                map((resp: any) => resp.data),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((paymentDeadlines: PaymentDeadline[]) => {
                this.paymentDeadlines = paymentDeadlines;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the paymentMethod
        this.paymentMethodService.paymentMethods$
            .pipe(
                map((resp: any) => resp.data),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((paymentMethods: PaymentMethod[]) => {
                this.paymentMethods = paymentMethods;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Set the theme and scheme based on the configuration
        combineLatest([
            this.presenter.form.get('company').valueChanges,
            this.presenter.form.get('document').valueChanges,
        ]).subscribe((response) => {
            const companyID = response[0];
            const documentID = response[1];
            this.getCorrelative(companyID, documentID);
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getCorrelative(companyID: string, documentID: string): void {
        this.invoiceService
            .getSerie(companyID, documentID)
            .pipe(map((response) => response.data[0]))
            .subscribe(({ series, currentCorrelative }) => {
                this.presenter.updateSeriesForm(series, currentCorrelative);
            });
    }

    addItem(): void {
        const dialogRef = this.dialog.open(WindowModalComponent, {
            width: '48rem',
            height: '30rem',
            data: {
                type: Modal.newItem,
                voucherDetail: this.salesNoteInput
                    ? this.salesNoteInput.voucherDetail
                    : [],
            },
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe((products: Product[]) => {
            if (products) {
                this.presenter.addVoucherDetails(products);
                this.presenter.updateSaleNoteTotals();
            }
        });
    }

    onDelete(index: number): void {
        this.presenter.removeVoucherDetail(index);
    }

    cancelSelectedSaleNote(): void {}
    createSaleNote(): void {}
    saveSelectedSaleNote(): void {}

    quantityUpdated(product): void {
        this.presenter.updateVoucherDetail(product);
    }

    cancel(): void {
        this.router.navigate(['invoice']);
    }

    submitForm(): void {
        if (this.id) {
            const saleNote = new SaleNote(this.form.getRawValue());
            this.invoiceService.updateInvoice(saleNote, this.id).subscribe((resp) => {
                this.router.navigate(['invoice']);
            });
        } else {
            const saleNote = new SaleNote(this.form.getRawValue());
            delete saleNote['_id'];
            this.invoiceService.createInvoice(saleNote).subscribe((resp) => {
                this.router.navigate(['invoice']);
            });
        }
    }
}
