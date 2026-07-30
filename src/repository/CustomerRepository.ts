import { getCollection, saveCollection } from "../lib/db.js";
import { Customer } from "../types.js";

export class CustomerRepository {
  static find(workspaceId: string): Customer[] {
    return getCollection("customers").filter(c => c.workspaceId === workspaceId);
  }

  static findById(workspaceId: string, id: string): Customer | undefined {
    return getCollection("customers").find(c => c.workspaceId === workspaceId && c.id === id);
  }

  static create(customer: Omit<Customer, "id" | "createdAt">): Customer {
    const customers = getCollection("customers");
    const newId = `cust-${customers.length + 1}`;
    const newCustomer: Customer = {
      ...customer,
      id: newId,
      createdAt: new Date().toISOString().split("T")[0]
    };
    customers.push(newCustomer);
    saveCollection("customers", customers);
    return newCustomer;
  }

  static update(workspaceId: string, id: string, updates: Partial<Customer>): Customer | undefined {
    const customers = getCollection("customers");
    const index = customers.findIndex(c => c.workspaceId === workspaceId && c.id === id);
    if (index === -1) return undefined;

    const updatedCustomer = { ...customers[index], ...updates };
    customers[index] = updatedCustomer;
    saveCollection("customers", customers);
    return updatedCustomer;
  }
}
