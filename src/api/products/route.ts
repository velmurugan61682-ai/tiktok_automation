import express from "express";
import { ProductService, InventoryService } from "../../services/ProductService.js";

export const productsRouter = express.Router();

// GET /api/products
productsRouter.get("/", (req: any, res: any) => {
  try {
    const data = ProductService.getProducts(req.user.workspaceId);
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/products
productsRouter.post("/", (req: any, res: any) => {
  try {
    const product = ProductService.createProduct({
      ...req.body,
      workspaceId: req.user.workspaceId
    });
    return res.status(201).json(product);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/products/categories
productsRouter.get("/categories/list", (req: any, res: any) => {
  try {
    const data = ProductService.getCategories(req.user.workspaceId);
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/products/categories
productsRouter.post("/categories/create", (req: any, res: any) => {
  try {
    const category = ProductService.createCategory(req.user.workspaceId, req.body.name, req.body.description);
    return res.status(201).json(category);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/products/warehouses
productsRouter.get("/warehouses/list", (req: any, res: any) => {
  try {
    const data = ProductService.getWarehouses(req.user.workspaceId);
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/products/inventory/adjust
productsRouter.post("/inventory/adjust", (req: any, res: any) => {
  try {
    const { productId, quantityChange, notes } = req.body;
    const success = InventoryService.adjustStock(req.user.workspaceId, productId, quantityChange, notes);
    return res.json({ success });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
productsRouter.get("/:id", (req: any, res: any) => {
  try {
    const product = ProductService.getProductById(req.user.workspaceId, req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id
productsRouter.put("/:id", (req: any, res: any) => {
  try {
    const updated = ProductService.updateProduct(req.user.workspaceId, req.params.id, req.body);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id
productsRouter.delete("/:id", (req: any, res: any) => {
  try {
    ProductService.deleteProduct(req.user.workspaceId, req.params.id);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
