import { ConversationRepository } from "../repository/ConversationRepository.js";
import { WorkspaceRepository } from "../repository/WorkspaceRepository.js";
import { Conversation, Message } from "../types.js";
import { AIService } from "./AIService.js";

export class ChatService {
  static getConversations(workspaceId: string): Conversation[] {
    return ConversationRepository.find(workspaceId);
  }

  static getMessages(workspaceId: string, conversationId: string): Message[] {
    return ConversationRepository.getMessages(workspaceId, conversationId);
  }

  static toggleAI(workspaceId: string, conversationId: string, enabled: boolean): Conversation | undefined {
    return ConversationRepository.updateConversation(workspaceId, conversationId, {
      aiEnabled: enabled
    });
  }

  static async sendMessage(
    workspaceId: string,
    conversationId: string,
    senderId: string,
    senderName: string,
    text: string,
    isInternalNote: boolean = false
  ): Promise<Message> {
    // 1. Save the incoming message
    const msg = ConversationRepository.createMessage({
      workspaceId,
      conversationId,
      senderId,
      senderName,
      text,
      readStatus: false,
      isInternalNote
    });

    // 2. If it is from the customer AND AI is enabled on this conversation, trigger AI response
    if (senderId === "CUSTOMER" && !isInternalNote) {
      const conversation = ConversationRepository.findById(workspaceId, conversationId);
      if (conversation && conversation.aiEnabled) {
        // Trigger asynchronous-like response
        setTimeout(async () => {
          try {
            const workspace = WorkspaceRepository.findById(workspaceId);
            let replyText = "";
            if (workspace && workspace.aiTemplateEnabled && workspace.aiTemplateText) {
              replyText = workspace.aiTemplateText;
            } else {
              replyText = await AIService.generateReply(workspaceId, conversationId, text);
            }

            ConversationRepository.createMessage({
              workspaceId,
              conversationId,
              senderId: "AI",
              senderName: "AI Assistant",
              text: replyText,
              readStatus: false,
              isInternalNote: false
            });
          } catch (e) {
            console.error("Failed to generate async AI reply:", e);
          }
        }, 800); // Small realistic typing delay
      }
    }

    return msg;
  }

  static markAsRead(workspaceId: string, conversationId: string): void {
    ConversationRepository.updateConversation(workspaceId, conversationId, {
      unreadCount: 0
    });
  }
}
