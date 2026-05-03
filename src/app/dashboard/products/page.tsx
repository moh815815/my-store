"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/lib/types";
import Link from "next/link";

async function loadProducts(merchantId: string) {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("merchant_id", merchantId)
    .order("created_at", { ascending: false });
  return (data as Product[]) || [];
}

export default function ProductsManagePage() {
  const { merchant } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!merchant) return;
    let cancelled = false;
    loadProducts(merchant.id).then((data) => {
      if (!cancelled) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [merchant]);

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function toggleStock(id: string, inStock: boolean) {
    await supabase.from("products").update({ in_stock: !inStock }).eq("id", id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, in_stock: !inStock } : p))
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">Manage your product catalog</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-6 py-3 rounded-lg transition-colors"
        >
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 animate-pulse h-24" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-xl text-gray-400 font-medium mb-2">No products yet</h3>
          <p className="text-gray-500 mb-6">Start adding products to your store</p>
          <Link
            href="/dashboard/products/new"
            className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4"
            >
              <img
                src={product.image_urls?.[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{product.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-amber-400 font-bold">${product.price.toFixed(2)}</span>
                  <span className="text-gray-500 text-sm capitalize">{product.category}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      product.in_stock
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {product.in_stock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleStock(product.id, product.in_stock)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  title={product.in_stock ? "Mark out of stock" : "Mark in stock"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={product.in_stock ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                  </svg>
                </button>
                <Link
                  href={`/dashboard/products/new?edit=${product.id}`}
                  className="text-gray-400 hover:text-amber-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
