import { getCollection, saveCollection } from "../lib/db.js";
import { AutomationRule, KnowledgeBase } from "../types.js";

export class AutomationRepository {
  // --- Automation Rules ---
  static findRules(workspaceId: string): AutomationRule[] {
    return getCollection("automationRules").filter(r => r.workspaceId === workspaceId);
  }

  static createRule(rule: Omit<AutomationRule, "id" | "createdAt" | "usageCount">): AutomationRule {
    const rules = getCollection("automationRules");
    
    // Deduplication check: check if an identical rule already exists for this workspace
    const existingIndex = rules.findIndex(r =>
      r.workspaceId === rule.workspaceId &&
      r.type === rule.type &&
      (rule.postId ? r.postId === rule.postId : true) &&
      rule.triggerKeyword.some(kw => r.triggerKeyword.map(k => k.toLowerCase()).includes(kw.toLowerCase()))
    );

    if (existingIndex !== -1) {
      console.warn(`[DEDUPLICATION WARNING] Duplicate automation rule detected for keyword(s) "${rule.triggerKeyword.join(", ")}" in workspace ${rule.workspaceId}. Updating existing rule (${rules[existingIndex].id}).`);
      const updated = {
        ...rules[existingIndex],
        ...rule,
        isEnabled: true
      };
      rules[existingIndex] = updated;
      saveCollection("automationRules", rules);
      return updated;
    }

    const newId = `rule-${rules.length + 1}`;
    const newRule: AutomationRule = {
      ...rule,
      id: newId,
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0]
    };
    rules.push(newRule);
    saveCollection("automationRules", rules);
    return newRule;
  }

  static updateRule(workspaceId: string, id: string, updates: Partial<AutomationRule>): AutomationRule | undefined {
    const rules = getCollection("automationRules");
    const index = rules.findIndex(r => r.workspaceId === workspaceId && r.id === id);
    if (index === -1) return undefined;

    const updated = { ...rules[index], ...updates };
    rules[index] = updated;
    saveCollection("automationRules", rules);
    return updated;
  }

  static deleteRule(workspaceId: string, id: string): boolean {
    const rules = getCollection("automationRules");
    const initialLen = rules.length;
    const filtered = rules.filter(r => !(r.workspaceId === workspaceId && r.id === id));
    if (filtered.length === initialLen) return false;
    saveCollection("automationRules", filtered);
    return true;
  }

  // --- Knowledge Base ---
  static findKB(workspaceId: string): KnowledgeBase[] {
    return getCollection("knowledgeBases").filter(k => k.workspaceId === workspaceId);
  }

  static createKB(kb: Omit<KnowledgeBase, "id" | "createdAt">): KnowledgeBase {
    const kbs = getCollection("knowledgeBases");
    const newId = `kb-${kbs.length + 1}`;
    const newKB: KnowledgeBase = {
      ...kb,
      id: newId,
      createdAt: new Date().toISOString()
    };
    kbs.push(newKB);
    saveCollection("knowledgeBases", kbs);
    return newKB;
  }

  static deleteKB(workspaceId: string, id: string): boolean {
    const kbs = getCollection("knowledgeBases");
    const initialLen = kbs.length;
    const filtered = kbs.filter(k => !(k.workspaceId === workspaceId && k.id === id));
    if (filtered.length === initialLen) return false;
    saveCollection("knowledgeBases", filtered);
    return true;
  }
}
