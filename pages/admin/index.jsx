import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState(null);
  useEffect(() => { if (status === 'authenticated') fetch('/api/admin/stats').then(r=>r.json()).then(setStats); }, [status]);
  if (status !== 'authenticated') return <div className="p-8">سجل الدخول كأدمن.</div>;
  if (session.user.role !== 'admin') return <div className="p-8">غير مصرح لك.</div>;
  return <div className="p-8" dir="rtl"><h1 className="text-2xl font-bold mb-6">لوحة الأدمن</h1>{stats && <><div className="grid md:grid-cols-3 gap-4 mb-4"><div className="p-4 bg-white shadow rounded">إجمالي المنتجات: {stats.products.count}</div><div className="p-4 bg-white shadow rounded">قيمة المنتجات: {stats.products.total_value}</div><div className="p-4 bg-white shadow rounded">ليدز المسوقين: {stats.marketerLeads}</div></div><div className="bg-white p-4 rounded shadow"><h2 className="font-bold mb-2">المستخدمون حسب الدور</h2>{stats.users.map((u)=><div key={u.role}>{u.role}: {u.count}</div>)}</div></>}</div>;
}
