import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { query } from "@/lib/db";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: "غير مصرح" });

  if (req.method === "GET") {
    const result = await query(`SELECT p.*, u.name AS merchant_name FROM products p JOIN users u ON u.id = p.merchant_id ORDER BY p.created_at DESC`, []);
    return res.status(200).json(result.rows);
  }

  if (req.method === "POST") {
    if (!["merchant", "admin"].includes(session.user.role)) return res.status(403).json({ error: "فقط التجار أو الأدمن" });
    const { name, description, price, image_url, stock } = req.body;
    if (!name || !price) return res.status(400).json({ error: "بيانات ناقصة" });
    const merchantId = session.user.role === "admin" ? req.body.merchant_id : session.user.id;
    const result = await query(`INSERT INTO products (merchant_id, name, description, price, image_url, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [merchantId, name, description || "", Number(price), image_url || "", Number(stock || 0)]);
    return res.status(201).json(result.rows[0]);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
