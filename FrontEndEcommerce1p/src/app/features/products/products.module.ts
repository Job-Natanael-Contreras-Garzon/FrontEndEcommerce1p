import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { ProductTableComponent } from './components/product-table/product-table.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ProductTableComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatDialogModule,
    RouterModule.forChild([{ path: '', component: ProductTableComponent }])
  ]
})
export class ProductsModule {}
