import { useEffect, useState } from "react";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  useEffect(()=>{ fetch('/api/products').then(r=>r.json()).then(setProducts); },[]);
  return <div className="p-8" dir="rtl"><h1 className="text-2xl font-bold mb-5">السوق</h1><div className="grid md:grid-cols-4 gap-4">{products.map((p)=><div key={p.id} className="bg-white rounded shadow p-3"><img src={p.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'} alt={p.name} className="w-full h-40 object-cover rounded"/><h3 className="font-bold mt-2">{p.name}</h3><p>{p.price} جنيه</p><p className="text-sm">{p.merchant_name}</p></div>)}</div></div>;
}
