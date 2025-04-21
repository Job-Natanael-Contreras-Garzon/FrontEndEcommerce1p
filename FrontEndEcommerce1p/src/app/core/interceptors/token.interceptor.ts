import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip token for auth endpoints except refresh
    if (req.url.includes('/auth/') && !req.url.includes('/refresh-token')) {
      return next.handle(req.clone({
        withCredentials: true,
        headers: req.headers
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
      }));
    }

    // Add token if available
    let newRequest = this.addToken(req, this.auth.getToken());

    return next.handle(newRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }
        
        if (error.status === 403) {
          this.auth.logout();
          this.router.navigate(['/auth/login']);
        }
        
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string | null): HttpRequest<any> {
    const headers = request.headers
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    const clonedReq = request.clone({
      withCredentials: true,
      headers: token ? headers.set('Authorization', `Bearer ${token}`) : headers
    });

    return clonedReq;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return this.auth.refreshToken().pipe(
        switchMap(token => {
          this.isRefreshing = false;
          return next.handle(this.addToken(request, token));
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.auth.logout();
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        })
      );
    }
    return next.handle(request);
  }
}