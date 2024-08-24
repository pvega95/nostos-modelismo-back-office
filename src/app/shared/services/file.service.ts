import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    static readonly BASE_URL = `${environment.backendURL}`;

    constructor(private http: HttpClient) {}

    getFile(key: string): Observable<any> {
        return this.http.get(
            `${FileService.BASE_URL}/utils-management/template/${key}` );
    }
}
