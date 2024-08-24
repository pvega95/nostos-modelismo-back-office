import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ClientsService {
  static readonly BASE_URL = `${environment.backendURL}`;

  constructor(private http: HttpClient) {}

  async listarClientes(): Promise<any> {
    const url = `${ClientsService.BASE_URL}/user-management`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }
  async crearCliente(body: any): Promise<any> {
    const url = `${ClientsService.BASE_URL}/user-management`;
    const  data  = (await this.http.post(url, body).toPromise()) as any;
    return data ;
  }
  async actualizarCliente(body: any, uid: string): Promise<any> {
    const url = `${ClientsService.BASE_URL}/user-management/${uid}`;
    const  data  = (await this.http.put(url, body).toPromise()) as any;
    return data ;
  }
  async eliminarCliente(uidClient: string): Promise<any> {
    const url = `${ClientsService.BASE_URL}/user-management/${uidClient}`;
    const  data  = (await this.http.delete(url).toPromise()) as any;
    return data ;
  }

  async listarDepartamentos(): Promise<any> {
    const url = `${ClientsService.BASE_URL}/ubigeo-management/departments`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }
  async listarProvincias(departmentId: string): Promise<any> {
    const url = `${ClientsService.BASE_URL}/ubigeo-management/province/${departmentId}`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }
  async listarDistritos(provinceId: string): Promise<any> {
    const url = `${ClientsService.BASE_URL}/ubigeo-management/distrito/${provinceId}`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }



  async consultaDireccionCliente(idUser: string): Promise<any> {
    const url = `${ClientsService.BASE_URL}/ubigeo-management/address/${idUser}`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }
}