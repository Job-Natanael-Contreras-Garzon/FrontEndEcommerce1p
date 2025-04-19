# FrontEndEcommerce1p
 
# Estructura para Frontend en Angular - FlaskEcommerce

## Estructura de Directorios

```
src/
├── app/
│   ├── core/                   # Servicios y utilidades centrales
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.guard.ts
│   │   │   ├── token.interceptor.ts
│   │   │   └── jwt.service.ts
│   │   ├── services/
│   │   │   ├── product.service.ts
│   │   │   ├── cart.service.ts
│   │   │   ├── order.service.ts
│   │   │   └── category.service.ts
│   │   ├── models/
│   │   │   ├── product.model.ts
│   │   │   ├── user.model.ts
│   │   │   ├── cart.model.ts
│   │   │   └── order.model.ts
│   │   └── http/
│   │       └── api.interceptor.ts
│   │
│   ├── shared/                 # Componentes, pipes y directivas compartidas
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── product-card/
│   │   │   ├── loading-spinner/
│   │   │   └── alert/
│   │   ├── pipes/
│   │   │   └── currency-format.pipe.ts
│   │   └── directives/
│   │       └── highlight.directive.ts
│   │
│   ├── features/               # Módulos de funcionalidades
│   │   ├── home/
│   │   │   ├── home.component.ts
│   │   │   ├── home.component.html
│   │   │   └── home.module.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── product/
│   │   │   ├── product-list/
│   │   │   ├── product-detail/
│   │   │   └── product.module.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── cart-view/
│   │   │   └── cart.module.ts
│   │   │
│   │   ├── checkout/
│   │   │   ├── shipping-info/
│   │   │   ├── payment-info/
│   │   │   ├── order-summary/
│   │   │   └── checkout.module.ts
│   │   │
│   │   └── account/
│   │       ├── order-history/
│   │       ├── profile/
│   │       └── account.module.ts
│   │
│   ├── layouts/                # Plantillas de diseño
│   │   ├── main-layout/
│   │   └── auth-layout/
│   │
│   ├── app-routing.module.ts   # Rutas principales
│   ├── app.component.ts        # Componente raíz
│   └── app.module.ts           # Módulo raíz
│
├── assets/                     # Recursos estáticos
│   ├── images/
│   ├── icons/
│   └── styles/
│
├── environments/               # Configuraciones de entorno
│   ├── environment.ts
│   └── environment.prod.ts
│
└── index.html
```

## Implementación de Servicios Principales

### auth.service.ts
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {
    const token = this.jwtService.getToken();
    if (token) {
      const user = this.jwtService.decodeToken();
      this.currentUserSubject.next(user);
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/api/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            this.jwtService.saveToken(response.token);
            const user: User = {
              id: response.user_id,
              email: email,
              name: response.name || ''
            };
            this.currentUserSubject.next(user);
          }
        }),
        map(response => {
          return {
            id: response.user_id,
            email: email,
            name: response.name || ''
          };
        })
      );
  }

  register(name: string, email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/api/register`, { name, email, password })
      .pipe(
        map(response => {
          return {
            id: response.user_id,
            email: email,
            name: name
          };
        })
      );
  }

  logout(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.jwtService.getToken() !== null;
  }
}
```

### product.service.ts
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(`${this.apiUrl}/api/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/api/products/${id}`);
  }

  getProductsByCategory(categoryId: number): Observable<{ products: Product[], category_name: string }> {
    return this.http.get<{ products: Product[], category_name: string }>(
      `${this.apiUrl}/api/products/category/${categoryId}`
    );
  }
}
```

### cart.service.ts
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl;
  private cartSubject = new BehaviorSubject<Cart>({ cart_items: [], total: 0 });
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  loadCart(): void {
    this.http.get<Cart>(`${this.apiUrl}/api/cart`)
      .subscribe(
        cart => this.cartSubject.next(cart),
        error => console.error('Error loading cart', error)
      );
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/cart/add`, { product_id: productId, quantity })
      .pipe(
        tap(() => this.loadCart())
      );
  }

  updateCartItem(cartItemId: number, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/cart/update`, { cart_item_id: cartItemId, quantity })
      .pipe(
        tap(() => this.loadCart())
      );
  }

  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/cart/remove/${cartItemId}`)
      .pipe(
        tap(() => this.loadCart())
      );
  }

  getCartItemCount(): number {
    return this.cartSubject.value.cart_items.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartSubject.value.total;
  }
}
```

## Módulos Principales

### app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './core/auth/token.interceptor';
import { ApiInterceptor } from './core/http/api.interceptor';

// Layouts
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

// Shared Components
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { AlertComponent } from './shared/components/alert/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
    HeaderComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### app-routing.module.ts
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './core/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./features/product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule)
      },
      {
        path: 'checkout',
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/checkout/checkout.module').then(m => m.CheckoutModule)
      },
      {
        path: 'account',
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule)
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## Modelos de Datos

### product.model.ts
```typescript
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string;
  stock: number;
  specifications?: Array<{key: string, value: string}>;
}
```

### cart.model.ts
```typescript
export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  image_url: string;
}

export interface Cart {
  cart_items: CartItem[];
  total: number;
}
```

### order.model.ts
```typescript
export interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface Order {
  id: number;
  date: string;
  status: string;
  total: number;
  items_count?: number;
  shipping_address?: ShippingAddress;
  items?: OrderItem[];
}
```

### user.model.ts
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}
```