// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
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
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success) {
            this.handleAuthSuccess(response);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error(error.error?.message || 'Error during login'));
        })
      );
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(environment.refreshTokenName);
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap(response => {
          if (response.success) {
            this.handleAuthSuccess(response);
          }
        }),
        catchError(error => {
          this.logout();
          return throwError(() => new Error('Session expired. Please login again.'));
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

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
}