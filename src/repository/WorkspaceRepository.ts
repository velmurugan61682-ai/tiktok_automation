import { getCollection, saveCollection } from "../lib/db.js";
import { Workspace } from "../types.js";

export class WorkspaceRepository {
  static find(): Workspace[] {
    return getCollection("workspaces");
  }

  static findById(id: string): Workspace | undefined {
    return getCollection("workspaces").find(w => w.id === id);
  }

  static create(workspace: Omit<Workspace, "id" | "createdAt">): Workspace {
    const workspaces = getCollection("workspaces");
    const newId = `ws-${workspaces.length + 1}`;
    const newWorkspace: Workspace = {
      ...workspace,
      id: newId,
      createdAt: new Date().toISOString().split("T")[0]
    };
    workspaces.push(newWorkspace);
    saveCollection("workspaces", workspaces);
    return newWorkspace;
  }

  static update(id: string, updates: Partial<Workspace>): Workspace | undefined {
    const workspaces = getCollection("workspaces");
    const index = workspaces.findIndex(w => w.id === id);
    if (index === -1) return undefined;

    const updatedWorkspace = { ...workspaces[index], ...updates };
    workspaces[index] = updatedWorkspace;
    saveCollection("workspaces", workspaces);
    return updatedWorkspace;
  }

  static delete(id: string): boolean {
    const workspaces = getCollection("workspaces");
    const initialLen = workspaces.length;
    const filtered = workspaces.filter(w => w.id !== id);
    if (filtered.length === initialLen) return false;
    saveCollection("workspaces", filtered);
    return true;
  }
}
