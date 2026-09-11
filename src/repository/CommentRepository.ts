import { getCollection, saveCollection } from "../lib/db.js";
import { Comment } from "../types.js";

export class CommentRepository {
  static find(workspaceId: string): Comment[] {
    return getCollection("comments").filter(c => c.workspaceId === workspaceId);
  }

  static create(comment: Partial<Comment> & {
    workspaceId: string;
    customerId: string;
    customerName: string;
    postType: Comment["postType"];
    postId: string;
    text: string;
  }): Comment {
    const comments = getCollection("comments");

    // Deduplication check: check by comment id or identical customer+post+text
    const existing = comments.find(c =>
      (comment.id && c.id === comment.id) ||
      (c.workspaceId === comment.workspaceId &&
       c.postId === comment.postId &&
       c.customerId === comment.customerId &&
       c.text.trim().toLowerCase() === comment.text.trim().toLowerCase())
    );

    if (existing) {
      console.warn(`[DEDUPLICATION] Existing comment detected (${existing.id}). Skipping re-creation.`);
      return existing;
    }

    const newId = comment.id || `c-${comments.length + 1}`;
    const newComment: Comment = {
      status: "PENDING",
      ...comment,
      id: newId,
      createdAt: comment.createdAt || new Date().toISOString()
    };
    comments.push(newComment);
    saveCollection("comments", comments);
    return newComment;
  }

  static update(workspaceId: string, id: string, updates: Partial<Comment>): Comment | undefined {
    const comments = getCollection("comments");
    const index = comments.findIndex(c => c.workspaceId === workspaceId && c.id === id);
    if (index === -1) return undefined;

    const updated = { ...comments[index], ...updates };
    comments[index] = updated;
    saveCollection("comments", comments);
    return updated;
  }
}
