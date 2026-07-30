import express from "express";
import { AutomationService } from "../../services/AutomationService.js";
import { CommentService } from "../../services/CommentService.js";

export const automationRouter = express.Router();

// GET /api/automation/comments (mapped from /api/comments)
automationRouter.get("/comments", (req: any, res: any) => {
  try {
    const data = CommentService.getComments(req.user.workspaceId);
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/automation/comments/add (mapped from /api/comments/add)
automationRouter.post("/comments/add", async (req: any, res: any) => {
  try {
    const comment = await CommentService.addCommentAndProcess(
      req.user.workspaceId,
      req.body.customerId || "cust-2",
      req.body.customerName || "Simulated Guest",
      req.body.postType || "TIKTOK",
      req.body.postId || "post-99",
      req.body.text
    );
    return res.status(201).json(comment);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/automation/rules
automationRouter.get("/rules", (req: any, res: any) => {
  try {
    const data = AutomationService.getRules(req.user.workspaceId);
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/automation/rules
automationRouter.post("/rules", (req: any, res: any) => {
  try {
    const rule = AutomationService.createRule({
      ...req.body,
      workspaceId: req.user.workspaceId
    });
    return res.status(201).json(rule);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/automation/rules/:id
automationRouter.put("/rules/:id", (req: any, res: any) => {
  try {
    const updated = AutomationService.updateRule(req.user.workspaceId, req.params.id, req.body);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/automation/rules/:id
automationRouter.delete("/rules/:id", (req: any, res: any) => {
  try {
    AutomationService.deleteRule(req.user.workspaceId, req.params.id);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/automation/kb
automationRouter.get("/kb", (req: any, res: any) => {
  try {
    const data = AutomationService.getKnowledgeBases(req.user.workspaceId);
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/automation/kb
automationRouter.post("/kb", (req: any, res: any) => {
  try {
    const kb = AutomationService.createKnowledgeBase({
      ...req.body,
      workspaceId: req.user.workspaceId
    });
    return res.status(201).json(kb);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/automation/kb/:id
automationRouter.delete("/kb/:id", (req: any, res: any) => {
  try {
    AutomationService.deleteKnowledgeBase(req.user.workspaceId, req.params.id);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
