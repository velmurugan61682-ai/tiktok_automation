import { initDb, getCollection } from "./lib/db.js";

async function main() {
  await initDb();
  console.log("=== All Comments for ws-11 ===");
  const comments = getCollection("comments").filter((c: any) => c.workspaceId === "ws-11");
  console.log(comments.map((c: any) => ({ id: c.id, status: c.status, text: c.text })));
}

main().catch(console.error);
