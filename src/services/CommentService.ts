import { CommentRepository } from "../repository/CommentRepository.js";
import { AutomationRepository } from "../repository/AutomationRepository.js";
import { ConversationRepository } from "../repository/ConversationRepository.js";
import { Comment } from "../types.js";
import { AIService } from "./AIService.js";
import { TikTokService } from "./TikTokService.js";

export class CommentService {
  static getComments(workspaceId: string): Comment[] {
    return CommentRepository.find(workspaceId);
  }

  static async addCommentAndProcess(
    workspaceId: string,
    customerId: string,
    customerName: string,
    postType: Comment["postType"],
    postId: string,
    text: string
  ): Promise<Comment> {
    // 1. Save comment
    const comment = CommentRepository.create({
      workspaceId,
      customerId,
      customerName,
      postType,
      postId,
      text,
      status: "PENDING"
    });

    // 2. Scan active automation rules for matching keywords
    const rules = AutomationRepository.findRules(workspaceId).filter(r => r.isEnabled && r.type === "COMMENT");
    const textLower = text.toLowerCase();

    let matchedRule = rules.find(rule => 
      rule.triggerKeyword.some(kw => textLower.includes(kw.toLowerCase()))
    );

    if (matchedRule) {
      // Execute trigger
      let replyText = (matchedRule as any).replyCommentText || matchedRule.replyTemplate;
      let dmSent = false;

      if (matchedRule.actionType === "AI_REPLY") {
        // Find or create conversation for this commenter to pass to AIService
        const conversations = ConversationRepository.find(workspaceId);
        let conv = conversations.find(c => c.customerId === customerId);
        if (!conv) {
          conv = ConversationRepository.createConversation({
            workspaceId,
            customerId,
            status: "OPEN",
            aiEnabled: false,
            channel: "TIKTOK",
            unreadCount: 0
          });
        }
        
        try {
          // Generate AI response dynamically using the AI service and template details to avoid hardcoded text
          replyText = await AIService.generateReply(
            workspaceId, 
            conv.id, 
            `Comment text: "${text}". Template message: "${matchedRule.replyTemplate}". Please write a response that addresses the comment and includes the details from the template message.`
          );
        } catch (aiErr) {
          console.error("Failed to generate AI comment reply:", aiErr);
          replyText = matchedRule.replyTemplate || "Thank you for your comment! We have processed your request.";
        }
        dmSent = true;
      } else if (matchedRule.actionType === "AUTO_DM") {
        dmSent = true;
      }

      // If DM was triggered, create a conversation and message in local Chat Inbox
      if (dmSent) {
        // Find or create conversation for this commenter
        const conversations = ConversationRepository.find(workspaceId);
        let conv = conversations.find(c => c.customerId === customerId);
        if (!conv) {
          conv = ConversationRepository.createConversation({
            workspaceId,
            customerId,
            status: "OPEN",
            aiEnabled: false,
            channel: "TIKTOK",
            unreadCount: 0
          });
        }

        let dmContent = matchedRule.replyTemplate;
        try {
          const generated = await AIService.generateReply(
            workspaceId,
            conv.id,
            `Comment text: "${text}". Template message: "${matchedRule.replyTemplate}". Please write a response that addresses the comment and includes the details from the template message.`
          );
          if (generated && !generated.includes("glitch") && !generated.includes("assist you directly") && !generated.includes("human agent")) {
            dmContent = generated;
          }
        } catch (aiErr) {
          console.error("Failed to generate AI comment webhook DM:", aiErr);
        }

        // Add customer comment trigger message
        ConversationRepository.createMessage({
          workspaceId,
          conversationId: conv.id,
          senderId: "CUSTOMER",
          senderName: customerName,
          text: `[Commented on Video ${postId}] "${text}"`,
          readStatus: true,
          isInternalNote: false
        });

        // Add automated DM response
        ConversationRepository.createMessage({
          workspaceId,
          conversationId: conv.id,
          senderId: "AI",
          senderName: "AI Assistant",
          text: dmContent,
          readStatus: true,
          isInternalNote: false
        });

        // Trigger sending DM to customer via TikTok Messaging API
        TikTokService.sendDirectMessage(workspaceId, customerId, dmContent)
          .catch(err => console.error("Failed to send direct message via TikTok API:", err));
      }

      // Update rule usage count
      AutomationRepository.updateRule(workspaceId, matchedRule.id, {
        usageCount: matchedRule.usageCount + 1
      });

      // Update comment with auto reply details
      const updated = CommentRepository.update(workspaceId, comment.id, {
        replyText,
        dmSent,
        status: "REPLIED"
      });

      return updated || comment;
    }

    return comment;
  }
}
