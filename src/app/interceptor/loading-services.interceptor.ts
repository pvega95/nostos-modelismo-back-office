import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/internal/operators';


@Injectable({
    providedIn: 'root'
  })
export class LoadingServicesInterceptor implements HttpInterceptor {
  

  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
  ) {

  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
        catchError(error => {
          let errorMessage = '';
          let errorSide = '';
          if (error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Client-side error: ${error.error.message}`;
            errorSide= 'Error cliente';
          } else {
            // backend error
            errorMessage = `Server-side error: ${error.status} ${error.message}`;
            errorSide= 'Error servidor';
          }

          switch (error.status) {
              case 0:
                  {
                    errorSide = 'Error cliente'
                    errorMessage = '0 - Sin conexión a internet'
                    break;
                  }
              default:
                  break;
          }
          // aquí podrías agregar código que muestre el error en alguna parte fija de la pantalla.
          const confirmation = this._fuseConfirmationService.open({
            title  : errorSide,
            message: 'Ocurrió un error ' + errorMessage,
            actions: {
                confirm: {
                    label: 'Aceptar',
                    color: 'primary'
                },
                cancel : {
                    show : false,
                }
              }
            });
       //   this.errorService.show(errorMessage);
          return throwError(errorMessage);
        })
      );
  }
}
