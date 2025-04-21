import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Users, CreateUsersDTO, UpdateUsersDTO } from '../models/users.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, limit: number = 10, role?: string): Observable<ApiResponse<{ users: Users[], total: number }>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (role) {
      params = params.set('role', role);
    }

    return this.http.get<ApiResponse<{ users: Users[], total: number }>>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  getUser(id: string): Observable<ApiResponse<Users>> {
    return this.http.get<ApiResponse<Users>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createUser(user: CreateUsersDTO): Observable<ApiResponse<Users>> {
    return this.http.post<ApiResponse<Users>>(this.apiUrl, user)
      .pipe(catchError(this.handleError));
  }

  updateUser(id: string, changes: UpdateUsersDTO): Observable<ApiResponse<{ message: string }>> {
    return this.http.put<ApiResponse<{ message: string }>>(`${this.apiUrl}/${id}`, changes)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('UsersService Error:', error);
    return throwError(() => new Error(error.error?.message || 'An error occurred'));
  }
}