import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { IUnidResponse, IUnidResponseEditDelete } from './interfaces';

@Injectable({
  providedIn: 'root',
})

export class UnidService {
  static readonly BASE_URL = `${environment.backendURL}`;
    static readonly confManagement = 'configuration-management';

  constructor(private _http: HttpClient) {}

  getListUnid(): Observable<IUnidResponse> {
    const query = `${UnidService.BASE_URL}/${UnidService.confManagement}/unid`;
    return this._http.get<IUnidResponse>(query);
  }

  createUnid(body: any): Observable<IUnidResponse> {
    const query = `${UnidService.BASE_URL}/${UnidService.confManagement}/unid`;
    const data = body;
    return this._http.post<IUnidResponse>(query, data);
  }

  editUnid(id: string, body: any): Observable<IUnidResponseEditDelete> {
    const query = `${UnidService.BASE_URL}/${UnidService.confManagement}/unid/${id}`;
    const data = body;
    return this._http.put<IUnidResponseEditDelete>(query, data);
  }

  deleteUnid(id: string): Observable<IUnidResponseEditDelete> {
    const query = `${UnidService.BASE_URL}/${UnidService.confManagement}/unid/${id}`;
    return this._http.delete<IUnidResponseEditDelete>(query);;
  }
}