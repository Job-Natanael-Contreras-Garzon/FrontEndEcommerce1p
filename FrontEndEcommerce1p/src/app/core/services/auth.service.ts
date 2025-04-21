// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
      email: string;
      roles: string[];
    };
  };
  message?: string;
}
export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
      email: string;
      roles: string[];
    };
  };
  message?: string;
}
export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken?: string;
  user?: any;
  message?: string;
}
export interface RegisterResponse {
  success: boolean;
  user_id?: string;
  message?: string;
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

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.success) {
            this.handleAuthSuccess(response);
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(
            () => new Error(error.error?.message || 'Error during login')
          );
        })
      );
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(environment.refreshTokenName);
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        map((response) => {
          if (response.success) {
            this.handleAuthSuccess(response);
            return response.data.token; // Devuelve el token como string
          }
          throw new Error(response.message || 'Token refresh failed');
        }),
        catchError((error) => {
          this.logout();
          return throwError(
            () => new Error('Session expired. Please login again.')
          );
        })
      );
  }
  private handleAuthSuccess(response: AuthResponse): void {
    const { token, refreshToken, user } = response.data;
    localStorage.setItem(environment.tokenName, token);
    localStorage.setItem(environment.refreshTokenName, refreshToken);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem(environment.tokenName);
    localStorage.removeItem(environment.refreshTokenName);
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.tokenName);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.includes(role) || false;
  }

  getUserRoles(): string[] {
    return this.currentUserSubject.value?.roles || [];
  }

  register(userData: any): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError((error) => {
          console.error('Registration error:', error);
          return throwError(
            () => new Error(error.error?.message || 'Error during registration')
          );
        })
      );
  }
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
}
