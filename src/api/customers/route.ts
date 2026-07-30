import express from "express";
import { CustomerService } from "../../services/OrderService.js";

export const customersRouter = express.Router();

// GET /api/customers
customersRouter.get("/", (req: any, res: any) => {
  try {
    const data = CustomerService.getCustomers(req.user.workspaceId);
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
