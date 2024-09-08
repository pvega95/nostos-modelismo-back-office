import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SaleNotePresenter } from './sales-create-update.presenter';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SaleNote } from 'app/models/sale-note';
import { Product } from 'app/models/product';
import { PaymentMethod } from 'app/models/payment-method';
import { PaymentDeadline } from 'app/models/payment-deadline';
import { Modal } from 'app/enum/modal.enum';
import { Company } from 'app/models/company';
import { STATUS_ORDER } from 'app/enum/status.enum';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from 'app/modules/settings/company/company.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { DocumentService } from 'app/modules/settings/document/document.service';
import { PaymentDeadlineService } from 'app/modules/settings/payment-deadline/payment-deadline.service';
import { PaymentMethodService } from 'app/modules/settings/payment-method/payment-method.service';

@Component({
    selector: 'sales-create-update',
    templateUrl: './sales-create-update.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [SaleNotePresenter],
    imports: [
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        AsyncPipe,
        RouterModule
    ],
})
export class SalesCreateUpdateComponent {
    public companies: Company[];
    public documents: Document[];
    public paymentDeadlines: PaymentDeadline[];
    public statusList: string[] = STATUS_ORDER;
    public paymentMethods: PaymentMethod[];
    public id: string;
    public salesNoteInput: SaleNote;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    companies$: Observable<any>;
    documents$: Observable<any>;
    paymentDeadlines$: Observable<any>;
    paymentMethods$: Observable<any>;

    /**
     * Constructor
     */
    constructor(
        private _companyService: CompanyService,
        private _documentService: DocumentService,
        private _paymentDeadlineService: PaymentDeadlineService,
        private _paymentMethodService: PaymentMethodService,
        // private saleNoteService: SaleNoteService,
        public dialog: MatDialog,
        public presenter: SaleNotePresenter,
        private _changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private route: ActivatedRoute
    ) {}

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
        // Get the companies
        this.companies$ = this._companyService.companies$;
        // Get the documents
        this.documents$ = this._documentService.documents$;
        // Get the paymentDeadlines
        this.paymentDeadlines$ = this._paymentDeadlineService.paymentDeadlines$;
        // Get the paymentMethod
        this.paymentMethods$ = this._paymentMethodService.paymentMethods$;

        this.route.params.subscribe(({ id }) => {
            if (id) {
                this.id = id;
                // this.saleNoteService
                //     .getListSaleNoteById(id)
                //     .pipe(map((resp:any) => resp.data))
                //     .subscribe((saleNote) => {
                //         this.salesNoteInput = saleNote[0];
                //         this.presenter.updateSaleNoteForm(saleNote[0]);
                //         this.presenter.document.disable();
                //     });
            }
        });

        // Get the companies
        // this.companyService.companies$
        //     .pipe(
        //         map((resp: any) => resp.data),
        //         takeUntil(this._unsubscribeAll)
        //     )
        //     .subscribe((companies: Company[]) => {
        //         console.log(companies)
        //         this.companies = companies;
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // Get the documents
        // this.documentService.documents$
        //     .pipe(
        //         map((resp: any) => resp.data),
        //         takeUntil(this._unsubscribeAll)
        //     )
        //     .subscribe((documents: Document[]) => {
        //         this.documents = documents;
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // Get the paymentDeadlines
        // this.paymentDeadlineService.paymentDeadlines$
        //     .pipe(
        //         map((resp: any) => resp.data),
        //         takeUntil(this._unsubscribeAll)
        //     )
        //     .subscribe((paymentDeadlines: PaymentDeadline[]) => {
        //         this.paymentDeadlines = paymentDeadlines;
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // Get the paymentMethod
        // this.paymentMethodService.paymentMethods$
        //     .pipe(
        //         map((resp: any) => resp.data),
        //         takeUntil(this._unsubscribeAll)
        //     )
        //     .subscribe((paymentMethods: PaymentMethod[]) => {
        //         this.paymentMethods = paymentMethods;
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

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
        //this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getCorrelative(companyID: string, documentID: string): void {
        if (this.id) {
            return;
        }
        // this.saleNoteService
        //     .getSerie(companyID, documentID)
        //     .pipe(map((response: any) => response?.data[0]))
        //     .subscribe(({ series, currentCorrelative }) => {
        //         this.presenter.updateSeriesForm(series, currentCorrelative);
        //     });
    }

    addItem(): void {
        // const dialogRef = this.dialog.open(WindowModalComponent, {
        //     width: '48rem',
        //     height: '30rem',
        //     data: {
        //         type: Modal.newItem,
        //         voucherDetail: this.presenter.voucherDetail.getRawValue(),
        //     },
        //     disableClose: true,
        // });
        // dialogRef.afterClosed().subscribe((products: Product[]) => {
        //     if (products) {
        //         this.presenter.addVoucherDetails(products);
        //         this.presenter.updateSaleNoteTotals();
        //     }
        // });
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
        this.router.navigate(['salenote']);
    }

    submitForm(): void {
        if (this.id) {
            const saleNote = new SaleNote(this.form.getRawValue());
            // this.saleNoteService
            //     .updateSaleNote(saleNote, this.id)
            //     .subscribe((resp) => {
            //         this.router.navigate(['salenote']);
            //     });
        } else {
            const saleNote = new SaleNote(this.form.getRawValue());
            delete saleNote['_id'];
            // this.saleNoteService.createSaleNote(saleNote).subscribe((resp) => {
            //     this.router.navigate(['salenote']);
            // });
        }
    }
}
