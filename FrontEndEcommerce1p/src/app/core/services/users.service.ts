import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Users, CreateUsersDTO, UpdateUsersDTO } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, limit: number = 10, role?: string): Observable<{ users: Users[], total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (role) {
      params = params.set('role', role);
    }

    const headers = new HttpHeaders().set('x-access-token', localStorage.getItem('token') || '');
    
    return this.http.get<{ users: Users[], total: number }>(this.apiUrl, { params, headers });
  }

  getUser(id: string): Observable<Users> {
    const headers = new HttpHeaders().set('x-access-token', localStorage.getItem('token') || '');
    return this.http.get<Users>(`${this.apiUrl}/${id}`, { headers });
  }

  createUser(user: CreateUsersDTO): Observable<Users> {
    const headers = new HttpHeaders().set('x-access-token', localStorage.getItem('token') || '');
    return this.http.post<Users>(this.apiUrl, user, { headers });
  }

  updateUser(id: string, changes: UpdateUsersDTO): Observable<{ message: string }> {
    const headers = new HttpHeaders().set('x-access-token', localStorage.getItem('token') || '');
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, changes, { headers });
  }

  deleteUser(id: string): Observable<{ message: string }> {
    const headers = new HttpHeaders().set('x-access-token', localStorage.getItem('token') || '');
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers });
  }
}