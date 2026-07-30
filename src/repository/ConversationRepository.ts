import { getCollection, saveCollection } from "../lib/db.js";
import { Conversation, Message } from "../types.js";

export class ConversationRepository {
  static find(workspaceId: string): Conversation[] {
    return getCollection("conversations").filter(c => c.workspaceId === workspaceId);
  }

  static findById(workspaceId: string, id: string): Conversation | undefined {
    return getCollection("conversations").find(c => c.workspaceId === workspaceId && c.id === id);
  }

  static getMessages(workspaceId: string, conversationId: string): Message[] {
    return getCollection("messages").filter(m => m.workspaceId === workspaceId && m.conversationId === conversationId);
  }

  static createConversation(conversation: Omit<Conversation, "id" | "lastMessageAt">): Conversation {
    const conversations = getCollection("conversations");
    const newId = `conv-${conversations.length + 1}`;
    const newConv: Conversation = {
      ...conversation,
      id: newId,
      lastMessageAt: new Date().toISOString()
    };
    conversations.push(newConv);
    saveCollection("conversations", conversations);
    return newConv;
  }

  static updateConversation(workspaceId: string, id: string, updates: Partial<Conversation>): Conversation | undefined {
    const conversations = getCollection("conversations");
    const index = conversations.findIndex(c => c.workspaceId === workspaceId && c.id === id);
    if (index === -1) return undefined;

    const updated = { ...conversations[index], ...updates };
    conversations[index] = updated;
    saveCollection("conversations", conversations);
    return updated;
  }

  static createMessage(message: Omit<Message, "id" | "createdAt">): Message {
    const messages = getCollection("messages");
    const newId = `m-${messages.length + 1}`;
    const newMsg: Message = {
      ...message,
      id: newId,
      createdAt: new Date().toISOString()
    };
    messages.push(newMsg);
    saveCollection("messages", messages);

    // Update conversation lastMessageAt and unread status if message is from customer
    this.updateConversation(message.workspaceId, message.conversationId, {
      lastMessageAt: newMsg.createdAt,
      unreadCount: message.senderId === "CUSTOMER" ? undefined : 0 // reset or keep as is
    });

    return newMsg;
  }
}
