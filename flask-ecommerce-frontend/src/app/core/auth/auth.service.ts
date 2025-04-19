import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {
    const token = this.jwtService.getToken();
    if (token) {
      const user = this.jwtService.decodeToken();
      this.currentUserSubject.next(user);
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/api/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            this.jwtService.saveToken(response.token);
            const user: User = {
              id: response.user_id,
              email: email,
              name: response.name || ''
            };
            this.currentUserSubject.next(user);
          }
        }),
        map(response => {
          return {
            id: response.user_id,
            email: email,
            name: response.name || ''
          };
        })
      );
  }

  register(name: string, email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/api/register`, { name, email, password })
      .pipe(
        map(response => {
          return {
            id: response.user_id,
            email: email,
            name: name
          };
        })
      );
  }

  logout(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.jwtService.getToken() !== null;
  }
}