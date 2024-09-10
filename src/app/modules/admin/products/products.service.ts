import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "environments/environment";
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from "rxjs";
import { Product } from "app/models/product";

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    static readonly BASE_URL = `${environment.backendURL}`;
    private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(
        null
    );
    private _pagination: BehaviorSubject<any | null> = new BehaviorSubject(null);
    constructor(private _http: HttpClient) {}

    get products$(): Observable<Product[]> {
        return this._products.asObservable();
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

    formatErrors(error: HttpErrorResponse): Observable<any> {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
    }
}
