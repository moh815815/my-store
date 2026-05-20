import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [stats, setStats] = useState({
    totalCars: 0,
    totalLeads: 0,
    totalValue: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role === "merchant") {
      setCars([
        { id: 1, name: "تويوتا كورولا 2023", price: 1050000, leads: 19, stock: true },
        { id: 2, name: "كيا سبورتاج 2022", price: 1420000, leads: 11, stock: true },
      ]);
      setStats({ totalCars: 2, totalLeads: 30, totalValue: 2470000 });
    }
  }, [session, status, router]);

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <p className="text-xl">جاري التحميل...</p>
      </div>
    );
  if (session?.user?.role !== "merchant")
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">⛔ مش مصرحلك بالدخول هنا</p>
          <Link href="/" className="text-blue-600 underline">
            الرجوع للرئيسية
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-blue-700 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة تحكم معرض السيارات 👨‍💼</h1>
          <div className="flex gap-4">
            <span>👤 {session.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              خروج 🚪
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 mb-2">إجمالي العربيات</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalCars}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 mb-2">إجمالي طلبات التواصل</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 mb-2">القيمة السوقية</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.totalValue.toLocaleString("en-US")} جنيه
            </p>
          </div>
        </div>
        <div className="mb-8 flex gap-4">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            إضافة عربية جديدة ➕
          </button>
          <Link
            href="/"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            الذهاب للسوق 🚗
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">عربياتي المعروضة 📦</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-right">العربية</th>
                <th className="p-4 text-right">السعر</th>
                <th className="p-4 text-right">طلبات التواصل</th>
                <th className="p-4 text-right">الحالة</th>
                <th className="p-4 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-bold">{car.name}</td>
                  <td className="p-4">{car.price.toLocaleString("en-US")} جنيه</td>
                  <td className="p-4">{car.leads}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded ${car.stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {car.stock ? "متاحة ✅" : "مباعة ❌"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                        تعديل ✏️
                      </button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                        حذف 🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
