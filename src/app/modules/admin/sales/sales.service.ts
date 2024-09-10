import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { Sales } from './sales.types';

@Injectable({
    providedIn: 'root',
})

export class SalesService {
    static readonly BASE_URL = `${environment.backendURL}`;
    private _sales: BehaviorSubject<Sales[] | null> =
        new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) { }

    /**
       * Getter for sales
       */
    get sales$(): Observable<Sales[]> {
        return this._sales.asObservable();
    }

    /**
       * Get sales
       */
    getSales(): Observable<Sales[]> {
        return this._httpClient
            .get<any>(`${SalesService.BASE_URL}/order-management/sales`)
            .pipe(
                map((sale) => sale.data),
                map((sale) => sale[0]),
                map((sale) => sale.docs),
                tap((sales) => {
                    console.log('sales', sales)
                    this._sales.next(sales);
                })
            );
    }

    // async listarOrdenes(): Promise<any> {
    //   const url = `${SalesService.BASE_URL}/order-management`;
    //   const  data  = (await this.http.get(url).toPromise()) as any;
    //   return data ;
    // }
    async crearOrden(body: any): Promise<any> {
        const url = `${SalesService.BASE_URL}/order-management`;
        const data = (await this._httpClient.post(url, body).toPromise()) as any;
        return data;
    }
    async listarEstadosOrdenes(): Promise<any> {
        const url = `${SalesService.BASE_URL}/order-management/status`;
        const data = (await this._httpClient.get(url).toPromise()) as any;
        return data;
    }
    async editarEstadoOrden(idOrder: string, body: any): Promise<any> {
        const url = `${SalesService.BASE_URL}/order-management/${idOrder}`;
        const data = (await this._httpClient.put(url, body).toPromise()) as any;
        return data;
    }

    formatErrors(error: HttpErrorResponse) {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
    }

    getSerie(companyId: string, documentId: string): Observable<any> {
        const url = `${SalesService.BASE_URL}/configuration-management/document-serial/${companyId}/${documentId}`;
        return this._httpClient.get(url).pipe(
            catchError((error) => this.formatErrors(error))
        );
    }
}
