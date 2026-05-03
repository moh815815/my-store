# SouqPlus - B2B/B2C Marketplace

A professional marketplace platform built with **Next.js 16**, **Tailwind CSS 4**, and **Supabase**.

## Features

### Authentication & Database
- Full Login/Signup system using Supabase Auth
- Database tables for products, merchants, and orders with Row Level Security (RLS)

### Merchant Dashboard
- Professional admin interface for managing your store
- Add, edit, and delete products with rich details
- Media upload (images & videos) stored in Supabase Storage
- Order management with status tracking (pending, confirmed, shipped, delivered, cancelled)

### Storefront
- Modern, responsive design optimized for mobile
- Product grid with video montage (hover-to-play short videos)
- Advanced cart system using localStorage (persists across sessions)
- Smart search and category filtering

### Communication
- Floating WhatsApp button for direct merchant contact (auto-fills product name & link)
- Category-based product browsing

### Design
- Dark theme with amber/orange accent colors
- Professional color scheme (dark backgrounds with gold highlights)
- Smooth animations and transitions
- Fully responsive across all devices

## Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project

### 1. Clone and Install

```bash
git clone <repo-url>
cd marketplace
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

3. Run the SQL schema in your Supabase SQL Editor:
   - Open `supabase-schema.sql` and execute it in the Supabase Dashboard SQL Editor

4. Create a storage bucket named `media` with public access:
   - Go to Storage in Supabase Dashboard
   - Create a new bucket called `media`
   - Set it to public

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes (products, orders, upload)
│   ├── auth/             # Login, signup, callback pages
│   ├── cart/             # Shopping cart page
│   ├── dashboard/        # Merchant admin panel
│   │   ├── orders/       # Order management
│   │   └── products/     # Product management (CRUD)
│   └── products/         # Product listing & detail pages
├── components/           # Reusable UI components
├── context/              # React contexts (Auth, Cart)
└── lib/                  # Supabase client, types, utilities
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Language**: TypeScript
