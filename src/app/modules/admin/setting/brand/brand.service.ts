import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class BrandService {
  static readonly BASE_URL = `${environment.backendURL}`;
    static readonly confManagement = 'configuration-management';

  constructor(private _http: HttpClient) {}

  listarMarca(): Observable<any> {
    const query = `${BrandService.BASE_URL}/${BrandService.confManagement}/brand`;
    return this._http.get(query);
  }

  crearMarca(body: any): Observable<any> {
    const query = `${BrandService.BASE_URL}/${BrandService.confManagement}/brand`;
    const data = body;
    return this._http.post(query, data);
  }

  editarMarca(id: string, body: any): Observable<any> {
    const query = `${BrandService.BASE_URL}/${BrandService.confManagement}/brand/${id}`;
    const data = body;
    return this._http.put(query, data);
  }

  eliminarMarca(id: string): Observable<any> {
    const query = `${BrandService.BASE_URL}/${BrandService.confManagement}/brand/${id}`;
    return this._http.delete(query);;
  }



}