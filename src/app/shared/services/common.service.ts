import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CommonService {
  static readonly BASE_URL = `${environment.backendURL}`;

  constructor(private http: HttpClient) {}

  async listarDepartamentos(): Promise<any> {
    const url = `${CommonService.BASE_URL}/ubigeo-management/departments`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }
  async listarProvincias(departmentId: string): Promise<any> {
    const url = `${CommonService.BASE_URL}/ubigeo-management/province/${departmentId}`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }
  async listarDistritos(provinceId: string): Promise<any> {
    const url = `${CommonService.BASE_URL}/ubigeo-management/distrito/${provinceId}`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }

}
