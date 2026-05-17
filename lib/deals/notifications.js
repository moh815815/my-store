export async function sendDealAlert(deal, webhookUrl = process.env.DEALS_ALERT_WEBHOOK) {
  if (!webhookUrl) return { sent: false, reason: "missing_webhook" };

  const payload = {
    text: `🔥 صفقة قوية: ${deal.title} | خصم ${deal.discountPercent || 0}% | كاش باك ${deal.cashbackPercent || 0}% | السعر النهائي ${deal.finalPrice}`,
    deal,
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return {
    sent: response.ok,
    status: response.status,
  };
}

export function shouldNotify(deal) {
  return deal.type === "lifetime" || (deal.cashbackPercent || 0) >= 20 || deal.isFlashDeal;
}
