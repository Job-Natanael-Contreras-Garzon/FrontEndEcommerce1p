import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
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

  login(data: { email: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/api/client/login`, data)
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserId(): number | null {
    const stored = localStorage.getItem('user_id');
    return stored ? +stored : null;
  }
}
