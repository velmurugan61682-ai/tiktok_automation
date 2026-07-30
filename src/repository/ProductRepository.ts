import { getCollection, saveCollection } from "../lib/db.js";
import { Product, Category, Warehouse } from "../types.js";

export class ProductRepository {
  // --- Categories ---
  static findCategories(workspaceId: string): Category[] {
    return getCollection("categories").filter(c => c.workspaceId === workspaceId);
  }

  static createCategory(category: Omit<Category, "id">): Category {
    const categories = getCollection("categories");
    const newId = `cat-${categories.length + 1}`;
    const newCategory: Category = { ...category, id: newId };
    categories.push(newCategory);
    saveCollection("categories", categories);
    return newCategory;
  }

  // --- Warehouses ---
  static findWarehouses(workspaceId: string): Warehouse[] {
    return getCollection("warehouses").filter(w => w.workspaceId === workspaceId);
  }

  static createWarehouse(warehouse: Omit<Warehouse, "id">): Warehouse {
    const warehouses = getCollection("warehouses");
    const newId = `wh-${warehouses.length + 1}`;
    const newWarehouse: Warehouse = { ...warehouse, id: newId };
    warehouses.push(newWarehouse);
    saveCollection("warehouses", warehouses);
    return newWarehouse;
  }

  // --- Products ---
  static find(workspaceId: string): Product[] {
    return getCollection("products").filter(p => p.workspaceId === workspaceId);
  }

  static findById(workspaceId: string, id: string): Product | undefined {
    return getCollection("products").find(p => p.workspaceId === workspaceId && p.id === id);
  }

  static create(product: Omit<Product, "id" | "createdAt">): Product {
    const products = getCollection("products");
    const newId = `prod-${products.length + 1}`;
    const newProduct: Product = {
      ...product,
      id: newId,
      createdAt: new Date().toISOString().split("T")[0]
    };
    products.push(newProduct);
    saveCollection("products", products);
    return newProduct;
  }

  static update(workspaceId: string, id: string, updates: Partial<Product>): Product | undefined {
    const products = getCollection("products");
    const index = products.findIndex(p => p.workspaceId === workspaceId && p.id === id);
    if (index === -1) return undefined;

    const updatedProduct = { ...products[index], ...updates };
    products[index] = updatedProduct;
    saveCollection("products", products);
    return updatedProduct;
  }

  static delete(workspaceId: string, id: string): boolean {
    const products = getCollection("products");
    const initialLen = products.length;
    const filtered = products.filter(p => !(p.workspaceId === workspaceId && p.id === id));
    if (filtered.length === initialLen) return false;
    saveCollection("products", filtered);
    return true;
  }
}
