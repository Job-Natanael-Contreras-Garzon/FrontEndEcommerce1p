import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Definimos las interfaces para las respuestas
interface LoginResponse {
  status: string;
  message: string;
  token: string;
  user_id: number;
}

interface RegisterResponse {
  status: string;
  message: string;
  user_id: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;
  private userIdSub = new BehaviorSubject<number | null>(null);
  public userId$ = this.userIdSub.asObservable();

  constructor(private http: HttpClient) {
    const id = this.getUserId();
    if (id) this.userIdSub.next(id);
  }

  // Especificamos el tipo de respuesta como LoginResponse
  login(data: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, data)  // Añadido /auth/
      .pipe(
        tap(res => {
          if (res.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user_id', String(res.user_id));
            this.userIdSub.next(res.user_id);
          }
        })
      );
  }

  register(data: { name: string; email: string; password: string }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/register`, data);  // Añadido /auth/
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    this.userIdSub.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): number | null {
    const id = localStorage.getItem('user_id');
    return id ? +id : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}