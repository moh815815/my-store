import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", image_url: "", stock: "" });

  async function load() { const res = await fetch('/api/products'); if (res.ok) setProducts(await res.json()); }
  useEffect(() => { if (status === 'authenticated') load(); }, [status]);

  async function submit(e) {
    e.preventDefault();
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ name: "", description: "", price: "", image_url: "", stock: "" }); load(); }
  }

  if (status !== 'authenticated') return <div className="p-8">سجل دخولك أولاً.</div>;
  if (!["merchant", "admin"].includes(session.user.role)) return <div className="p-8">هذه اللوحة للتجار فقط.</div>;

  return <div className="p-8" dir="rtl"><h1 className="text-2xl font-bold mb-4">لوحة التاجر</h1><form onSubmit={submit} className="grid gap-2 max-w-xl mb-6"><input className="border p-2" placeholder="اسم المنتج" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/><textarea className="border p-2" placeholder="الوصف" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})}/><input className="border p-2" placeholder="السعر" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})}/><input className="border p-2" placeholder="رابط صورة المنتج" value={form.image_url} onChange={(e)=>setForm({...form,image_url:e.target.value})}/><input className="border p-2" placeholder="المخزون" value={form.stock} onChange={(e)=>setForm({...form,stock:e.target.value})}/><button className="bg-green-700 text-white p-2 rounded">إضافة منتج</button></form><div className="grid md:grid-cols-3 gap-4">{products.map((p)=><div key={p.id} className="bg-white rounded shadow p-3"><img src={p.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'} alt={p.name} className="w-full h-40 object-cover rounded"/><h3 className="font-bold mt-2">{p.name}</h3><p>{p.description}</p><p>{p.price} جنيه</p><p>التاجر: {p.merchant_name}</p></div>)}</div></div>;
}
