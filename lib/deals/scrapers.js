import { DEAL_TYPES, sourceConfigs } from "./sources";

function collectMatches(text, regex, limit = 10) {
  if (!regex) return [];
  const r = new RegExp(regex.source, regex.flags);
  const values = [];
  let match;

  while ((match = r.exec(text)) !== null && values.length < limit) {
    values.push(match[1]);
  }

  return values;
}

function normalizeDeal(source, index, name, price, image, extra = {}) {
  const originalPrice = Number(price || 0);
  const discountAmount = Number(extra.discountAmount || originalPrice * 0.25);
  const discountPercent = originalPrice > 0 ? Number(((discountAmount / originalPrice) * 100).toFixed(1)) : 0;

  return {
    id: `${source.id}-${index}`,
    sourceId: source.id,
    sourceName: source.name,
    type: source.type,
    title: name || `${source.name} Deal ${index + 1}`,
    url: source.url,
    image: image || "",
    merchant: source.name,
    originalPrice,
    discountAmount,
    discountPercent,
    cashbackPercent: Number(extra.cashbackPercent || 0),
    isFlashDeal: Boolean(extra.isFlashDeal),
    detectedAt: new Date().toISOString(),
  };
}

async function scrapeCatalogSource(source) {
  const html = await fetch(source.url).then((r) => r.text());
  const names = collectMatches(html, source.parserHints.productRegex);
  const prices = collectMatches(html, source.parserHints.priceRegex);
  const images = collectMatches(html, source.parserHints.imageRegex);

  return names.slice(0, 8).map((name, index) => {
    const isFlashDeal = /limited|ends soon|flash/i.test(name);
    return normalizeDeal(source, index, name, prices[index], images[index], { isFlashDeal });
  });
}

async function scrapeCashbackSource(source) {
  const html = await fetch(source.url).then((r) => r.text());
  const cashbackRates = collectMatches(html, source.parserHints.cashbackRegex, 8);

  return cashbackRates.map((rate, index) => {
    const cashbackPercent = Number(rate);
    const originalPrice = 100 + index * 15;
    return normalizeDeal(source, index, `Top Cashback Offer ${index + 1}`, originalPrice, "", {
      cashbackPercent,
      discountAmount: 10,
      isFlashDeal: cashbackPercent >= 25,
    });
  });
}

export async function scrapeAllSources() {
  const collectedDeals = [];

  for (const source of sourceConfigs) {
    try {
      const sourceDeals =
        source.type === DEAL_TYPES.CASHBACK
          ? await scrapeCashbackSource(source)
          : await scrapeCatalogSource(source);

      collectedDeals.push(...sourceDeals);
    } catch {
      // Keep sync robust even when one source fails.
    }
  }

  return collectedDeals;
}
