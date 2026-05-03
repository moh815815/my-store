"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import type { Order } from "@/lib/types";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-500/10 text-yellow-400" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-500/10 text-blue-400" },
  { value: "shipped", label: "Shipped", color: "bg-purple-500/10 text-purple-400" },
  { value: "delivered", label: "Delivered", color: "bg-green-500/10 text-green-400" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500/10 text-red-400" },
];

async function loadOrders(merchantId: string) {
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("merchant_id", merchantId)
    .order("created_at", { ascending: false });
  return (data as Order[]) || [];
}

export default function OrdersPage() {
  const { merchant } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!merchant) return;
    let cancelled = false;
    loadOrders(merchant.id).then((data) => {
      if (!cancelled) {
        setOrders(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [merchant]);

  async function updateStatus(orderId: string, status: string) {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: status as Order["status"] } : o
      )
    );
  }

  function getStatusStyle(status: string) {
    return STATUS_OPTIONS.find((s) => s.value === status)?.color || "bg-gray-500/10 text-gray-400";
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-gray-400 mt-1">Manage incoming orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-xl text-gray-400 font-medium">No orders yet</h3>
          <p className="text-gray-500 mt-2">Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
            >
              <div
                className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-medium">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {order.customer_name} &middot; {order.customer_phone}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-amber-400 font-bold text-lg">
                    ${Number(order.total).toFixed(2)}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedOrder === order.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="border-t border-gray-800 p-4 sm:p-6 space-y-4">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Customer</p>
                      <p className="text-white">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="text-white">{order.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="text-white">{order.customer_phone}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-gray-500 text-sm mb-2">Items</p>
                    <div className="space-y-2">
                      {(order.items as { product_name: string; quantity: number; price: number }[]).map(
                        (item, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-sm bg-gray-800/50 px-3 py-2 rounded-lg"
                          >
                            <span className="text-white">
                              {item.product_name} x{item.quantity}
                            </span>
                            <span className="text-gray-300">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {order.notes && (
                    <div>
                      <p className="text-gray-500 text-sm">Notes</p>
                      <p className="text-gray-300 text-sm mt-1">{order.notes}</p>
                    </div>
                  )}

                  {/* Status Update */}
                  <div>
                    <p className="text-gray-500 text-sm mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => updateStatus(order.id, s.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            order.status === s.value
                              ? "bg-amber-500 text-gray-950"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
