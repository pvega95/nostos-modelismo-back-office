import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class UnidService {
  static readonly BASE_URL = `${environment.backendURL}`;
    static readonly confManagement = 'configuration-management';

  constructor(private _http: HttpClient) {}

  listarUnidad(): Observable<any> {
    const query = `${UnidService.BASE_URL}/${UnidService.confManagement}/unid`;
    return this._http.get(query);
  }

  crearUnidad(body: any): Observable<any> {
    const query = `${UnidService.BASE_URL}/${UnidService.confManagement}/unid`;
    const data = body;
    return this._http.post(query, data);
  }

  editarUnidad(id: string, body: any): Observable<any> {
    const query = `${UnidService.BASE_URL}/${UnidService.confManagement}/unid/${id}`;
    const data = body;
    return this._http.put(query, data);
  }

  eliminarUnidad(id: string): Observable<any> {
    const query = `${UnidService.BASE_URL}/${UnidService.confManagement}/unid/${id}`;
    return this._http.delete(query);;
  }



}