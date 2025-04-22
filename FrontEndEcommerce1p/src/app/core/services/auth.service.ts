// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export interface LoginResponse extends AuthResponse {
  token?: string;
}

export interface RegisterResponse extends AuthResponse {
  user_id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem(environment.tokenName);
    const user = localStorage.getItem('currentUser');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/signin`, { email, password })
      .pipe(
        tap((response) => {
          if (response.success && response.token && response.user) {
            localStorage.setItem(environment.tokenName, response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError((error) => {
          localStorage.removeItem(environment.tokenName);
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(environment.tokenName);
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.tokenName);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.currentUserSubject.value;
    return !!token && !!user;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  getUserRoles(): string[] {
    const user = this.currentUserSubject.value;
    return user?.role ? [user.role] : [];
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  refreshToken(): Observable<string> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh-token`, {}).pipe(
      map(response => {
        if (response.success && response.token) {
          localStorage.setItem(environment.tokenName, response.token);
          return response.token;
        }
        throw new Error('Invalid refresh token response');
      }),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => new Error('Error refreshing token'));
      })
    );
  }

  register(registerData: { username: string; email: string; password: string }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }
}
