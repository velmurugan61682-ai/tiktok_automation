import fs from "fs";
import path from "path";
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
  Analytics
} from "../types.js";

const DB_DIR = path.join(process.cwd(), "data");
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
}

// Global in-memory cache
let dbCache: DatabaseSchema | null = null;

const MONGO_URL = process.env.MONGODB_URI;
let mongoClient: MongoClient | null = null;
let mongoDbConnected = false;

function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

async function connectMongo() {
  if (!MONGO_URL) return null;
  try {
    mongoClient = new MongoClient(MONGO_URL);
    await mongoClient.connect();
    mongoDbConnected = true;
    console.log("Connected successfully to MongoDB");
    return mongoClient.db();
  } catch (err) {
    console.error("Failed to connect to MongoDB, falling back to local JSON database", err);
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
    analytics: []
  };
}

async function saveDbToMongo(data: DatabaseSchema): Promise<void> {
  if (!mongoClient || !mongoDbConnected) return;
  try {
    const db = mongoClient.db();
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
  ensureDbDir();

  if (MONGO_URL) {
    try {
      const db = await connectMongo();
      if (db) {
        const dbCollections = [
          "users", "workspaces", "connectedAccounts", "categories", "products",
          "warehouses", "inventoryLogs", "customers", "conversations", "messages",
          "orders", "automationRules", "knowledgeBases", "comments", "notifications",
          "analytics"
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

        dbCache = loadedData as DatabaseSchema;
        console.log("Database initialized from MongoDB successfully");
        return;
      }
    } catch (err) {
      console.error("Failed to initialize database from MongoDB, falling back to local JSON", err);
    }
  }

  // Fallback to local db.json
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      dbCache = JSON.parse(data);
      console.log("Database initialized from local JSON file");
      return;
    } catch (e) {
      console.error("Failed to parse db.json, generating initial database", e);
    }
  }

  dbCache = getInitialDb();
  saveDb(dbCache);
  console.log("Database initialized with empty/default data");
}

export function getDb(): DatabaseSchema {
  ensureDbDir();
  if (dbCache) {
    return dbCache;
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      dbCache = JSON.parse(data);
      return dbCache!;
    } catch (e) {
      console.error("Failed to parse db.json, generating initial database", e);
    }
  }

  dbCache = getInitialDb();
  return dbCache;
}

export function saveDb(data: DatabaseSchema): void {
  ensureDbDir();
  dbCache = data;

  // Save synchronously to local JSON file as backup/fallback
  const tempFile = `${DB_FILE}.tmp`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (e) {
    console.error("Failed to write db.json", e);
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
