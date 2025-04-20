import { Injectable }      from '@angular/core';
import { Router }          from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap }             from 'rxjs/operators';
import { ApiService }      from './api.service';
import { User }            from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'access_token';
  private userSub = new BehaviorSubject<User|null>(null);
  public user$ = this.userSub.asObservable();

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    const token = this.getToken();
    if (token) this.loadUser();
  }

  login(credentials: {username: string, password: string}): Observable<any> {
    return this.api.post<{token: string, user: User}>('/auth/login/', credentials)
      .pipe(tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        this.userSub.next(res.user);
      }));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSub.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private loadUser() {
    this.api.get<User>('/auth/me/').subscribe(u => this.userSub.next(u));
  }
}
