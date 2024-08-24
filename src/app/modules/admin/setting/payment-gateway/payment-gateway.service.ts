import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class PaymentGatewayService {
  static readonly BASE_URL = `${environment.backendURL}`;


  constructor(private _http: HttpClient) {}

  formatErrors(error: HttpErrorResponse) {
    const messageError = error.error ? error.error : error;
    return throwError(messageError);
  }

  listarBilletera(): Observable<any> {
    const query = `${PaymentGatewayService.BASE_URL}/configuration-management/wallet`;
    return this._http.get(query);
  }

  crearBilletera(body: any): Observable<any> {
    const url = `${PaymentGatewayService.BASE_URL}/configuration-management/wallet`;
    return this._http.post(url, body).pipe(
      catchError(error => {
        return this.formatErrors(error);
      })
    );
  }
  editarBilletera(id: string, body: any): Observable<any> {
    const url = `${PaymentGatewayService.BASE_URL}/configuration-management/wallet/${id}`;
    return this._http.put(url, body).pipe(
      catchError(error => {
        return this.formatErrors(error);
      })
    );
  }

  eliminarBilletera(id: string): Observable<any> {
    const url = `${PaymentGatewayService.BASE_URL}/configuration-management/wallet/${id}`;
    return this._http.delete(url).pipe(
      catchError(error => {
        return this.formatErrors(error);
      })
    );
  }

  subirArchivos(body: any): Observable<any> {
    const query = `${PaymentGatewayService.BASE_URL}/utils-management/uploads`;
    const data = body;
    return this._http.post(query, data);
  }

  listarCuentaBancaria(): Observable<any> {
    const query = `${PaymentGatewayService.BASE_URL}/configuration-management/account-bank`;
    return this._http.get(query);
  }

  crearCuentaBancaria(body: any): Observable<any> {
    const url = `${PaymentGatewayService.BASE_URL}/configuration-management/account-bank`;
    return this._http.post(url, body).pipe(
      catchError(error => {
        return this.formatErrors(error);
      })
    );
  }
  editarCuentaBancaria(id: string, body: any): Observable<any> {
    const url = `${PaymentGatewayService.BASE_URL}/configuration-management/account-bank/${id}`;
    return this._http.put(url, body).pipe(
      catchError(error => {
        return this.formatErrors(error);
      })
    );
  }

  eliminarCuentaBancaria(id: string): Observable<any> {
    const url = `${PaymentGatewayService.BASE_URL}/configuration-management/account-bank/${id}`;
    return this._http.delete(url).pipe(
      catchError(error => {
        return this.formatErrors(error);
      })
    );
  }

}