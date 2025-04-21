import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsService } from '../../../../core/services/products.service';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { Product } from '../../../../core/models/product.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'price', 'stock', 'actions'];
  dataSource: MatTableDataSource<Product>;
  loading = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productsService: ProductsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Product>([]);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productsService.getProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.dataSource = new MatTableDataSource(response.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.error = response.message || 'Error loading products';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.snackBar.open(error.message, 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productsService.addProduct(result).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Product added successfully', 'Close', { duration: 3000 });
              this.loadProducts();
            } else {
              this.snackBar.open(response.message || 'Error adding product', 'Close', { duration: 3000 });
            }
          },
          error: (error) => {
            this.snackBar.open(error.message, 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '400px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productsService.updateProduct(product.id, result).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
              this.loadProducts();
            } else {
              this.snackBar.open(response.message || 'Error updating product', 'Close', { duration: 3000 });
            }
          },
          error: (error) => {
            this.snackBar.open(error.message, 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
            this.loadProducts();
          } else {
            this.snackBar.open(response.message || 'Error deleting product', 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }

  exportToExcel(): void {
    if (!this.dataSource.data.length) {
      this.snackBar.open('No data to export', 'Close', { duration: 3000 });
      return;
    }

    const data = this.dataSource.data.map(product => ({
      ID: product.id,
      Nombre: product.name,
      Descripción: product.description,
      Precio: product.price,
      Stock: product.stock,
      Categoría: product.category
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'productos.xlsx');
  }
}