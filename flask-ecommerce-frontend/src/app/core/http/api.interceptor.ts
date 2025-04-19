import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          // Cliente error
          errorMsg = `Error: ${error.error.message}`;
        } else {
          // Error del servidor
          errorMsg = `Error Code: ${error.status}, Message: ${error.message}`;
          
          // Si el backend devuelve un mensaje de error específico
          if (error.error && error.error.message) {
            errorMsg = error.error.message;
          }
        }
        console.error(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}