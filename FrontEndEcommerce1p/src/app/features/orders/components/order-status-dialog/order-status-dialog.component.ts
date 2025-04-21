import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order, OrderStatus } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-status-dialog',
  templateUrl: './order-status-dialog.component.html',
  styleUrls: ['./order-status-dialog.component.scss']
})
export class OrderStatusDialogComponent {
  orderStatuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  selectedStatus: OrderStatus;

  constructor(
    private dialogRef: MatDialogRef<OrderStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order
  ) {
    this.selectedStatus = data.status;
  }

  onSubmit(): void {
    this.dialogRef.close(this.selectedStatus);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}