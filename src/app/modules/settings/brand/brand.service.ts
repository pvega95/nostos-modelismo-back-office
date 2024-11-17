import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class BrandService {
  static readonly BASE_URL = `${environment.backendURL}`;
    static readonly configManagement = 'configuration-management';

  constructor(private readonly _http: HttpClient) {}

  getListBrand(): Observable<any> {
    const query = `${BrandService.BASE_URL}/${BrandService.configManagement}/brand`;
    return this._http.get(query);
  }

  createBrand(body: any): Observable<any> {
    const query = `${BrandService.BASE_URL}/${BrandService.configManagement}/brand`;
    const data = body;
    return this._http.post(query, data);
  }

  editBrand(id: string, body: any): Observable<any> {
    const query = `${BrandService.BASE_URL}/${BrandService.configManagement}/brand/${id}`;
    const data = body;
    return this._http.put(query, data);
  }

  deleteBrand(id: string): Observable<any> {
    const query = `${BrandService.BASE_URL}/${BrandService.configManagement}/brand/${id}`;
    return this._http.delete(query);;
  }

}