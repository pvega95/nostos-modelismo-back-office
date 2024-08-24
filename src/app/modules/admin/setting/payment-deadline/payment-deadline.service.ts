import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { PaymentDeadline } from '../../../../models/payment-deadline';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })

  export class PaymentDeadlineService {
    static readonly BASE_URL = `${environment.backendURL}`;
    static readonly confManagement = '/configuration-management';
    private _paymentDeadlines: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    constructor(private http: HttpClient) {}

    /**
     * Getter for paymentDeadlines
     */
     get paymentDeadlines$(): Observable<any[]>
     {
         return this._paymentDeadlines.asObservable();
     }

    formatErrors(error: HttpErrorResponse) {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
      }
  
    getListPaymentDeadline():  Observable<any> {
      const url = `${PaymentDeadlineService.BASE_URL}${PaymentDeadlineService.confManagement}/payment-term`;
      return this.http.get(url).pipe(
        tap((response: any)=> {
          this._paymentDeadlines.next(response);
        }),
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    /**
     * 
     * @param body 
     * @returns 
     */
    createPaymentDeadline(body: PaymentDeadline):  Observable<any> {
      const url = `${PaymentDeadlineService.BASE_URL}${PaymentDeadlineService.confManagement}/payment-term`;
      return this.http.post(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    updatePaymentDeadline(id: string, body: PaymentDeadline):  Observable<any> {
      const url = `${PaymentDeadlineService.BASE_URL}${PaymentDeadlineService.confManagement}/payment-term/${id}`;
      return this.http.put(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    deletePaymentDeadline(id: string):  Observable<any> {
      const url = `${PaymentDeadlineService.BASE_URL}${PaymentDeadlineService.confManagement}/payment-term/${id}`;
      return this.http.delete(url).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 

  }