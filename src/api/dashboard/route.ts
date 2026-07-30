import express from "express";
import { DashboardService } from "../../services/DashboardService.js";

export const dashboardRouter = express.Router();

/**
 * GET /api/dashboard
 * Retrieves real-time high-density dashboard metrics for the tenant workspace
 */
dashboardRouter.get("/", async (req: any, res: any) => {
  try {
    const workspaceId = req.user?.workspaceId;
    if (!workspaceId) {
      return res.status(400).json({ error: "Missing workspace identifier." });
    }

    const metrics = await DashboardService.getMetrics(workspaceId);
    return res.json(metrics);
  } catch (error: any) {
    console.error("Error fetching dashboard metrics:", error);
    return res.status(500).json({ error: error.message || "Failed to load dashboard metrics." });
  }
});
