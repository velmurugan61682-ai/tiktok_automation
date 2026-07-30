import { ProductRepository } from "../repository/ProductRepository.js";
import { Product, Category, Warehouse, Variant } from "../types.js";

export class ProductService {
  // Products
  static getProducts(workspaceId: string): Product[] {
    return ProductRepository.find(workspaceId);
  }

  static getProductById(workspaceId: string, id: string): Product | undefined {
    return ProductRepository.findById(workspaceId, id);
  }

  static createProduct(productData: Omit<Product, "id" | "createdAt">): Product {
    return ProductRepository.create(productData);
  }

  static updateProduct(workspaceId: string, id: string, updates: Partial<Product>): Product | undefined {
    return ProductRepository.update(workspaceId, id, updates);
  }

  static deleteProduct(workspaceId: string, id: string): boolean {
    return ProductRepository.delete(workspaceId, id);
  }

  // Categories
  static getCategories(workspaceId: string): Category[] {
    return ProductRepository.findCategories(workspaceId);
  }

  static createCategory(workspaceId: string, name: string, description?: string): Category {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    return ProductRepository.createCategory({ workspaceId, name, description, slug });
  }

  // Warehouses
  static getWarehouses(workspaceId: string): Warehouse[] {
    return ProductRepository.findWarehouses(workspaceId);
  }

  static createWarehouse(workspaceId: string, name: string, location?: string): Warehouse {
    return ProductRepository.createWarehouse({ workspaceId, name, location });
  }
}

// Inventory Service
export class InventoryService {
  static getStockReport(workspaceId: string) {
    const products = ProductRepository.find(workspaceId);
    return products.map(p => ({
      productId: p.id,
      name: p.name,
      sku: p.sku,
      stock: p.stock,
      status: p.stock < 50 ? "LOW_STOCK" : "IN_STOCK"
    }));
  }

  static adjustStock(workspaceId: string, productId: string, quantityChange: number, notes?: string): boolean {
    const product = ProductRepository.findById(workspaceId, productId);
    if (!product) return false;

    const newStock = Math.max(0, product.stock + quantityChange);
    ProductRepository.update(workspaceId, productId, { stock: newStock });

    // In a real DB, we'd write to InventoryLog. Let's do it via getDb logs if desired, but this is enough to update stock.
    return true;
  }
}
