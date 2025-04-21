import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.scss']
})
export class CategoryTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource: MatTableDataSource<Category>;
  loading = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Category>([]);
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;
    
    // TODO: Implement categories service and call it here
    // Mock data for now
    const mockCategories: Category[] = [
      { id: '1', name: 'Electronics', description: 'Electronic devices and gadgets' },
      { id: '2', name: 'Clothing', description: 'Apparel and accessories' },
    ];
    
    this.dataSource = new MatTableDataSource<Category>(mockCategories);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog(): void {
    // TODO: Implement category dialog component
    // const dialogRef = this.dialog.open(CategoryDialogComponent, {
    //   width: '400px'
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     // Add category logic
    //   }
    // });
  }

  openEditDialog(category: Category): void {
    // TODO: Implement category dialog component
    // const dialogRef = this.dialog.open(CategoryDialogComponent, {
    //   width: '400px',
    //   data: category
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     // Edit category logic
    //   }
    // });
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      // TODO: Implement delete category logic
      // this.categoriesService.deleteCategory(id).subscribe({
      //   next: (response) => {
      //     this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
      //     this.loadCategories();
      //   },
      //   error: (error) => {
      //     this.snackBar.open(error.message, 'Close', { duration: 3000 });
      //   }
      // });
    }
  }

  exportToExcel(): void {
    if (!this.dataSource.data.length) {
      this.snackBar.open('No data to export', 'Close', { duration: 3000 });
      return;
    }

    const data = this.dataSource.data.map(category => ({
      ID: category.id,
      Name: category.name,
      Description: category.description
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Categories');
    XLSX.writeFile(wb, 'categories.xlsx');
  }
}
