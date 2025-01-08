import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
// import { IBrandBody, IBrandResponse, IBrandResponseEditDelete } from './interfaces';

@Injectable({
  providedIn: 'root',
})

export class CategoryService {
  static readonly BASE_URL = `${environment.backendURL}`;
    static readonly configManagement = 'category-management';

  constructor(private readonly _http: HttpClient) {}

  getListBrand(): Observable<any> {
    const query = `${CategoryService.BASE_URL}/${CategoryService.configManagement}/brand`;
    return this._http.get<any>(query);
  }

  createBrand(body: any): Observable<any> {
    const query = `${CategoryService.BASE_URL}/${CategoryService.configManagement}/brand`;
    const data = body;
    return this._http.post<any>(query, data);
  }

  editBrand(id: string, body: any): Observable<any> {
    const query = `${CategoryService.BASE_URL}/${CategoryService.configManagement}/brand/${id}`;
    const data = body;
    return this._http.put<any>(query, data);
  }

  deleteBrand(id: string): Observable<any> {
    const query = `${CategoryService.BASE_URL}/${CategoryService.configManagement}/brand/${id}`;
    return this._http.delete<any>(query);
  }

}
