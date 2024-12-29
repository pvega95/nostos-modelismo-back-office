import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { IBrandBody, IBrandResponse, IBrandResponseEditDelete } from './interfaces';

@Injectable({
  providedIn: 'root',
})

export class BrandService {
  static readonly BASE_URL = `${environment.backendURL}`;
    static readonly configManagement = 'configuration-management';

  constructor(private readonly _http: HttpClient) {}

  getListBrand(): Observable<IBrandResponse> {
    const query = `${BrandService.BASE_URL}/${BrandService.configManagement}/brand`;
    return this._http.get<IBrandResponse>(query);
  }

  createBrand(body: IBrandBody): Observable<IBrandResponse> {
    const query = `${BrandService.BASE_URL}/${BrandService.configManagement}/brand`;
    const data = body;
    return this._http.post<IBrandResponse>(query, data);
  }

  editBrand(id: string, body: IBrandBody): Observable<IBrandResponseEditDelete> {
    const query = `${BrandService.BASE_URL}/${BrandService.configManagement}/brand/${id}`;
    const data = body;
    return this._http.put<IBrandResponseEditDelete>(query, data);
  }

  deleteBrand(id: string): Observable<IBrandResponseEditDelete> {
    const query = `${BrandService.BASE_URL}/${BrandService.configManagement}/brand/${id}`;
    return this._http.delete<IBrandResponseEditDelete>(query);;
  }

}