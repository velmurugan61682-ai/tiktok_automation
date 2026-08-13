import { OrderRepository } from "../repository/OrderRepository.js";
import { ProductRepository } from "../repository/ProductRepository.js";
import { ConversationRepository } from "../repository/ConversationRepository.js";
import { CommentRepository } from "../repository/CommentRepository.js";
import { getCollection } from "../lib/db.js";
import { Analytics } from "../types.js";
import { TikTokService } from "./TikTokService.js";

export class DashboardService {
  static async getMetrics(workspaceId: string) {
    // Sync statistics dynamically before returning metrics
    await TikTokService.syncProfile(workspaceId);

    const orders = OrderRepository.find(workspaceId);
    const products = ProductRepository.find(workspaceId);
    const conversations = ConversationRepository.find(workspaceId);
    const comments = CommentRepository.find(workspaceId);

    // Calculations
    const completedOrders = orders.filter(o => o && o.status !== "CANCELLED");
    const uniqueOrdersMap = new Map();
    for (const o of completedOrders) {
      if (o && o.id && !uniqueOrdersMap.has(o.id)) {
        uniqueOrdersMap.set(o.id, o);
      }
    }
    const uniqueCompletedOrders = Array.from(uniqueOrdersMap.values());
    const totalRevenue = uniqueCompletedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const lowStockCount = products.filter(p => p.stock < 50).length;

    // AI messages count
    const allMessages = conversations.flatMap(c => ConversationRepository.getMessages(workspaceId, c.id));
    const aiResponsesCount = allMessages.filter(m => m.senderId === "AI").length;

    // Load TikTok stats dynamically if a TikTok account is connected
    const accounts = getCollection("connectedAccounts").filter(ca => ca.workspaceId === workspaceId && ca.platform === "TIKTOK" && ca.status === "CONNECTED");
    const activeTiktok = accounts[0];
    
    let followersCount = 0;
    let followingCount = 0;
    let productsCount = products.length; // fallback is local products count

    if (activeTiktok) {
      followersCount = activeTiktok.followerCount || 0;
      followingCount = activeTiktok.followingCount || 0;
      productsCount = activeTiktok.videoCount || 0;
    }

    const rawTimeline = [
      { title: "System Ready", message: "TikTok Shop webhook channel is live and healthy.", time: "10 mins ago", type: "system" },
      ...orders.slice(-2).map(o => ({
        title: "New Order Placed",
        message: `Order ${o.id} created for Rs. ${o.totalAmount}`,
        time: "Just now",
        type: "order"
      })),
      ...comments.slice(-1).map(c => ({
        title: "New Comment Received",
        message: `${c.customerName}: "${c.text}"`,
        time: "30 mins ago",
        type: "comment"
      }))
    ];

    const seenTimeline = new Set();
    const activityTimeline = rawTimeline.filter(item => {
      const key = `${item.title}:${item.message}`;
      if (seenTimeline.has(key)) return false;
      seenTimeline.add(key);
      return true;
    });

    return {
      revenue: totalRevenue,
      ordersCount: orders.length,
      customersCount: Array.from(new Set(orders.map(o => o.customerId).filter(Boolean))).length,
      productsCount,
      followersCount,
      followingCount,
      lowStockCount,
      messagesCount: allMessages.length,
      aiResponsesCount,
      commentsCount: comments.length,
      recentOrders: orders.slice(-5).reverse(),
      activityTimeline
    };
  }
}

export class AnalyticsService {
  static getHistory(workspaceId: string): Analytics[] {
    return OrderRepository.getAnalytics(workspaceId);
  }
}
