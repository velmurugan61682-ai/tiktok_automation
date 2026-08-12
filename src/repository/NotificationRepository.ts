import { getCollection, saveCollection } from "../lib/db.js";
import { Notification } from "../types.js";

export class NotificationRepository {
  static find(workspaceId?: string): Notification[] {
    const notifications = getCollection("notifications") || [];
    if (!workspaceId) {
      return notifications;
    }
    return notifications.filter(n => n.workspaceId === workspaceId || !n.workspaceId);
  }

  static create(notification: Omit<Notification, "id" | "createdAt">): Notification {
    const notifications = getCollection("notifications") || [];
    const newId = `not-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newNot: Notification = {
      ...notification,
      id: newId,
      createdAt: new Date().toISOString()
    };
    notifications.unshift(newNot);
    saveCollection("notifications", notifications);
    return newNot;
  }

  static markAllAsRead(workspaceId?: string): void {
    const notifications = getCollection("notifications") || [];
    const updated = notifications.map(n => {
      if (!workspaceId || n.workspaceId === workspaceId) {
        return { ...n, read: true };
      }
      return n;
    });
    saveCollection("notifications", updated);
  }

  static markOneAsRead(id: string): void {
    const notifications = getCollection("notifications") || [];
    const updated = notifications.map(n => {
      if (n.id === id) {
        return { ...n, read: true };
      }
      return n;
    });
    saveCollection("notifications", updated);
  }

  static delete(id: string): void {
    const notifications = getCollection("notifications") || [];
    const filtered = notifications.filter(n => n.id !== id);
    saveCollection("notifications", filtered);
  }
}
