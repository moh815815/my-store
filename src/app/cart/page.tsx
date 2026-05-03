"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const merchantGroups = new Map<string, typeof items>();
    for (const item of items) {
      const mid = item.product.merchant_id;
      if (!merchantGroups.has(mid)) merchantGroups.set(mid, []);
      merchantGroups.get(mid)!.push(item);
    }

    for (const [merchantId, merchantItems] of merchantGroups) {
      const orderItems = merchantItems.map((i) => ({
        product_id: i.product.id,
        product_name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
      }));
      const total = merchantItems.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
      );

      await supabase.from("orders").insert({
        merchant_id: merchantId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        items: orderItems,
        total,
        notes,
      });
    }

    clearCart();
    setOrderSuccess(true);
    setSubmitting(false);
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Order Placed!</h2>
          <p className="text-gray-400 mb-8">
            Your order has been submitted. The merchant will contact you shortly.
          </p>
          <Link
            href="/products"
            className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-8 py-3 rounded-lg transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <svg className="w-20 h-20 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 className="text-2xl font-bold text-white mb-3">Your Cart is Empty</h2>
        <p className="text-gray-400 mb-6">Add some products to get started!</p>
        <Link
          href="/products"
          className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-8 py-3 rounded-lg transition-colors inline-block"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-4"
            >
              <img
                src={item.product.image_urls?.[0] || "/placeholder.svg"}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.id}`}
                  className="text-white font-medium hover:text-amber-400 transition-colors line-clamp-2"
                >
                  {item.product.name}
                </Link>
                <p className="text-amber-400 font-bold mt-1">
                  ${item.product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-700 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-400 hover:text-white text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-white text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-400 hover:text-white text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="text-white font-bold text-lg">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-fit sticky top-20">
          <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="text-white">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-800 pt-3 flex justify-between">
              <span className="text-white font-bold">Total</span>
              <span className="text-amber-400 font-bold text-xl">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {!showCheckout ? (
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold py-3 rounded-lg transition-colors"
            >
              Proceed to Checkout
            </button>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              />
              <input
                required
                type="tel"
                placeholder="Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              />
              <textarea
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 resize-none"
                rows={3}
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-gray-950 font-bold py-3 rounded-lg transition-colors"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
