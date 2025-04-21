import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newRequest = req.clone({
      headers: req.headers
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
    });
    
    const token = this.auth.getToken();
    if (token) {
      newRequest = newRequest.clone({
        headers: newRequest.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(newRequest);
  }
}