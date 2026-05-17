import { buildAffiliateLink, calculateFinalPrice } from "./affiliate";
import { sendDealAlert, shouldNotify } from "./notifications";
import { scrapeAllSources } from "./scrapers";
import { sourceConfigs } from "./sources";
import { readDB, updatePriceHistory, writeDB } from "./store";

function enrichDeal(deal) {
  const source = sourceConfigs.find((item) => item.id === deal.sourceId);
  const pricing = calculateFinalPrice({
    originalPrice: deal.originalPrice,
    discountAmount: deal.discountAmount,
    cashbackPercent: deal.cashbackPercent,
  });

  return {
    ...deal,
    ...pricing,
    affiliateUrl: buildAffiliateLink(source, deal),
  };
}

export async function syncDeals() {
  const db = await readDB();
  const scrapedDeals = await scrapeAllSources();
  const deals = scrapedDeals.map(enrichDeal);
  const alerts = [];

  for (const deal of deals) {
    db.history = updatePriceHistory(db.history || {}, deal);
    if (shouldNotify(deal)) {
      const status = await sendDealAlert(deal);
      alerts.push({ dealId: deal.id, ...status, timestamp: new Date().toISOString() });
    }
  }

  const updatedDB = {
    ...db,
    deals,
    alerts: [...(db.alerts || []), ...alerts].slice(-100),
    lastSyncAt: new Date().toISOString(),
  };

  await writeDB(updatedDB);
  return updatedDB;
}
