import { getCollection, saveCollection } from "../lib/db.js";
import { Order, Analytics } from "../types.js";

export class OrderRepository {
  static find(workspaceId: string): Order[] {
    return getCollection("orders").filter(o => o.workspaceId === workspaceId);
  }

  static findById(workspaceId: string, id: string): Order | undefined {
    return getCollection("orders").find(o => o.workspaceId === workspaceId && o.id === id);
  }

  static create(order: Omit<Order, "id" | "createdAt">): Order {
    const orders = getCollection("orders");
    const newId = `ORD-${101 + orders.length}`;
    const newOrder: Order = {
      ...order,
      id: newId,
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    saveCollection("orders", orders);
    return newOrder;
  }

  static update(workspaceId: string, id: string, updates: Partial<Order>): Order | undefined {
    const orders = getCollection("orders");
    const index = orders.findIndex(o => o.workspaceId === workspaceId && o.id === id);
    if (index === -1) return undefined;

    const updatedOrder = { ...orders[index], ...updates };
    orders[index] = updatedOrder;
    saveCollection("orders", orders);
    return updatedOrder;
  }

  // --- Analytics ---
  static getAnalytics(workspaceId: string): Analytics[] {
    return getCollection("analytics").filter(a => a.workspaceId === workspaceId);
  }

  static saveAnalytics(analytics: Analytics[]): void {
    const allAnalytics = getCollection("analytics");
    const workspaceId = analytics[0]?.workspaceId;
    if (!workspaceId) return;

    const filtered = allAnalytics.filter(a => a.workspaceId !== workspaceId);
    filtered.push(...analytics);
    saveCollection("analytics", filtered);
  }
}
