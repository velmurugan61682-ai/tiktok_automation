import { OrderRepository } from "../repository/OrderRepository.js";
import { CustomerRepository } from "../repository/CustomerRepository.js";
import { Order, Customer } from "../types.js";

export class OrderService {
  static getOrders(workspaceId: string): Order[] {
    return OrderRepository.find(workspaceId);
  }

  static getOrderById(workspaceId: string, id: string): Order | undefined {
    return OrderRepository.findById(workspaceId, id);
  }

  static createOrder(orderData: Omit<Order, "id" | "createdAt">): Order {
    const order = OrderRepository.create(orderData);

    // Update customer LTV
    const customer = CustomerRepository.findById(orderData.workspaceId, orderData.customerId);
    if (customer) {
      const updatedLTV = customer.lifetimeValue + order.totalAmount;
      CustomerRepository.update(orderData.workspaceId, orderData.customerId, {
        lifetimeValue: updatedLTV
      });
    }

    return order;
  }

  static updateOrderStatus(workspaceId: string, id: string, status: Order["status"]): Order | undefined {
    return OrderRepository.update(workspaceId, id, { status });
  }

  static updatePaymentStatus(workspaceId: string, id: string, paymentStatus: Order["paymentStatus"]): Order | undefined {
    return OrderRepository.update(workspaceId, id, { paymentStatus });
  }
}

export class CustomerService {
  static getCustomers(workspaceId: string): Customer[] {
    return CustomerRepository.find(workspaceId);
  }

  static getCustomerById(workspaceId: string, id: string): Customer | undefined {
    return CustomerRepository.findById(workspaceId, id);
  }

  static createCustomer(workspaceId: string, name: string, phone: string, email: string, tags: string[] = []): Customer {
    return CustomerRepository.create({
      workspaceId,
      name,
      phone,
      email,
      tags,
      lifetimeValue: 0
    });
  }

  static updateCustomer(workspaceId: string, id: string, updates: Partial<Customer>): Customer | undefined {
    return CustomerRepository.update(workspaceId, id, updates);
  }
}
