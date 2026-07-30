import { getCollection, saveCollection } from "../lib/db.js";
import { Notification } from "../types.js";

export class NotificationRepository {
  static find(workspaceId?: string): Notification[] {
    const notifications = getCollection("notifications");
    if (!workspaceId) {
      // System level
      return notifications.filter(n => !n.workspaceId);
    }
    return notifications.filter(n => n.workspaceId === workspaceId);
  }

  static create(notification: Omit<Notification, "id" | "createdAt">): Notification {
    const notifications = getCollection("notifications");
    const newId = `not-${notifications.length + 1}`;
    const newNot: Notification = {
      ...notification,
      id: newId,
      createdAt: new Date().toISOString()
    };
    notifications.push(newNot);
    saveCollection("notifications", notifications);
    return newNot;
  }

  static markAllAsRead(workspaceId: string): void {
    const notifications = getCollection("notifications");
    const updated = notifications.map(n => {
      if (n.workspaceId === workspaceId) {
        return { ...n, read: true };
      }
      return n;
    });
    saveCollection("notifications", updated);
  }
}
