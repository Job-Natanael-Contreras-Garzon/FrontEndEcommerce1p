import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // For login and register endpoints, just add the basic headers
    if (req.url.includes('/api/client/login') || req.url.includes('/api/client/register')) {
      const modifiedReq = req.clone({
        headers: req.headers
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json'),
        withCredentials: true
      });
      return next.handle(modifiedReq);
    }

    // For all other requests, add the token if available
    const token = this.auth.getToken();
    const modifiedReq = req.clone({
      headers: req.headers
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', token ? `Bearer ${token}` : ''),
      withCredentials: true
    });

    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.auth.logout();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}