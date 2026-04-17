import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existingUser.rows.length > 0)
      return res.status(400).json({ error: "البريد الإلكتروني مستخدم بالفعل" });
    const hashedPassword = await bcrypt.hash(password, 10);
    await query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, email, hashedPassword, role],
    );
    res.status(201).json({ message: "تم التسجيل بنجاح" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "حدث خطأ في التسجيل" });
  }
}
