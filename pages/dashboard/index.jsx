import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role === "merchant") {
      setProducts([
        { id: 1, name: "سماعة بلوتوث", price: 299, sales: 15, stock: true },
        { id: 2, name: "ساعة ذكية", price: 599, sales: 8, stock: true },
      ]);
      setStats({ totalProducts: 2, totalSales: 23, totalRevenue: 9592 });
    }
  }, [session, status, router]);

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">جاري التحميل...</p>
      </div>
    );
  if (session?.user?.role !== "merchant")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">⛔ مش مصرحلك بالدخول هنا</p>
          <Link href="/" className="text-blue-600 underline">
            الرجوع للرئيسية
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة التحكم 👨‍💼</h1>
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
            <h3 className="text-gray-600 mb-2">إجمالي المنتجات</h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalProducts}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 mb-2">إجمالي المبيعات</h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.totalSales}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 mb-2">إجمالي الإيرادات</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.totalRevenue} جنيه
            </p>
          </div>
        </div>
        <div className="mb-8 flex gap-4">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            إضافة منتج جديد ➕
          </button>
          <Link
            href="/"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            الذهاب للمتجر 🛒
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">منتجاتي 📦</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-right">المنتج</th>
                <th className="p-4 text-right">السعر</th>
                <th className="p-4 text-right">المبيعات</th>
                <th className="p-4 text-right">الحالة</th>
                <th className="p-4 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-bold">{product.name}</td>
                  <td className="p-4">{product.price} جنيه</td>
                  <td className="p-4">{product.sales}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded ${product.stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {product.stock ? "متوفر ✅" : "نفذت الكمية ❌"}
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
