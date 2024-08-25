import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Order } from './order.types';

@Injectable({
  providedIn: 'root',
})

export class OrderService {
  static readonly BASE_URL = `${environment.backendURL}`;
  private _products: BehaviorSubject<Order[] | null> =
    new BehaviorSubject(null);
  constructor(private _httpClient: HttpClient) { }

  /**
     * Getter for products
     */
  get products$(): Observable<Order[]> {
    return this._products.asObservable();
  }

  /**
     * Get orders
     */
  getOrders(): Observable<Order[]> {
    return this._httpClient
      .get<Order[]>(`${OrderService.BASE_URL}/order-management`)
      .pipe(
        tap((brands) => {
          this._products.next(brands);
        })
      );
  }

  // async listarOrdenes(): Promise<any> {
  //   const url = `${OrderService.BASE_URL}/order-management`;
  //   const  data  = (await this.http.get(url).toPromise()) as any;
  //   return data ;
  // }
  async crearOrden(body: any): Promise<any> {
    const url = `${OrderService.BASE_URL}/order-management`;
    const data = (await this._httpClient.post(url, body).toPromise()) as any;
    return data;
  }
  async listarEstadosOrdenes(): Promise<any> {
    const url = `${OrderService.BASE_URL}/order-management/status`;
    const data = (await this._httpClient.get(url).toPromise()) as any;
    return data;
  }
  async editarEstadoOrden(idOrder: string, body: any): Promise<any> {
    const url = `${OrderService.BASE_URL}/order-management/${idOrder}`;
    const data = (await this._httpClient.put(url, body).toPromise()) as any;
    return data;
  }
}