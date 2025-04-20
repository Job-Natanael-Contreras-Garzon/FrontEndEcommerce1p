import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';

  page = 1;
  pageSize = 5;
  total = 0;
  pages: number[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts(this.page, this.pageSize).subscribe({
      next: ({ products, total }) => {
        this.products = products;
        this.total = total;
        this.calcPages();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  calcPages() {
    this.pages = Array.from(
      { length: Math.max(1, Math.ceil(this.total / this.pageSize)) },
      (_, i) => i + 1
    );
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadProducts();
    }
  }

  nextPage() {
    if (this.page < this.pages.length) {
      this.page++;
      this.loadProducts();
    }
  }

  goToPage(p: number) {
    this.page = p;
    this.loadProducts();
  }

  addProduct() {
    // TODO: Implementar diálogo de añadir producto
  }

  editProduct(p: Product) {
    // TODO: Implementar edición de producto
  }

  deleteProduct(p: Product) {
    if (confirm(`¿Eliminar ${p.name}?`)) {
      this.productService
        .deleteProduct(p.id)
        .subscribe(() => this.loadProducts());
    }
  }

  exportExcel() {
    const data = this.products.map((p) => ({
      ID: p.id,
      Nombre: p.name,
      Precio: p.price,
      Categoría: p.category,
      Stock: p.stock,
      'URL Imagen': p.imageUrl,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'productos.xlsx');
  }
}