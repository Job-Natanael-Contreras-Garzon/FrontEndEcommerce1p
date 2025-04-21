import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: 'panel',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/users/users.module').then(
            (m) => m.UsersModule
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./features/orders/orders.module').then(
            (m) => m.OrdersModule
          ),
      },
    ],
  },
  { path: '', redirectTo: '/panel/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/panel/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
