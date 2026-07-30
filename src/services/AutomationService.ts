import { AutomationRepository } from "../repository/AutomationRepository.js";
import { AutomationRule, KnowledgeBase } from "../types.js";

export class AutomationService {
  // Rules
  static getRules(workspaceId: string): AutomationRule[] {
    return AutomationRepository.findRules(workspaceId);
  }

  static createRule(ruleData: Omit<AutomationRule, "id" | "createdAt" | "usageCount">): AutomationRule {
    return AutomationRepository.createRule(ruleData);
  }

  static updateRule(workspaceId: string, id: string, updates: Partial<AutomationRule>): AutomationRule | undefined {
    return AutomationRepository.updateRule(workspaceId, id, updates);
  }

  static deleteRule(workspaceId: string, id: string): boolean {
    return AutomationRepository.deleteRule(workspaceId, id);
  }

  // Knowledge Base
  static getKnowledgeBases(workspaceId: string): KnowledgeBase[] {
    return AutomationRepository.findKB(workspaceId);
  }

  static createKnowledgeBase(kbData: Omit<KnowledgeBase, "id" | "createdAt">): KnowledgeBase {
    return AutomationRepository.createKB(kbData);
  }

  static deleteKnowledgeBase(workspaceId: string, id: string): boolean {
    return AutomationRepository.deleteKB(workspaceId, id);
  }
}
