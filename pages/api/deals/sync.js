import { syncDeals } from "../../../lib/deals/engine";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const result = await syncDeals();
  return res.status(200).json({
    ok: true,
    totalDeals: result.deals.length,
    lastSyncAt: result.lastSyncAt,
    totalAlerts: result.alerts.length,
  });
}
