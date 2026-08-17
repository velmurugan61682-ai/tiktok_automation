import app, { ensureDbAndSeed } from "../server.js";

let isDbInitialized = false;

export default async function handler(req: any, res: any) {
  if (!isDbInitialized) {
    try {
      await ensureDbAndSeed();
      isDbInitialized = true;
    } catch (e) {
      console.error("Failed to initialize database on Vercel function invoke:", e);
    }
  }
  return app(req, res);
}
