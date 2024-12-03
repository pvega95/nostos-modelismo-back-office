import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { IUnitBody, IUnitResponse, IUnitResponseEditDelete } from './interfaces';

@Injectable({
  providedIn: 'root',
})

export class UnitService {
  static readonly BASE_URL = `${environment.backendURL}`;
    static readonly confManagement = 'configuration-management';

  constructor(private _http: HttpClient) {}

  getListUnit(): Observable<IUnitResponse> {
    const query = `${UnitService.BASE_URL}/${UnitService.confManagement}/unid`;
    return this._http.get<IUnitResponse>(query);
  }

  createUnit(body: IUnitBody): Observable<IUnitResponse> {
    const query = `${UnitService.BASE_URL}/${UnitService.confManagement}/unid`;
    const data = body;
    return this._http.post<IUnitResponse>(query, data);
  }

  editUnit(id: string, body: IUnitBody): Observable<IUnitResponseEditDelete> {
    const query = `${UnitService.BASE_URL}/${UnitService.confManagement}/unid/${id}`;
    const data = body;
    return this._http.put<IUnitResponseEditDelete>(query, data);
  }

  deleteUnit(id: string): Observable<IUnitResponseEditDelete> {
    const query = `${UnitService.BASE_URL}/${UnitService.confManagement}/unid/${id}`;
    return this._http.delete<IUnitResponseEditDelete>(query);;
  }
}