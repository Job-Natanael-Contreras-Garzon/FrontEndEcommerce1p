import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductDialogComponent } from './components/product-dialog/product-dialog.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ProductTableComponent,
    ProductDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    // Material Modules
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule.forChild([
      { path: '', component: ProductTableComponent }
    ])
  ]
})
export class ProductsModule { }