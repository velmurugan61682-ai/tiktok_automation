export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  paymentMethod: string;
  createdAt: string;
}
