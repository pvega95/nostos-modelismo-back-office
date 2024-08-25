import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Sales } from './sales.types';

@Injectable({
  providedIn: 'root',
})

export class SalesService {
  static readonly BASE_URL = `${environment.backendURL}`;
  private _products: BehaviorSubject<Sales[] | null> =
    new BehaviorSubject(null);
  constructor(private _httpClient: HttpClient) { }

  /**
     * Getter for products
     */
  get products$(): Observable<Sales[]> {
    return this._products.asObservable();
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
        tap((brands) => {
          console.log('brands', brands)
          this._products.next(brands);
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
}