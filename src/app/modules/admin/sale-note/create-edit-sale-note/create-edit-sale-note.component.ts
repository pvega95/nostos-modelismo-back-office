import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    EventEmitter,
    ViewChild,
} from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { Company } from '../../../../models/company';
import { Document } from '../../../../models/document';
import { PaymentDeadline } from '../../../../models/payment-deadline';
import { CompanyService } from '../../setting/company/company.service';
import { TypeDocumentService } from '../../setting/type-document/type-document.service';
import { DocumentService } from '../../setting/document/document.service';
import { PaymentDeadlineService } from '../../setting/payment-deadline/payment-deadline.service';
import { SaleNote } from 'app/models/sale-note';
import { WindowModalComponent } from '../../../../shared/window-modal/window-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { SaleNoteService } from '../sale-note.service';
import { Modal } from '../../../../enums/modal.enum';
import { STATUS_ORDER } from '../../../../enums/status.enum';
import { Product } from 'app/models/product';
import { SaleNotePresenter } from './create-edit-sale-note.presenter';
import { map, takeUntil } from 'rxjs/operators';
import { PaymentMethod } from 'app/models/payment-method';
import { PaymentMethodService } from '../../setting/payment-method/payment-method.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeDocument } from 'app/models/document-type';
import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
    selector: 'app-create-edit-sale-note',
    templateUrl: './create-edit-sale-note.component.html',
    styleUrls: ['./create-edit-sale-note.component.scss'],
    providers: [SaleNotePresenter],
})
export class CreateEditSaleNoteComponent implements OnInit, OnDestroy {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    public companies: Company[];
    public documents: Document[];
    public typeDocuments: TypeDocument[] = [];
    public paymentDeadlines: PaymentDeadline[];
    public statusList: string[] = STATUS_ORDER;
    public paymentMethods: PaymentMethod[];
    public id: string;
    public salesNoteInput: SaleNote;
    //expresion regular numeros y letras
    maskForInput: any = { mask: /^[A-Za-z0-9]+$/g }; //mask: Number
    maskForTelefone: any = { mask: Number, min: 0, max: 999999999 };
    maskForDelivery: any = { mask: Number, max: 999999, radix: '.' };
    drawerMode: 'side' | 'over';
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(
        private companyService: CompanyService,
        private fuseUtilsService: FuseUtilsService,
        private typeDocumentService: TypeDocumentService,
        private documentService: DocumentService,
        private paymentDeadlineService: PaymentDeadlineService,
        private paymentMethodService: PaymentMethodService,
        private saleNoteService: SaleNoteService,
        public dialog: MatDialog,
        public presenter: SaleNotePresenter,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
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
        this._activatedRoute.params.subscribe(({ id }) => {
            if (id) {
                this.id = id;
                this.saleNoteService
                    .getListSaleNoteById(id)
                    .pipe(map((resp: any) => resp.data))
                    .subscribe((saleNote) => {
                        this.salesNoteInput = saleNote[0];
                        this.presenter.updateSaleNoteForm(saleNote[0]);
                        this.presenter.document.disable();
                    });
            }
        });

        // Get the companies
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

        // Get the typeDocuments
        this.typeDocumentService.typeDocuments$
            .pipe(
                map((resp: any) => resp.data),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((typeDocuments: TypeDocument[]) => {
                this.typeDocuments = typeDocuments;
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
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        console.log('onBackdropClicked');
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        this.matDrawer.close();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create contact
     */
    showInfoClient(): void {
        // Go to the new contact
        this._router.navigate(['./client'], {
            relativeTo: this._activatedRoute,
        });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    docIdentChanged(objDocIdent: any): void {
        this.presenter.form.get('typeDocumentValue').enable();
        const { _id, name, maxDigits } = objDocIdent.value;
        this.presenter.form.get('typeDocumentValue').reset();
        this.presenter.form
            .get('typeDocumentValue')
            .setValidators([
                Validators.required,
                Validators.minLength(maxDigits),
                Validators.maxLength(maxDigits),
            ]);
        switch (name) {
            case 'DNI': {
                this.maskForInput = {
                    mask: this.fuseUtilsService.getMaskByNumberDigits(
                        maxDigits
                    ),
                    definitions: {
                        '#': /^[0-9]+$/g,
                    },
                };
                break;
            }
            case 'PASAPORTE': {
                this.maskForInput = {
                    mask: this.fuseUtilsService.getMaskByNumberDigits(
                        maxDigits
                    ),
                    definitions: {
                        '#': /^[A-Za-z0-9]+$/g,
                    },
                };
                break;
            }
        }
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
        if (this.id) {
            return;
        }
        this.saleNoteService
            .getSerie(companyID, documentID)
            .pipe(map((response: any) => response.data[0]))
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
                voucherDetail: this.presenter.voucherDetail.getRawValue(),
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
        this._router.navigate(['salenote']);
    }

    submitForm(): void {
        if (this.id) {
            const saleNote = new SaleNote(this.form.getRawValue());
            this.saleNoteService
                .updateSaleNote(saleNote, this.id)
                .subscribe((resp) => {
                    this._router.navigate(['salenote']);
                });
        } else {
            const saleNote = new SaleNote(this.form.getRawValue());
            delete saleNote['_id'];
            this.saleNoteService.createSaleNote(saleNote).subscribe((resp) => {
                this._router.navigate(['salenote']);
            });
        }
    }
}
