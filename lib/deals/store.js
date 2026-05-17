import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "deals-db.json");

const emptyDB = {
  deals: [],
  history: {},
  lastSyncAt: null,
  alerts: [],
};

export async function readDB() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    await writeDB(emptyDB);
    return emptyDB;
  }
}

export async function writeDB(data) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

export function updatePriceHistory(history, deal) {
  const key = `${deal.sourceId}:${deal.id}`;
  const bucket = history[key] || [];

  bucket.push({
    price: deal.originalPrice,
    finalPrice: deal.finalPrice,
    timestamp: new Date().toISOString(),
  });

  history[key] = bucket.slice(-30);
  return history;
}
