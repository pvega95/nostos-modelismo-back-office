import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, catchError, delay, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import Client from './client';

@Injectable({
    providedIn: 'root',
})

export class ClientsService {
    static readonly BASE_URL = `${environment.backendURL}`;
    private _clients: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _client: BehaviorSubject<any | null> =
        new BehaviorSubject(null);
    constructor(private http: HttpClient) { }

    /**
       * Getter for documents
       */
    get clients$(): Observable<any[]> {
        return this._clients.asObservable();
    }

    get client$(): Observable<any> {
        return this._client.asObservable();
    }

    formatErrors(error: HttpErrorResponse) {
        const messageError = error.error ? error.error : error;
        return throwError(() => new Error(messageError));
    }

    listClient(): Observable<any> {
        const url = `${ClientsService.BASE_URL}/user-management`;
        return this.http.get(url).pipe(
            map((response: any) => response.data),
            tap((data) => this._clients.next(data)),
            catchError(error => {
                return this.formatErrors(error);
            })
        );
    }

    getClientById(id: string): Observable<any> {
        return this._clients.pipe(
            take(1),
            map((clients) => {
                // Find the product
                const client = clients.find((item) => item.uid === id) || null;

                // Update the product
                this._client.next(client);

                // Return the product
                return client;
            }),
            switchMap((client) => {
                if (!client) {
                    return throwError(
                        'Could not found product with id of ' + id + '!'
                    );
                }

                return of(client);
            })
        );
    }

    addNewClient(): Observable<any> {
        return this.clients$.pipe(
            take(1),
            map((clients) => {
                const client = new Client()
                // Update the products with the new product
                this._clients.next([client, ...clients]);

                // Return the new product
                return client;
            })
        );
    }

    createClient(body: any): Observable<any> {
        return this.clients$.pipe(
            take(1),
            switchMap((clients) =>
                this.http
                    .post<any>(
                        `${ClientsService.BASE_URL}/user-management`,
                        body
                    )
                    .pipe(
                        map((response: any) => response.data),
                        map((response: any) => response.usuario),
                        delay(3000),
                        switchMap(() => {
                            // Return the new client
                            return this.listClient();
                        })
                    )
            )
        );
    }

    deleteClient(uid: string): Observable<boolean> {
        return this.clients$.pipe(
            take(1),
            switchMap((clients) =>
                this.http
                    .delete<any>(
                        `${ClientsService.BASE_URL}/user-management/${uid}`)
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted product
                            const index = clients.findIndex(
                                (item) => item.uid === uid
                            );

                            // Delete the product
                            clients.splice(index, 1);

                            // Update the products
                            this._clients.next(clients);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }

    /**
    * Update product
    *
    * @param id
    * @param product
    */
    updateClient(
        uid: string,
        client: any
    ): Observable<any> {
        return this.clients$.pipe(
            take(1),
            switchMap((clients) =>
                this.http
                    .put<any>(
                        `${ClientsService.BASE_URL}/user-management/${uid}`,
                        client
                    )
                    .pipe(
                        // delay(3000),
                        switchMap(() => {
                            // Return the new client
                            return this.listClient();
                        }),
                        catchError(error => {
                            return this.formatErrors(error);
                        })
                    )
            )
        );
    }

    // async actualizarCliente(body: any, uid: string): Promise<any> {
    //     const url = `${ClientsService.BASE_URL}/user-management/${uid}`;
    //     const data = (await this.http.put(url, body).toPromise()) as any;
    //     return data;
    // }

    //   async deleteClient(uidClient: string): Promise<any> {
    //     const url = `${ClientsService.BASE_URL}/user-management/${uidClient}`;
    //     const  data  = (await this.http.delete(url).toPromise()) as any;
    //     return data ;
    //   }

    async listDepartments(): Promise<any> {
        const url = `${ClientsService.BASE_URL}/ubigeo-management/departments`;
        const data = (await this.http.get(url).toPromise()) as any;
        return data;
    }
    async listarProvincias(departmentId: string): Promise<any> {
        const url = `${ClientsService.BASE_URL}/ubigeo-management/province/${departmentId}`;
        const data = (await this.http.get(url).toPromise()) as any;
        return data;
    }
    async listDistricts(provinceId: string): Promise<any> {
        const url = `${ClientsService.BASE_URL}/ubigeo-management/distrito/${provinceId}`;
        const data = (await this.http.get(url).toPromise()) as any;
        return data;
    }



    async findAddressClient(idUser: string): Promise<any> {
        const url = `${ClientsService.BASE_URL}/ubigeo-management/address/${idUser}`;
        const data = (await this.http.get(url).toPromise()) as any;
        return data;
    }
}
