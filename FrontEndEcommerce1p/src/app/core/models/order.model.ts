export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  user: string;
  date: Date;
  total: number;
  status: OrderStatus;
  shippingAddress: string;
}

export interface CreateOrderDTO {
  user: string;
  total: number;
  shippingAddress: string;
}

export interface UpdateOrderDTO {
  status: OrderStatus;
}