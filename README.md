# Ultimate Deals Aggregator

منصة تجميع صفقات متعددة المصادر مع فصل تام بين محرك السحب (scraper engine) وواجهة العرض.

## الميزات
- سحب صفقات مدى الحياة (AppSumo/StackSocial) + صفقات كاش باك.
- دعم تحويل روابط العمولة آلياً لكل مصدر.
- معادلة التسعير النهائي: `السعر الأصلي - الخصم - الكاش باك`.
- مراقبة الصفقات السريعة (Flash) والتنبيه عند كاش باك >= 20%.
- تخزين تاريخ الأسعار في قاعدة خفيفة (JSON-based) لإظهار مصداقية العروض.
- واجهة لوحة مسوقين مقسمة إلى أنواع الصفقات مع زر نسخ رابط العمولة.

## الهيكلة
- `lib/deals/` يحتوي كل منطق السحب والتحويل والحساب والتنبيه والتخزين.
- `pages/api/deals/sync.js` لتشغيل المزامنة.
- `pages/api/deals/index.js` لجلب الصفقات المجمعة للواجهة.
- `pages/dashboard/index.jsx` واجهة المسوقين.

## إضافة مصدر جديد بسهولة
أضف كائن جديد في `lib/deals/sources.js` بالشكل:

```js
{
  id: "source-id",
  name: "Source Name",
  type: "lifetime" | "cashback" | "direct-discount",
  url: "https://...",
  affiliateTemplate: "https://go.my-store.local/...{url}",
  parserHints: {
    productRegex: /.../g,
    priceRegex: /.../g,
    imageRegex: /.../g,
    cashbackRegex: /.../g,
  },
}
```

ثم سيقوم محرك `scrapeAllSources` بالتعامل معه تلقائياً أثناء المزامنة.

## API سريع
- `POST /api/deals/sync` تشغيل السحب + التنبيهات + تحديث history.
- `GET /api/deals` جلب البيانات المجمعة مصنفة.
