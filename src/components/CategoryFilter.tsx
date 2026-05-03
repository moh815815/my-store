"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/types";

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  const handleClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === activeCategory) {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("category");
          router.push(`/products?${params.toString()}`);
        }}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          !activeCategory
            ? "bg-amber-500 text-gray-950"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
            activeCategory === cat.id
              ? "bg-amber-500 text-gray-950"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
