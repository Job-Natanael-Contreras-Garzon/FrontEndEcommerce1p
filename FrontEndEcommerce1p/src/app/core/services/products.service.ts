import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly apiUrl = `${environment.apiUrl}/client/products`;

  constructor(private http: HttpClient) {}

  getProducts(page: number = 1, limit: number = 10): Observable<ApiResponse<Product[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<Product[]>>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  getProduct(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  addProduct(product: Omit<Product, 'id'>): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}`, product)
      .pipe(catchError(this.handleError));
  }

  updateProduct(id: string | number, productData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, productData)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || 'Server error';
      if (error.status === 404) {
        errorMessage = 'Product not found';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid request';
      }
    }
    console.error('ProductsService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}