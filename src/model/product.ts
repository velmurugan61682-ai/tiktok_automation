export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  description: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "DRAFT";
  images?: string[];
  tax?: number;
  variants?: any[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface WarehouseData {
  id: string;
  name: string;
  location?: string;
}
