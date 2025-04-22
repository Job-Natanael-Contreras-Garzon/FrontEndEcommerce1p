import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Producto 1',
      description: 'Descripción del producto 1',
      price: 99.99,
      stock: 100,
      category: 'Electrónicos',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: '2',
      name: 'Producto 2',
      description: 'Descripción del producto 2',
      price: 149.99,
      stock: 50,
      category: 'Ropa',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: '3',
      name: 'Producto 3',
      description: 'Descripción del producto 3',
      price: 199.99,
      stock: 75,
      category: 'Hogar',
      imageUrl: 'https://via.placeholder.com/150'
    }
  ];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ApiResponse<Product[]>> {
    return of({
      success: true,
      data: this.mockProducts,
      message: 'Products retrieved successfully'
    });
  }

  getProduct(id: string): Observable<ApiResponse<Product>> {
    const product = this.mockProducts.find(p => p.id === id);
    if (product) {
      return of({
        success: true,
        data: product,
        message: 'Product found'
      });
    }
    return throwError(() => new Error('Product not found'));
  }

  addProduct(product: Omit<Product, 'id'>): Observable<ApiResponse<void>> {
    const newProduct: Product = {
      ...product,
      id: (this.mockProducts.length + 1).toString()
    };
    this.mockProducts.push(newProduct);
    return of({
      success: true,
      message: 'Product added successfully'
    });
  }

  updateProduct(id: string, changes: Partial<Product>): Observable<ApiResponse<void>> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts[index] = { ...this.mockProducts[index], ...changes };
      return of({
        success: true,
        message: 'Product updated successfully'
      });
    }
    return throwError(() => new Error('Product not found'));
  }

  deleteProduct(id: string): Observable<ApiResponse<void>> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts.splice(index, 1);
      return of({
        success: true,
        message: 'Product deleted successfully'
      });
    }
    return throwError(() => new Error('Product not found'));
  }
}