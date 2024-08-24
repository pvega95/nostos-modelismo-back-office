import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from 'app/models/product';

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    static readonly BASE_URL = `${environment.backendURL}`;
    private _products: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    private _pagination: BehaviorSubject<any | null> = new BehaviorSubject(null);
    constructor(private _http: HttpClient) {}

    /**
     * Getter for pagination
     */
     get pagination$(): Observable<any>
     {
         return this._pagination.asObservable();
     }


    /**
     * Getter for paymentDeadlines
     */
     get products$(): Observable<any[]>
     {
         return this._products.asObservable();
     }

    crearProducto(body: any): Observable<any> {
        const query = `${ProductsService.BASE_URL}/product-management`;
        const data = body;
        return this._http.post(query, data);
    }

    formatErrors(error: HttpErrorResponse): Observable<any> {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
    }

    getListProducts(page: number, pageSize: number): Observable<any> {
        const url = `${ProductsService.BASE_URL}/product-management?page=${page}&pagesize=${pageSize}`;
        return this._http.get(url).pipe(
            map((response: any )=> response.data[0]),
            tap((response: any) => {
                this._pagination.next(response.metadata[0]);
                this._products.next(response.docs.map(product => new Product(product)));
            }),
            catchError((error: any) => this.formatErrors(error))
        );
    }

    consultarProducto(id: string): Observable<any> {
        const query = `${ProductsService.BASE_URL}/product-management/${id}`;
        return this._http.get(query);
    }

    actualizarProducto(body: any, id: string): Observable<any> {
        const query = `${ProductsService.BASE_URL}/product-management/${id}`;
        const data = body;
        return this._http.put(query, data);
    }

    subirArchivos(body: any): Observable<any> {
        const query = `${ProductsService.BASE_URL}/utils-management/uploads`;
        const data = body;
        return this._http.post(query, data);
    }

    eliminarProducto(id: string): Observable<any> {
        const query = `${ProductsService.BASE_URL}/product-management/${id}`;
        return this._http.delete(query);
        // const url = `${ProductsService.BASE_URL}/product-management/${id}`;
        // const data = (await this._http.delete(url).toPromise()) as any;
        // return data;
    }

    subirExcelProductos(body: any): Observable<any> {
        const query = `${ProductsService.BASE_URL}/product-management/upload/`;
        const data = body;
        return this._http.post(query, data);
    }
}
