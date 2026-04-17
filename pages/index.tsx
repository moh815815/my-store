export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          متجري الإلكتروني 🛒
        </h1>

        <p className="text-xl text-gray-600 mb-8">أهلاً بك في متجرنا!</p>

        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            تسجيل الدخول 🔐
          </a>
          <a
            href="/register"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            حساب جديد 📝
          </a>
        </div>
      </div>
    </main>
  );
}
