import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}admin/products`;

  constructor(private http: HttpClient) {}

  getProducts(page = 1, limit = 10): Observable<{ products: Product[]; total: number }> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
    return this.http.get<{ products: Product[]; total: number }>(this.apiUrl, { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(dto: CreateProductDTO): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, dto);
  }

  updateProduct(id: string, changes: UpdateProductDTO): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, changes);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
