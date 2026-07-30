import { getCollection, saveCollection } from "../lib/db.js";
import { User } from "../types.js";

export class UserRepository {
  static find(): User[] {
    return getCollection("users");
  }

  static findById(id: string): User | undefined {
    return getCollection("users").find(u => u.id === id);
  }

  static findByEmail(email: string): User | undefined {
    return getCollection("users").find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  static findByWorkspaceId(workspaceId: string): User[] {
    return getCollection("users").filter(u => u.workspaceId === workspaceId);
  }

  static create(user: Omit<User, "id" | "createdAt">): User {
    const users = getCollection("users");
    const newId = `u-${users.length + 1}`;
    const newUser: User = {
      ...user,
      id: newId,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveCollection("users", users);
    return newUser;
  }

  static update(id: string, updates: Partial<User>): User | undefined {
    const users = getCollection("users");
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return undefined;

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    saveCollection("users", users);
    return updatedUser;
  }

  static delete(id: string): boolean {
    const users = getCollection("users");
    const initialLen = users.length;
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === initialLen) return false;
    saveCollection("users", filtered);
    return true;
  }
}
