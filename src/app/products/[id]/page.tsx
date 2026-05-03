"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import type { Product, Merchant } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setProduct(data as Product);
        const { data: merchantData } = await supabase
          .from("merchants")
          .select("*")
          .eq("id", data.merchant_id)
          .single();
        setMerchant(merchantData as Merchant | null);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-800 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-800 rounded w-3/4" />
            <div className="h-6 bg-gray-800 rounded w-1/2" />
            <div className="h-24 bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-gray-400">Product not found</h2>
        <Link href="/products" className="text-amber-400 hover:text-amber-300 mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const whatsappNumber = merchant?.whatsapp_number || "1234567890";
  const productUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-amber-400">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-amber-400">Products</Link>
        <span>/</span>
        <span className="text-gray-300">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images / Video */}
        <div>
          <div className="aspect-square bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-4">
            {product.video_url && selectedImage === -1 ? (
              <video
                src={product.video_url}
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
              />
            ) : (
              <img
                src={product.image_urls?.[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.image_urls?.map((url, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === i ? "border-amber-500" : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            {product.video_url && (
              <button
                onClick={() => setSelectedImage(-1)}
                className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors relative bg-gray-800 flex items-center justify-center ${
                  selectedImage === -1 ? "border-amber-500" : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="text-amber-400 text-sm font-medium capitalize">{product.category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-amber-400">${product.price.toFixed(2)}</span>
            {product.compare_price && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  ${product.compare_price.toFixed(2)}
                </span>
                <span className="bg-orange-500 text-white text-sm font-bold px-2 py-1 rounded">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-400 leading-relaxed mb-8">{product.description}</p>

          {/* Stock status */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-3 h-3 rounded-full ${product.in_stock ? "bg-green-500" : "bg-red-500"}`} />
            <span className={product.in_stock ? "text-green-400" : "text-red-400"}>
              {product.in_stock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-700 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2 text-white font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                +
              </button>
            </div>
            <button
              disabled={!product.in_stock}
              onClick={() => addItem(product, quantity)}
              className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold py-3 rounded-lg transition-colors"
            >
              {product.in_stock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {/* Merchant info */}
          {merchant && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Sold by</p>
              <p className="text-white font-medium">{merchant.store_name}</p>
            </div>
          )}
        </div>
      </div>

      <WhatsAppButton
        phoneNumber={whatsappNumber}
        productName={product.name}
        productUrl={productUrl}
      />
    </div>
  );
}
