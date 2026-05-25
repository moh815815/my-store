import { readDB } from "../../../lib/deals/store";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = await readDB();
  const grouped = {
    lifetime: db.deals.filter((deal) => deal.type === "lifetime"),
    cashback: db.deals.filter((deal) => deal.type === "cashback"),
    directDiscount: db.deals.filter((deal) => deal.type === "direct-discount"),
  };

  return res.status(200).json({
    lastSyncAt: db.lastSyncAt,
    totalDeals: db.deals.length,
    grouped,
    alerts: db.alerts.slice(-20),
    history: db.history,
  });
}
