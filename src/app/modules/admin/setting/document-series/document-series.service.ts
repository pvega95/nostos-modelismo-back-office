import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { DocumentSeries } from '../../../../models/document-series';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })

  export class DocumentSerieService {
    static readonly BASE_URL = `${environment.backendURL}`;
    static readonly confManagement = '/configuration-management';
    constructor(private http: HttpClient) {}
    formatErrors(error: HttpErrorResponse) {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
      }
  
    getListDocumentSerie():  Observable<any> {
      const url = `${DocumentSerieService.BASE_URL}${DocumentSerieService.confManagement}/document-serial`;
      return this.http.get(url).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    /**
     * 
     * @param body 
     * @returns 
     */
    createDocumentSerie(body: any):  Observable<any> {
      const url = `${DocumentSerieService.BASE_URL}${DocumentSerieService.confManagement}/document-serial`;
      return this.http.post(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    updateDocumentSerie(id: string, body: any):  Observable<any> {
      const url = `${DocumentSerieService.BASE_URL}${DocumentSerieService.confManagement}/document-serial/${id}`;
      return this.http.put(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    deleteDocumentSerie(id: string):  Observable<any> {
      const url = `${DocumentSerieService.BASE_URL}${DocumentSerieService.confManagement}/document-serial/${id}`;
      return this.http.delete(url).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 

  }