import { initDb, getCollection } from "./lib/db.js";

async function main() {
  await initDb();
  console.log("=== Automation Rules in ws-11 ===");
  const rules = getCollection("automationRules").filter((r: any) => r.workspaceId === "ws-11");
  console.log(rules);
}

main().catch(console.error);
