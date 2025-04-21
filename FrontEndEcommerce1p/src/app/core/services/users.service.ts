import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Users, CreateUsersDTO, UpdateUsersDTO } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, limit: number = 10, role?: string): Observable<{ users: Users[], total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (role) {
      params = params.set('role', role);
    }

    return this.http.get<{ users: Users[], total: number }>(this.apiUrl, { params });
  }

  getUser(id: string): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}/${id}`);
  }

  createUser(user: CreateUsersDTO): Observable<Users> {
    return this.http.post<Users>(this.apiUrl, user);
  }

  updateUser(id: string, changes: UpdateUsersDTO): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, changes);
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}