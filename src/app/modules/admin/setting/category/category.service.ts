import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CategoriesService {
  static readonly BASE_URL = `${environment.backendURL}`;


  constructor(private _http: HttpClient) {}

  listarCategorias(): Observable<any> {
    const query = `${CategoriesService.BASE_URL}/category-management`;
    return this._http.get(query);
  }

  async crearCategoria(body: any): Promise<any> {
    const url = `${CategoriesService.BASE_URL}/category-management`;
    const  data  = (await this._http.post(url, body).toPromise()) as any;
    return data ;
  }
  async editarCategoria(id: string, body: any): Promise<any> {
    const url = `${CategoriesService.BASE_URL}/category-management/${id}`;
    const  data  = (await this._http.put(url, body).toPromise()) as any;
    return data ;
  }
  async eliminarCategoria(id: string): Promise<any> {
    const url = `${CategoriesService.BASE_URL}/category-management/${id}`;
    const  data  = (await this._http.delete(url).toPromise()) as any;
    return data ;
  }



}