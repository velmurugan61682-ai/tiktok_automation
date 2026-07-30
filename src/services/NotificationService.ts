import { NotificationRepository } from "../repository/NotificationRepository.js";
import { Notification } from "../types.js";

export class NotificationService {
  static getNotifications(workspaceId?: string): Notification[] {
    return NotificationRepository.find(workspaceId);
  }

  static createNotification(workspaceId: string | undefined, title: string, message: string, type: Notification["type"]): Notification {
    return NotificationRepository.create({
      workspaceId,
      title,
      message,
      read: false,
      type
    });
  }

  static markAllAsRead(workspaceId: string): void {
    NotificationRepository.markAllAsRead(workspaceId);
  }
}
