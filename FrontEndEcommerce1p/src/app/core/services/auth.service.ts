// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
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
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Usuario de prueba
  private mockUser = {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin'
  };

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
    // Simulando login exitoso
    const mockResponse: LoginResponse = {
      success: true,
      message: 'Login successful',
      token: 'mock-jwt-token',
      user: this.mockUser
    };

    return of(mockResponse).pipe(
      tap((response) => {
        if (response.success && response.token && response.user) {
          localStorage.setItem(environment.tokenName, response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
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

  register(registerData: { username: string; email: string; password: string }): Observable<RegisterResponse> {
    // Simulando registro exitoso
    const mockRegisterResponse: RegisterResponse = {
      success: true,
      message: 'Registration successful',
      user_id: '2'
    };
    return of(mockRegisterResponse);
  }

  refreshToken(): Observable<LoginResponse> {
    // Simulando refresh de token exitoso
    const mockResponse: LoginResponse = {
      success: true,
      message: 'Token refreshed successfully',
      token: 'mock-jwt-token-' + new Date().getTime(),
      user: this.mockUser
    };

    return of(mockResponse).pipe(
      tap((response) => {
        if (response.success && response.token) {
          localStorage.setItem(environment.tokenName, response.token);
        }
      })
    );
  }
}
