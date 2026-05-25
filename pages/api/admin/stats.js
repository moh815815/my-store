import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { query } from "@/lib/db";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user || session.user.role !== "admin") return res.status(403).json({ error: "لوحة الأدمن فقط" });

  const [users, products, marketers] = await Promise.all([
    query("SELECT role, COUNT(*)::int AS count FROM users GROUP BY role", []),
    query("SELECT COUNT(*)::int AS count, COALESCE(SUM(price),0)::int AS total_value FROM products", []),
    query("SELECT COUNT(*)::int AS count FROM marketer_leads", []),
  ]);

  res.status(200).json({ users: users.rows, products: products.rows[0], marketerLeads: marketers.rows[0].count });
}
