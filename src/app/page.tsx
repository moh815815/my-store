"use client";

import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { CATEGORIES } from "@/lib/types";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Your Premium{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8">
              Discover quality products from trusted merchants. Shop with
              confidence on SouqPlus.
            </p>
            <div className="flex justify-center mb-8">
              <SearchBar />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="bg-amber-500 hover:bg-amber-600 text-gray-950 px-8 py-3 rounded-xl font-bold text-lg transition-colors"
              >
                Browse Products
              </Link>
              <Link
                href="/auth/signup"
                className="border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 px-8 py-3 rounded-xl font-bold text-lg transition-colors"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all group"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <p className="text-white font-medium text-sm group-hover:text-amber-400 transition-colors">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-12 text-center">
            Why Choose SouqPlus?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Trusted Merchants</h3>
              <p className="text-gray-400 text-sm">
                Verified merchants with quality products and reliable service.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Fast & Easy</h3>
              <p className="text-gray-400 text-sm">
                Quick ordering with instant WhatsApp communication.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-400 text-sm">
                Competitive B2B and B2C pricing for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton phoneNumber="1234567890" />
    </>
  );
}
