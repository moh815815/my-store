"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const { merchant } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (!merchant) return;

    async function fetchStats() {
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact" }).eq("merchant_id", merchant!.id),
        supabase.from("orders").select("*").eq("merchant_id", merchant!.id),
      ]);

      const orders = ordersRes.data || [];
      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        totalRevenue: orders.reduce((sum, o) => sum + Number(o.total), 0),
      });
    }
    fetchStats();
  }, [merchant]);

  if (!merchant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-white mb-4">Set Up Your Store</h2>
        <p className="text-gray-400 mb-6">
          Complete your merchant profile to get started
        </p>
        <Link
          href="/auth/signup"
          className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-6 py-3 rounded-lg transition-colors"
        >
          Complete Setup
        </Link>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome, {merchant.store_name}
        </h1>
        <p className="text-gray-400 mt-1">Here&apos;s your store overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                <svg className={`w-5 h-5 ${card.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
            </div>
            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/dashboard/products/new"
          className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-6 py-3 rounded-lg transition-colors"
        >
          Add New Product
        </Link>
        <Link
          href="/dashboard/orders"
          className="border border-gray-700 hover:border-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}
