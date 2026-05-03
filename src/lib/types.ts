export interface Product {
  id: string;
  merchant_id: string;
  name: string;
  name_ar?: string;
  description: string;
  description_ar?: string;
  price: number;
  compare_price?: number;
  category: string;
  image_urls: string[];
  video_url?: string;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface Merchant {
  id: string;
  user_id: string;
  store_name: string;
  store_name_ar?: string;
  description?: string;
  whatsapp_number: string;
  logo_url?: string;
  created_at: string;
}

export interface Order {
  id: string;
  merchant_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Category = {
  id: string;
  name: string;
  name_ar: string;
  icon: string;
};

export const CATEGORIES: Category[] = [
  { id: "electronics", name: "Electronics", name_ar: "إلكترونيات", icon: "💻" },
  { id: "clothing", name: "Clothing", name_ar: "ملابس", icon: "👔" },
  { id: "home", name: "Home & Garden", name_ar: "المنزل والحديقة", icon: "🏠" },
  { id: "beauty", name: "Beauty", name_ar: "جمال", icon: "💄" },
  { id: "sports", name: "Sports", name_ar: "رياضة", icon: "⚽" },
  { id: "food", name: "Food", name_ar: "طعام", icon: "🍕" },
  { id: "books", name: "Books", name_ar: "كتب", icon: "📚" },
  { id: "toys", name: "Toys", name_ar: "ألعاب", icon: "🎮" },
  { id: "automotive", name: "Automotive", name_ar: "سيارات", icon: "🚗" },
  { id: "other", name: "Other", name_ar: "أخرى", icon: "📦" },
];
