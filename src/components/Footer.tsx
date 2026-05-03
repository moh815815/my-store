import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              SouqPlus
            </span>
            <p className="mt-3 text-gray-400 text-sm">
              Your trusted B2B/B2C marketplace for quality products at
              competitive prices.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-amber-400 text-sm transition-colors">
                Home
              </Link>
              <Link href="/products" className="block text-gray-400 hover:text-amber-400 text-sm transition-colors">
                All Products
              </Link>
              <Link href="/auth/login" className="block text-gray-400 hover:text-amber-400 text-sm transition-colors">
                Merchant Login
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <p className="text-gray-400 text-sm">
              Need help? Reach out via WhatsApp or email us.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SouqPlus. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
