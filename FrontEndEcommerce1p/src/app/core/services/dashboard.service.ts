import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  success: boolean;
  data: {
    total_products: number;
    total_users: number;
    total_orders: number;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/admin/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('DashboardService Error:', error);
          return throwError(() => new Error(error.error?.message || 'Error al obtener estadísticas'));
        })
      );
  }
}