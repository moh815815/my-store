export function buildAffiliateLink(source, deal) {
  if (!source?.affiliateTemplate) return deal.url;

  return source.affiliateTemplate
    .replace("{url}", encodeURIComponent(deal.url || ""))
    .replace("{merchant}", encodeURIComponent(deal.merchant || deal.title || ""));
}

export function calculateFinalPrice({ originalPrice = 0, discountAmount = 0, cashbackPercent = 0 }) {
  const priceAfterDiscount = Math.max(originalPrice - discountAmount, 0);
  const cashbackAmount = Number(((priceAfterDiscount * cashbackPercent) / 100).toFixed(2));
  const finalPrice = Number(Math.max(priceAfterDiscount - cashbackAmount, 0).toFixed(2));

  return {
    originalPrice,
    discountAmount,
    cashbackPercent,
    cashbackAmount,
    finalPrice,
  };
}
