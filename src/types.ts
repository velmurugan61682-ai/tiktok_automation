/**
 * TypeScript Interfaces for multi-tenant enterprise SaaS
 */

export type UserRole = "SUPER_ADMIN" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  workspaceId?: string; // Optional for Super Admins
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  phone?: string;
  shopName: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  plan: "TRIAL" | "PRO";
  endDate: string;
  smsCount: number;
  razorpaySubscriptionId?: string;
  razorpaySubscriptionStatus?: string;
  razorpayPaymentId?: string;
  aiTemplateEnabled?: boolean;
  aiTemplateText?: string;
  createdAt: string;
}

export interface ConnectedAccount {
  id: string;
  workspaceId: string;
  platform: "TIKTOK" | "INSTAGRAM" | "FACEBOOK";
  username: string;
  status: "CONNECTED" | "DISCONNECTED";
  expiresAt?: string;
  accessToken?: string;
  refreshToken?: string;
  connectedAt?: string;
  followerCount?: number;
  followingCount?: number;
  likesCount?: number;
  display_name?: string;
  avatar_url?: string;
  open_id?: string;
  union_id?: string;
  videoCount?: number;
}

export interface Category {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  slug: string;
}

export interface Variant {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  workspaceId: string;
  name: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  description: string;
  images: string[];
  price: number;
  tax: number;
  stock: number;
  warehouseId?: string;
  variants: Variant[];
  status: "ACTIVE" | "DRAFT";
  createdAt: string;
}

export interface Warehouse {
  id: string;
  workspaceId: string;
  name: string;
  location?: string;
}

export interface InventoryLog {
  id: string;
  workspaceId: string;
  productId: string;
  variantId?: string;
  warehouseId: string;
  quantityChanged: number;
  type: "INCOMING" | "OUTGOING" | "ADJUSTMENT" | "TRANSFER";
  notes?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  workspaceId: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  tags: string[];
  notes?: string;
  lifetimeValue: number;
  createdAt: string;
}

export interface Conversation {
  id: string;
  workspaceId: string;
  customerId: string;
  status: "OPEN" | "CLOSED";
  aiEnabled: boolean;
  channel: "TIKTOK" | "WHATSAPP" | "INSTAGRAM";
  lastMessageAt: string;
  unreadCount: number;
  typingState?: boolean;
}

export interface Message {
  id: string;
  workspaceId: string;
  conversationId: string;
  senderId: string; // "CUSTOMER", "AI", or User ID (Agent)
  senderName: string;
  text: string;
  attachments?: string[];
  readStatus: boolean;
  isInternalNote: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  workspaceId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  paymentMethod: string;
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  workspaceId: string;
  name: string;
  type: "COMMENT" | "STORY" | "MODERATION";
  triggerKeyword: string[]; // List of keywords
  actionType: "AUTO_REPLY" | "AUTO_DM" | "AI_REPLY";
  replyTemplate: string;
  replyCommentText?: string;
  postId?: string;
  isEnabled: boolean;
  usageCount: number;
  createdAt: string;
}

export interface KnowledgeBase {
  id: string;
  workspaceId: string;
  question: string;
  answer: string;
  category?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  workspaceId: string;
  customerId: string;
  customerName: string;
  postType: "POST" | "STORY" | "TIKTOK";
  postId: string;
  text: string;
  replyText?: string;
  dmSent?: boolean;
  status: "PENDING" | "REPLIED" | "FLAGGED";
  createdAt: string;
}

export interface Notification {
  id: string;
  workspaceId?: string; // Optional if System level
  title: string;
  message: string;
  read: boolean;
  type: "INFO" | "WARNING" | "CRITICAL";
  createdAt: string;
}

export interface Analytics {
  id: string;
  workspaceId: string;
  date: string; // YYYY-MM-DD
  revenue: number;
  ordersCount: number;
  conversionRate: number;
  messagesCount: number;
  aiResponsesCount: number;
  automationCount: number;
}
