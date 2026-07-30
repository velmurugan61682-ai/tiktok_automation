export interface Comment {
  id: string;
  customerId: string;
  customerName: string;
  postType: string;
  postId: string;
  text: string;
  replyText?: string;
  dmSent: boolean;
  status: "PENDING" | "REPLIED" | "FLAGGED";
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  type: "COMMENT" | "DM";
  triggerKeyword: string[];
  replyTemplate: string;
  actionType: "AUTO_DM" | "AI_REPLY" | "STATIC_COMMENT";
  isEnabled: boolean;
  usageCount: number;
}

export interface KnowledgeBase {
  id: string;
  question: string;
  answer: string;
}
