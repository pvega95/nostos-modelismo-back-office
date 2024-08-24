import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class OptionsService {
  static readonly BASE_URL = `${environment.backendURL}`;


  constructor(private http: HttpClient) {}

  async listarOpciones(): Promise<any> {
    const url = `${OptionsService.BASE_URL}/option-management`;
    const  data  = (await this.http.get(url).toPromise()) as any;
    return data ;
  }

  async crearOpcion(body: any): Promise<any> {
    const url = `${OptionsService.BASE_URL}/option-management`;
    const  data  = (await this.http.post(url, body).toPromise()) as any;
    return data ;
  }



}