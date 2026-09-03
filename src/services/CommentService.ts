import { CommentRepository } from "../repository/CommentRepository.js";
import { AutomationRepository } from "../repository/AutomationRepository.js";
import { ConversationRepository } from "../repository/ConversationRepository.js";
import { Comment } from "../types.js";
import { AIService } from "./AIService.js";
import { TikTokService } from "./TikTokService.js";

const TOXIC_WORDS = ["scam", "fraud", "fake", "bad", "useless", "abuse", "insult", "hate", "harass", "spam"];
const COOLDOWN_WINDOW_MS = 24 * 60 * 60 * 1000; // 24-hour rate limit & deduplication window per user per post
const TIKTOK_MAX_REPLY_LENGTH = 150; // Official TikTok comment 150-char limit

/**
 * Output content filter for outgoing automated replies:
 * 1. Enforces TikTok 150-char length limit
 * 2. Filters profane/toxic words
 * 3. Strips unverified raw URLs to prevent spam flags
 */
const sanitizeOutgoingReply = (rawText: string): string => {
  if (!rawText) return "";
  let sanitized = rawText.trim();

  // 1. Strip raw URLs (e.g. http:// or https:// links) to comply with spam prevention
  sanitized = sanitized.replace(/https?:\/\/[^\s]+/gi, "[link]");

  // 2. Filter obvious profanity/toxic words from outgoing replies
  for (const word of TOXIC_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    sanitized = sanitized.replace(regex, "***");
  }

  // 3. Enforce TikTok 150-character limit
  if (sanitized.length > TIKTOK_MAX_REPLY_LENGTH) {
    sanitized = sanitized.slice(0, TIKTOK_MAX_REPLY_LENGTH - 3).trim() + "...";
  }

  return sanitized;
};

const isOwnerContent = (customerId: string, customerName: string) => {
  const nameLower = (customerName || "").toLowerCase();
  const idLower = (customerId || "").toLowerCase();
  return (
    idLower === "ai" ||
    idLower === "agent" ||
    idLower === "system" ||
    idLower === "owner" ||
    nameLower.includes("store agent") ||
    nameLower.includes("automation bot") ||
    nameLower.includes("ai assistant") ||
    nameLower.includes("taqbot")
  );
};

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
    // 1. Save comment in database first
    const comment = CommentRepository.create({
      workspaceId,
      customerId,
      customerName,
      postType,
      postId,
      text,
      status: "PENDING"
    });

    // 2. Process automations and moderation rules
    return this.processCommentAutomation(comment);
  }

  static async processCommentAutomation(comment: Comment): Promise<Comment> {
    const { workspaceId, customerId, customerName, postId, text } = comment;

    // 1. Owner & loop protection checks
    if (isOwnerContent(customerId, customerName)) {
      console.log(`Skipping automation evaluation for bot/owner comment text: "${text}"`);
      return comment;
    }

    if (comment.status !== "PENDING") {
      return comment;
    }

    // 2. Per-user cooldown & deduplication safeguard (24h window per user per post)
    const existingComments = CommentRepository.find(workspaceId);
    const nowTime = Date.now();
    const hasRecentReply = existingComments.some(c =>
      c.customerId === customerId &&
      c.postId === postId &&
      c.status === "REPLIED" &&
      c.id !== comment.id &&
      (nowTime - new Date(c.createdAt || 0).getTime()) < COOLDOWN_WINDOW_MS
    );

    if (hasRecentReply) {
      console.log(`[Rate Limit Safeguard] 24h cooldown active for user ${customerName} (${customerId}) on post ${postId}. Suppressing duplicate automated reply.`);
      const updated = CommentRepository.update(workspaceId, comment.id, {
        status: "REPLIED",
        replyText: "[Rate-limited: 1 automated reply per user per 24h]",
        dmSent: false
      });
      return updated || comment;
    }

    const textLower = text.toLowerCase();

    // 3. Toxicity & Custom Bad Words Moderation Rules (Creator Review Safeguard)
    const moderationRules = AutomationRepository.findRules(workspaceId).filter(
      r => r.isEnabled && r.type === "MODERATION"
    );
    const matchedModRule = moderationRules.find(rule =>
      rule.triggerKeyword.some(kw => textLower.includes(kw.toLowerCase()))
    );

    const hasToxicWords = TOXIC_WORDS.some(word => textLower.includes(word));
    if (hasToxicWords || matchedModRule) {
      const isSevere = textLower.includes("scam") || textLower.includes("fraud") || textLower.includes("abuse") || textLower.includes("insult");
      const moderationAction: "DELETED" | "HIDDEN" = isSevere ? "DELETED" : "HIDDEN";
      const toxicityScore = isSevere ? 92 : 78;
      const moderationExplanation = isSevere 
        ? "Comment contains severe allegations or toxic language flagged by AI moderation pipeline. Flagged for creator review."
        : "Comment contains potential negative sentiment or spam content flagged by AI moderation. Flagged for creator review.";

      console.log(`Flagging comment for creator review (${moderationAction}): "${text}"`);
      
      // Update comment as FLAGGED in database for creator review in Moderation dashboard
      const updated = CommentRepository.update(workspaceId, comment.id, {
        status: "FLAGGED",
        moderationAction,
        toxicityScore,
        moderationExplanation
      });
      return updated || comment;
    }

    // 4. Keyword comment automation reply/DM rules
    const rules = AutomationRepository.findRules(workspaceId).filter(
      r => r.isEnabled && r.type === "COMMENT"
    );

    const matchedRule = rules.find(rule =>
      rule.triggerKeyword.some(kw => textLower.includes(kw.toLowerCase()))
    );

    if (matchedRule) {
      let replyText = (matchedRule as any).replyCommentText || matchedRule.replyTemplate;
      let dmSent = false;

      if (matchedRule.actionType === "AI_REPLY") {
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

      // Enforce 150-char limit, profanity check, and URL sanitize on outgoing reply
      replyText = sanitizeOutgoingReply(replyText);

      // If DM was triggered, create a conversation and message in local Chat Inbox
      if (dmSent) {
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

        // Enforce outgoing content filtering on automated DM
        dmContent = sanitizeOutgoingReply(dmContent);

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
        TikTokService.sendDirectMessage(workspaceId, customerId, dmContent).catch(err =>
          console.error("Failed to send direct message via TikTok API:", err)
        );
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
