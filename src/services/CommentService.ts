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
    text: string,
    customCommentId?: string
  ): Promise<Comment> {
    // 1. Save comment in database first (CommentRepository.create performs deduplication check by comment id)
    const comment = CommentRepository.create({
      id: customCommentId,
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

    // 2. Atomic Idempotency Check & Status Lock
    if (comment.status !== "PENDING") {
      console.log(`[Idempotency Safeguard] Comment ${comment.id} already has status '${comment.status}'. Skipping duplicate execution.`);
      return comment;
    }

    // Acquire lock by marking status as PROCESSING
    CommentRepository.update(workspaceId, comment.id, { status: "PROCESSING" });
    comment.status = "PROCESSING";

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

    // 3. Toxicity & Custom Bad Words Moderation Rules (Creator Review & Active Removal)
    const moderationRules = AutomationRepository.findRules(workspaceId).filter(
      r => r.isEnabled && r.type === "MODERATION"
    );
    const matchedModRule = moderationRules.find(rule =>
      rule.triggerKeyword.some(kw => textLower.includes(kw.toLowerCase()))
    );

    const hasToxicWords = TOXIC_WORDS.some(word => textLower.includes(word));
    let aiToxicity = { isToxic: false, score: 0, action: "NONE" as "DELETED" | "HIDDEN" | "NONE", reason: "" };
    
    if (hasToxicWords || matchedModRule) {
      const isSevere = textLower.includes("scam") || textLower.includes("fraud") || textLower.includes("abuse") || textLower.includes("insult");
      aiToxicity = {
        isToxic: true,
        score: isSevere ? 95 : 78,
        action: isSevere ? "DELETED" : "HIDDEN",
        reason: isSevere ? "Severe scam/abuse violation" : "Spam/negative sentiment detected"
      };
    } else {
      // Evaluate semantic toxicity with Gemini AI
      try {
        aiToxicity = await AIService.evaluateToxicity(text);
      } catch (e) {
        // Safe fallback
      }
    }

    if (aiToxicity.isToxic) {
      const moderationAction: "DELETED" | "HIDDEN" = aiToxicity.action === "DELETED" ? "DELETED" : "HIDDEN";
      const toxicityScore = aiToxicity.score || 85;
      const moderationExplanation = `[AI Moderation] ${aiToxicity.reason}. Automatically executing ${moderationAction} on TikTok.`;

      console.log(`[TikTok Toxic Comment Protection] Action ${moderationAction} for comment "${text}" on post ${postId}`);
      
      // Update comment in database
      const updated = CommentRepository.update(workspaceId, comment.id, {
        status: "FLAGGED",
        moderationAction,
        toxicityScore,
        moderationExplanation
      });

      // Execute real-time deletion or hiding on TikTok API
      TikTokService.deleteOrHideComment(workspaceId, postId, comment.id, moderationAction).catch(err =>
        console.error(`Failed to execute ${moderationAction} on TikTok API:`, err)
      );

      return updated || comment;
    }

    // 4. Live Stream Comment Auto-Reply Support
    const isLiveStream = comment.postType === "LIVESTREAM" || comment.isLiveStream;
    if (isLiveStream) {
      const liveRules = AutomationRepository.findRules(workspaceId).filter(
        r => r.isEnabled && (r.type === "LIVESTREAM" || (r as any).isLiveStream)
      );
      const matchedLiveRule = liveRules.find(r =>
        r.triggerKeyword.some(kw => textLower.includes(kw.toLowerCase()))
      );

      let liveReply = "";
      if (matchedLiveRule) {
        liveReply = matchedLiveRule.replyTemplate || (matchedLiveRule as any).replyCommentText || "";
      } else {
        // AI Live Stream Co-host Reply
        liveReply = await AIService.generateLiveStreamCommentReply(workspaceId, text);
      }

      liveReply = sanitizeOutgoingReply(liveReply);
      console.log(`[TikTok LIVE Reply] Responding to viewer ${customerName}: "${liveReply}"`);

      // Post live reply to TikTok comment
      TikTokService.replyToComment(workspaceId, postId, comment.id, liveReply).catch(err =>
        console.error("Failed to post TikTok live stream comment reply:", err)
      );

      const updated = CommentRepository.update(workspaceId, comment.id, {
        replyText: liveReply,
        status: "REPLIED",
        isLiveStream: true
      });
      return updated || comment;
    }

    // 5. Keyword comment automation reply/DM rules
    const rules = AutomationRepository.findRules(workspaceId).filter(
      r => r.isEnabled && (r.type === "COMMENT" || r.type === "STORY")
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

      // Post reply to TikTok comment on the video
      if (replyText) {
        const posted = await TikTokService.replyToComment(workspaceId, postId, comment.id, replyText);
        if (!posted) {
          console.warn(`[TikTok API Notice] Outgoing reply recorded locally, but TikTok API returned 404/error. Real automated comment replies require TikTok Business / Commercial Content API approval.`);
        }
      }

      // If DM was triggered, create a conversation and message in local Chat Inbox and send via TikTok API
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

    // 6. Default fallback for non-toxic comments without keyword rule triggers
    const updated = CommentRepository.update(workspaceId, comment.id, {
      status: "PROCESSED"
    });

    return updated || comment;
  }
}
