import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class SunatService {
    static readonly BASE_URL = `${environment.backendURL}`;
    static readonly apiPeruManagment = '/apis-peru';
    constructor(private http: HttpClient) {}

    public sendDocument(body: any): Observable<any> {
        const url = `${SunatService.BASE_URL}${SunatService.apiPeruManagment}/invoice`;
        return this.http
            .post(url, body)
            .pipe(catchError((error: any) => this.formatErrors(error)));
    }

    private formatErrors(error: HttpErrorResponse): Observable<never> {
        const messageError = error.error ? error.error : error;
        return throwError(messageError);
    }
}
