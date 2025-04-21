import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { Order, OrderStatus } from '../../../../core/models/order.model';
import { OrderStatusDialogComponent } from '../order-status-dialog/order-status-dialog.component';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss']
})
export class OrderTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'user', 'date', 'total', 'status', 'shippingAddress', 'actions'];
  dataSource: MatTableDataSource<Order>;
  loading = false;
  error: string | null = null;

  selectedStatus = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  orderStatuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Order>([]);
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    
    // TODO: Implement orders service and call it here
    // Mock data for now
    const mockOrders: Order[] = [
      { 
        id: '1', 
        user: 'usuario123',
        date: new Date('2023-06-20'),
        total: 599.99,
        status: 'Pending',
        shippingAddress: 'Calle Principal'
      },
      { 
        id: '2', 
        user: 'usuario456',
        date: new Date('2023-06-21'),
        total: 299.99,
        status: 'Delivered',
        shippingAddress: 'Avenida Central'
      }
    ];
    
    this.dataSource = new MatTableDataSource<Order>(mockOrders);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.createFilter();
    this.loading = false;
  }

  createFilter(): (data: Order, filter: string) => boolean {
    return (data: Order, filter: string): boolean => {
      const searchStr = (data.user + data.shippingAddress).toLowerCase();
      return searchStr.indexOf(filter.toLowerCase()) !== -1;
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilters(): void {
    const originalData = [...this.dataSource.data];
    this.dataSource.data = originalData.filter(item => {
      const matchesStatus = !this.selectedStatus || item.status === this.selectedStatus;
      const itemDate = new Date(item.date);
      const matchesDateRange = (!this.startDate || itemDate >= this.startDate) && 
                             (!this.endDate || itemDate <= this.endDate);
      return matchesStatus && matchesDateRange;
    });
  }

  openEditDialog(order: Order): void {
    const dialogRef = this.dialog.open(OrderStatusDialogComponent, {
      width: '400px',
      data: order
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO: Implement order status update service
        const updatedOrder = { ...order, status: result };
        const index = this.dataSource.data.findIndex(o => o.id === order.id);
        const newData = [...this.dataSource.data];
        newData[index] = updatedOrder;
        this.dataSource.data = newData;
        
        this.snackBar.open('Order status updated successfully', 'Close', { duration: 3000 });
      }
    });
  }

  openDetailsDialog(order: Order): void {
    // TODO: Implement order details dialog
    // const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
    //   width: '600px',
    //   data: order
    // });
  }

  exportToExcel(): void {
    if (!this.dataSource.data.length) {
      this.snackBar.open('No data to export', 'Close', { duration: 3000 });
      return;
    }

    const data = this.dataSource.data.map(order => ({
      ID: order.id,
      User: order.user,
      Date: new Date(order.date).toLocaleDateString(),
      Total: order.total,
      Status: order.status,
      'Shipping Address': order.shippingAddress
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders.xlsx');
  }
}
