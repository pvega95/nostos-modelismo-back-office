import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class InvoiceService {
    static readonly BASE_URL = `${environment.backendURL}`;
    static readonly orderManagement = '/order-management';
    private _invoices: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    constructor(private http: HttpClient) {}

    /**
     * Getter for sale notes
     */
    get saleNotes$(): Observable<any[]> {
        return this._invoices.asObservable();
    }

    formatErrors(error: HttpErrorResponse) {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
    }

    getListInvoice(): Observable<any> {
        const url = `${InvoiceService.BASE_URL}${InvoiceService.orderManagement}/invoice`;
        return this.http.get(url).pipe(
            tap((response: any) => {
                this._invoices.next(response);
            }),
            catchError((error) => this.formatErrors(error))
        );
    }

    getListInvoiceById(id: string): Observable<any> {
        const url = `${InvoiceService.BASE_URL}${InvoiceService.orderManagement}/invoice/${id}`;
        return this.http.get(url).pipe(
            catchError((error) => this.formatErrors(error))
        );
    }

    createInvoice(body: any): Observable<any> {
        const url = `${InvoiceService.BASE_URL}${InvoiceService.orderManagement}/invoice`;
        return this.http
            .post(url, body)
            .pipe(catchError((error: any) => this.formatErrors(error)));
    }

    updateInvoice(body: any, id: string): Observable<any> {
        const url = `${InvoiceService.BASE_URL}${InvoiceService.orderManagement}/invoice/${id}`;
        return this.http
            .put(url, body)
            .pipe(catchError((error: any) => this.formatErrors(error)));
    }

    deleteInvoice(id: string): Observable<any> {
        const url = `${InvoiceService.BASE_URL}${InvoiceService.orderManagement}/invoice/${id}`;
        return this.http
            .delete(url)
            .pipe(catchError((error: any) => this.formatErrors(error)));
    }

    getSerie(companyId: string, documentId: string): Observable<any> {
        const url = `${InvoiceService.BASE_URL}/configuration-management/document-serial/${companyId}/${documentId}`;
        return this.http.get(url).pipe(
            catchError((error) => this.formatErrors(error))
        );
    }

}
