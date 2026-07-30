import { getCollection, saveCollection } from "../lib/db.js";
import { Comment } from "../types.js";

export class CommentRepository {
  static find(workspaceId: string): Comment[] {
    return getCollection("comments").filter(c => c.workspaceId === workspaceId);
  }

  static create(comment: Omit<Comment, "id" | "createdAt">): Comment {
    const comments = getCollection("comments");
    const newId = `c-${comments.length + 1}`;
    const newComment: Comment = {
      ...comment,
      id: newId,
      createdAt: new Date().toISOString()
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
