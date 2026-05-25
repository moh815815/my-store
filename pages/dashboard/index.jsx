import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

function DealCard({ deal }) {
  const copyAffiliateLink = async () => {
    await navigator.clipboard.writeText(deal.affiliateUrl);
    alert("✅ تم نسخ رابط العمولة");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
      <h3 className="font-bold text-lg mb-2">{deal.title}</h3>
      <p className="text-sm text-gray-500 mb-3">{deal.sourceName}</p>
      <div className="space-y-1 text-sm">
        <p>السعر الأصلي: {deal.originalPrice}$</p>
        <p>الخصم: {deal.discountAmount}$ ({deal.discountPercent}%)</p>
        <p>الكاش باك: {deal.cashbackPercent}% ({deal.cashbackAmount}$)</p>
        <p className="font-bold text-green-700">السعر النهائي: {deal.finalPrice}$</p>
      </div>
      <div className="mt-4 flex gap-2">
        <a
          href={deal.url}
          target="_blank"
          rel="noreferrer"
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          فتح العرض
        </a>
        <button onClick={copyAffiliateLink} className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
          نسخ رابط العمولة
        </button>
      </div>
      {deal.isFlashDeal ? <p className="mt-2 text-xs text-red-600">⚡ Flash Deal</p> : null}
    </div>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState({ grouped: { lifetime: [], cashback: [], directDiscount: [] }, lastSyncAt: null });
  const [loading, setLoading] = useState(false);

  const totalDeals = useMemo(() => {
    return Object.values(data.grouped || {}).reduce((sum, list) => sum + list.length, 0);
  }, [data.grouped]);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/deals");
      const json = await response.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  const syncDeals = async () => {
    setLoading(true);
    try {
      await fetch("/api/deals/sync", { method: "POST" });
      await fetchDeals();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session) fetchDeals();
  }, [session, status, router]);

  if (status === "loading") return <div className="p-8">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Ultimate Deals Aggregator</h1>
          <div className="flex gap-2">
            <button onClick={syncDeals} className="bg-green-600 px-3 py-1 rounded text-sm">
              مزامنة الآن
            </button>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="bg-red-600 px-3 py-1 rounded text-sm">
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-xl shadow p-4 flex justify-between">
          <p>إجمالي الصفقات: <strong>{totalDeals}</strong></p>
          <p className="text-sm text-gray-500">آخر مزامنة: {data.lastSyncAt || "لم تتم بعد"}</p>
        </div>

        {loading ? <p>جاري تحديث البيانات...</p> : null}

        {[
          ["Lifetime Deals", data.grouped?.lifetime || []],
          ["Cashback Deals", data.grouped?.cashback || []],
          ["Direct Discount", data.grouped?.directDiscount || []],
        ].map(([title, deals]) => (
          <section key={title}>
            <h2 className="text-lg font-bold mb-3">{title}</h2>
            {deals.length === 0 ? (
              <p className="text-sm text-gray-500">لا توجد صفقات حالياً.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );
}
