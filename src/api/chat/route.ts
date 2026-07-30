import express from "express";
import { ChatService } from "../../services/ChatService.js";
import { TikTokService } from "../../services/TikTokService.js";

export const chatRouter = express.Router();

// GET /api/chat/conversations
chatRouter.get("/conversations", async (req: any, res: any) => {
  try {
    // Sync conversations and messages from TikTok Shop API
    await TikTokService.syncConversations(req.user.workspaceId);
    
    const data = ChatService.getConversations(req.user.workspaceId);
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/chat/messages/:id
chatRouter.get("/messages/:id", (req: any, res: any) => {
  try {
    const data = ChatService.getMessages(req.user.workspaceId, req.params.id);
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/chat/send
chatRouter.post("/send", async (req: any, res: any) => {
  try {
    const { conversationId, text, isInternalNote, senderId, senderName } = req.body;
    const msg = await ChatService.sendMessage(
      req.user.workspaceId,
      conversationId,
      senderId || req.user.userId,
      senderName || req.user.name,
      text,
      !!isInternalNote
    );
    return res.status(201).json(msg);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/chat/toggle-ai
chatRouter.post("/toggle-ai", (req: any, res: any) => {
  try {
    const { conversationId, enabled } = req.body;
    const updated = ChatService.toggleAI(req.user.workspaceId, conversationId, enabled);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/chat/mark-read
chatRouter.post("/mark-read", (req: any, res: any) => {
  try {
    ChatService.markAsRead(req.user.workspaceId, req.body.conversationId);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
