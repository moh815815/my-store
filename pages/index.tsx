const featuredCars = [
  {
    id: 1,
    name: "تويوتا كورولا 2023",
    price: "1,050,000 جنيه",
    mileage: "32,000 كم",
    fuel: "بنزين",
    city: "القاهرة",
  },
  {
    id: 2,
    name: "هيونداي إلنترا HD 2021",
    price: "820,000 جنيه",
    mileage: "48,500 كم",
    fuel: "بنزين",
    city: "الإسكندرية",
  },
  {
    id: 3,
    name: "كيا سبورتاج 2022",
    price: "1,420,000 جنيه",
    mileage: "27,300 كم",
    fuel: "بنزين",
    city: "الجيزة",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <section className="bg-gradient-to-l from-blue-700 to-cyan-600 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            شامل لسوق السيارات 🚗
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            بيع واشتري عربيتك بسهولة، وقارن الأسعار في كل المحافظات.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/register"
              className="bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50"
            >
              اعرض عربيتك الآن
            </a>
            <a
              href="/login"
              className="bg-blue-900/40 border border-blue-200 px-6 py-3 rounded-lg hover:bg-blue-900/60"
            >
              دخول التجار
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-md p-5 grid grid-cols-1 md:grid-cols-5 gap-4">
          <input className="border rounded-lg px-4 py-3" placeholder="ابحث باسم السيارة" />
          <select className="border rounded-lg px-4 py-3">
            <option>كل الماركات</option>
            <option>تويوتا</option>
            <option>هيونداي</option>
            <option>كيا</option>
            <option>نيسان</option>
          </select>
          <select className="border rounded-lg px-4 py-3">
            <option>كل الأسعار</option>
            <option>أقل من 500 ألف</option>
            <option>500 ألف - 1 مليون</option>
            <option>أكثر من 1 مليون</option>
          </select>
          <select className="border rounded-lg px-4 py-3">
            <option>كل المحافظات</option>
            <option>القاهرة</option>
            <option>الجيزة</option>
            <option>الإسكندرية</option>
          </select>
          <button className="bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700">
            بحث 🔎
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-slate-900">سيارات مميزة</h2>
          <a href="/dashboard" className="text-blue-700 font-semibold hover:underline">
            لوحة التاجر
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredCars.map((car) => (
            <article key={car.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <div className="h-36 bg-slate-100 rounded-lg mb-4 flex items-center justify-center text-slate-400">
                صورة السيارة
              </div>
              <h3 className="font-bold text-lg mb-2">{car.name}</h3>
              <p className="text-blue-700 font-extrabold mb-3">{car.price}</p>
              <ul className="text-slate-600 space-y-1 text-sm">
                <li>الممشى: {car.mileage}</li>
                <li>الوقود: {car.fuel}</li>
                <li>المحافظة: {car.city}</li>
              </ul>
              <button className="mt-4 w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800">
                تفاصيل الإعلان
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
