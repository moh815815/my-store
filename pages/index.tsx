import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className="min-h-screen p-8 bg-gray-50" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">منصة التجارة الاحترافية</h1>
        <p className="text-gray-700 mb-8">تجار + مسوقين + لوحة أدمن + إدارة منتجات وصور حقيقية.</p>
        <div className="grid md:grid-cols-4 gap-4">
          <Link href="/marketplace" className="bg-blue-600 text-white p-4 rounded-lg text-center">تصفح السوق</Link>
          <Link href="/dashboard" className="bg-green-600 text-white p-4 rounded-lg text-center">لوحة التاجر</Link>
          <Link href="/admin" className="bg-purple-600 text-white p-4 rounded-lg text-center">لوحة الأدمن</Link>
          {!session ? <Link href="/register" className="bg-orange-600 text-white p-4 rounded-lg text-center">إنشاء حساب</Link> : <Link href="/login" className="bg-gray-700 text-white p-4 rounded-lg text-center">تسجيل دخول بحساب آخر</Link>}
        </div>
      </div>
    </main>
  );
}
