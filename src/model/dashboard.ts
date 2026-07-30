export interface DashboardActivity {
  title: string;
  message: string;
  time: string;
  type: string;
}

export interface DashboardMetrics {
  revenue: number;
  ordersCount: number;
  customersCount: number;
  productsCount: number;
  lowStockCount: number;
  messagesCount: number;
  aiResponsesCount: number;
  commentsCount: number;
  recentOrders: any[];
  activityTimeline: DashboardActivity[];
}

export interface DashboardAnalytics {
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
