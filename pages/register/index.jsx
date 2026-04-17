import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("كلمتا السر غير متطابقتين");
      return;
    }
    if (password.length < 6) {
      setError("كلمة السر يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("تم التسجيل بنجاح! 🎉");
        router.push("/login");
      } else setError(data.error || "حدث خطأ");
    } catch (err) {
      setError("حدث خطأ، حاول مرة أخرى");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          حساب جديد 📝
        </h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">الاسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="اسمك"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="example@email.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">كلمة السر</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="********"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">تأكيد كلمة السر</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="********"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">نوع الحساب</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="customer">عميل</option>
              <option value="merchant">تاجر</option>
              <option value="marketer">مسوق</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "جاري التسجيل..." : "إنشاء حساب"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            عندك حساب بالفعل؟{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              سجل الدخول
            </Link>
          </p>
          <Link href="/" className="text-gray-600 hover:underline">
            ← الرجوع للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
