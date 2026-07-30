import express from "express";
import { OrderService } from "../../services/OrderService.js";

export const ordersRouter = express.Router();

// GET /api/orders
ordersRouter.get("/", (req: any, res: any) => {
  try {
    const data = OrderService.getOrders(req.user.workspaceId);
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
ordersRouter.get("/:id", (req: any, res: any) => {
  try {
    const order = OrderService.getOrderById(req.user.workspaceId, req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json(order);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/status
ordersRouter.put("/:id/status", (req: any, res: any) => {
  try {
    const updated = OrderService.updateOrderStatus(req.user.workspaceId, req.params.id, req.body.status);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
