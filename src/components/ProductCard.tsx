"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && product.video_url) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const mainImage = product.image_urls?.[0] || "/placeholder.svg";

  return (
    <div
      className="group bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image / Video */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden">
        {product.video_url && isHovered ? (
          <video
            ref={videoRef}
            src={product.video_url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            -{discount}%
          </span>
        )}

        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}

        {product.video_url && (
          <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Video
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-white font-medium text-sm line-clamp-2 hover:text-amber-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs mt-1 capitalize">{product.category}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-amber-400 font-bold text-lg">${product.price.toFixed(2)}</span>
          {product.compare_price && (
            <span className="text-gray-500 line-through text-sm">
              ${product.compare_price.toFixed(2)}
            </span>
          )}
        </div>
        <button
          disabled={!product.in_stock}
          onClick={() => addItem(product)}
          className="mt-3 w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-semibold py-2 rounded-lg text-sm transition-colors"
        >
          {product.in_stock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
