import fs from "fs";
import path from "path";
import os from "os";
import { MongoClient } from "mongodb";
import {
  User,
  Workspace,
  ConnectedAccount,
  Category,
  Product,
  Warehouse,
  InventoryLog,
  Customer,
  Conversation,
  Message,
  Order,
  AutomationRule,
  KnowledgeBase,
  Comment,
  Notification,
  Analytics,
  LiveStreamPlan
} from "../types.js";

export interface OAuthState {
  state: string;
  workspaceId: string;
  createdAt: string;
}

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DB_DIR = isServerless ? path.join(os.tmpdir(), "data") : path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

export interface DatabaseSchema {
  users: User[];
  workspaces: Workspace[];
  connectedAccounts: ConnectedAccount[];
  categories: Category[];
  products: Product[];
  warehouses: Warehouse[];
  inventoryLogs: InventoryLog[];
  customers: Customer[];
  conversations: Conversation[];
  messages: Message[];
  orders: Order[];
  automationRules: AutomationRule[];
  knowledgeBases: KnowledgeBase[];
  comments: Comment[];
  notifications: Notification[];
  analytics: Analytics[];
  livestream_plans: LiveStreamPlan[];
  oauth_states: OAuthState[];
}

// Global in-memory cache
let dbCache: DatabaseSchema | null = null;

const MONGO_URL = process.env.MONGODB_URI;
let mongoClient: MongoClient | null = null;
let mongoDbConnected = false;

function ensureDbDir() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  } catch (e) {
    console.warn("Could not create DB directory (expected in read-only environment):", (e as any)?.message || e);
  }
}

async function connectMongo() {
  if (!MONGO_URL) return null;
  try {
    mongoClient = new MongoClient(MONGO_URL, {
      connectTimeoutMS: 2000,
      serverSelectionTimeoutMS: 2000
    });
    await mongoClient.connect();
    mongoDbConnected = true;
    console.log("Connected successfully to MongoDB");
    return mongoClient.db("creatorflow_ai");
  } catch (err) {
    console.error("Failed to connect to MongoDB, falling back to local database", err);
    return null;
  }
}

function getInitialDb(): DatabaseSchema {
  return {
    users: [],
    workspaces: [],
    connectedAccounts: [],
    categories: [],
    products: [],
    warehouses: [],
    inventoryLogs: [],
    customers: [],
    conversations: [],
    messages: [],
    orders: [],
    automationRules: [],
    knowledgeBases: [],
    comments: [],
    notifications: [],
    analytics: [],
    livestream_plans: [],
    oauth_states: []
  };
}

async function saveDbToMongo(data: DatabaseSchema): Promise<void> {
  if (!mongoClient || !mongoDbConnected) return;
  try {
    const db = mongoClient.db("creatorflow_ai");
    for (const key of Object.keys(data)) {
      const collectionName = key;
      const items = (data as any)[key];
      if (Array.isArray(items)) {
        const col = db.collection(collectionName);
        await col.deleteMany({});
        if (items.length > 0) {
          const cleanItems = items.map(item => ({ ...item }));
          await col.insertMany(cleanItems);
        }
      }
    }
  } catch (err) {
    console.error("Failed to save database to MongoDB", err);
  }
}

export async function initDb(): Promise<void> {
  try {
    ensureDbDir();
  } catch (e) {
    // non-fatal
  }

  if (MONGO_URL) {
    try {
      const db = await connectMongo();
      if (db) {
        const dbCollections = [
          "users", "workspaces", "connectedAccounts", "categories", "products",
          "warehouses", "inventoryLogs", "customers", "conversations", "messages",
          "orders", "automationRules", "knowledgeBases", "comments", "notifications",
          "analytics", "livestream_plans", "oauth_states"
        ];

        const loadedData: any = {};
        for (const colName of dbCollections) {
          const col = db.collection(colName);
          const docs = await col.find({}).toArray();
          loadedData[colName] = docs.map(doc => {
            const { _id, ...rest } = doc;
            return rest;
          });
        }

        if (loadedData.users && loadedData.users.length > 0) {
          dbCache = loadedData as DatabaseSchema;
          console.log("Database initialized from MongoDB successfully");
          return;
        } else {
          console.log("MongoDB is empty. Seeding initial data into MongoDB...");
        }
      }
    } catch (err) {
      console.error("Failed to initialize database from MongoDB, falling back to local database", err);
    }
  }

  // Fallback to local db.json
  try {
    if (fs.existsSync(DB_FILE)) {
      try {
        const data = fs.readFileSync(DB_FILE, "utf-8");
        dbCache = JSON.parse(data);
        console.log("Database initialized from local JSON file");
        if (mongoDbConnected && dbCache) {
          saveDbToMongo(dbCache).catch(err => {
            console.error("Failed to seed MongoDB with initial data", err);
          });
        }
        return;
      } catch (e) {
        console.error("Failed to parse db.json, generating initial database", e);
      }
    }
  } catch (err) {
    console.warn("Local DB file read unavailable:", (err as any)?.message || err);
  }

  dbCache = getInitialDb();
  saveDb(dbCache);
  console.log("Database initialized with default data");
}

export function getDb(): DatabaseSchema {
  try {
    ensureDbDir();
  } catch (e) {
    // ignore
  }

  if (dbCache) {
    return dbCache;
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      try {
        const data = fs.readFileSync(DB_FILE, "utf-8");
        dbCache = JSON.parse(data);
        return dbCache!;
      } catch (e) {
        console.error("Failed to parse db.json, generating initial database", e);
      }
    }
  } catch (e) {
    // ignore
  }

  dbCache = getInitialDb();
  return dbCache;
}

export function saveDb(data: DatabaseSchema): void {
  dbCache = data;

  // Save synchronously to local JSON file as backup/fallback
  try {
    ensureDbDir();
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (e) {
    console.warn("Could not write local db.json fallback file (expected in read-only serverless environment):", (e as any)?.message || e);
  }

  // Save asynchronously to MongoDB
  if (mongoDbConnected) {
    saveDbToMongo(data).catch(err => {
      console.error("Failed to save to MongoDB in background", err);
    });
  }
}

// Mimic a generic repository query helper
export function getCollection<K extends keyof DatabaseSchema>(collection: K): DatabaseSchema[K] {
  const db = getDb();
  return db[collection];
}

export function saveCollection<K extends keyof DatabaseSchema>(collection: K, items: DatabaseSchema[K]): void {
  const db = getDb();
  (db[collection] as any) = items;
  saveDb(db);
}
