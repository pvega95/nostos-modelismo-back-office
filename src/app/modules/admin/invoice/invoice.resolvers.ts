import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { CompanyService } from '../setting/company/company.service';
import { DocumentService } from '../setting/document/document.service';
import { PaymentDeadlineService } from '../setting/payment-deadline/payment-deadline.service';
import { PaymentMethodService } from '../setting/payment-method/payment-method.service';
import { TypeDocumentService } from '../setting/type-document/type-document.service';
import { InvoiceService } from './invoice.service';

@Injectable({
    providedIn: 'root',
})
export class InvoiceListResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _invoiceService: InvoiceService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any[]> {
        return this._invoiceService.getListInvoice();
    }
}

@Injectable({
    providedIn: 'root',
})
export class InvoiceInitialDataResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private companyService: CompanyService,
        private documentService: DocumentService,
        private paymentDeadlineService: PaymentDeadlineService,
        private paymentsMethod: PaymentMethodService,
        private typeDocumentService: TypeDocumentService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any[]> {
        // Fork join multiple API endpoint calls to wait all of them to finish
        return forkJoin([
            this.companyService.getListCompany(),
            this.documentService.getListDocument(),
            this.paymentDeadlineService.getListPaymentDeadline(),
            this.paymentsMethod.getListPaymentMethod(),
            this.typeDocumentService.getTypeListDocument()
        ]);
    }
}
