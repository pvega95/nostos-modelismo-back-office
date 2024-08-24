import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Document } from '../../../../models/document';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })

  
  export class DocumentService {
    static readonly BASE_URL = `${environment.backendURL}`;
    static readonly confManagement = '/configuration-management';
    private _documents: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    constructor(private http: HttpClient) {}

    /**
     * Getter for documents
     */
     get documents$(): Observable<any[]>
     {
         return this._documents.asObservable();
     }

    formatErrors(error: HttpErrorResponse) {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
      }
  
    getListDocument():  Observable<any> {
      const url = `${DocumentService.BASE_URL}${DocumentService.confManagement}/document`;
      return this.http.get(url).pipe(
        tap((response: any)=> {
          this._documents.next(response);
        }),
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
    createDocument(body: Document):  Observable<any> {
      const url = `${DocumentService.BASE_URL}${DocumentService.confManagement}/document`;
      return this.http.post(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    updateDocument(id: string, body: Document):  Observable<any> {
      const url = `${DocumentService.BASE_URL}${DocumentService.confManagement}/document/${id}`;
      return this.http.put(url, body).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 
    deleteDocument(id: string):  Observable<any> {
      const url = `${DocumentService.BASE_URL}${DocumentService.confManagement}/document/${id}`;
      return this.http.delete(url).pipe(
        catchError(error => {
          return this.formatErrors(error);
        })
      );
    } 

  }