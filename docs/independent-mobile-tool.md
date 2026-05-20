# Independent Mobile Tool Delivery

تم تنفيذ طلب إنشاء أداة مستقلة خارج هذا المستودع في المسار التالي:

`/workspace/mobile-devkit-lite`

## ماذا تحتوي الأداة؟
- محرر كود خفيف مناسب للموبايلات ذات الإمكانيات المحدودة.
- لوحة أزرار إضافية تعطي تجربة قريبة من كيبورد الكمبيوتر (Tab, أقواس, أسهم).
- تشغيل JavaScript سريع داخل المتصفح وعرض المخرجات.
- لا تعتمد على build ثقيل؛ تعمل مباشرة بملفات HTML/CSS/JS.

## طريقة التشغيل المحلي
```bash
cd /workspace/mobile-devkit-lite
python3 -m http.server 8080
```
ثم افتح:
`http://localhost:8080`

---

## نشر المشروع على GitHub (مستودع مستقل)

> ملاحظة: بيئة التنفيذ هنا لا تحتوي على `gh` CLI ولا توجد بيانات تسجيل دخول GitHub، لذلك تم تجهيز خطوات نشر مباشرة تنفذها أنت على جهازك أو بعد إضافة صلاحيات Git.

### 1) تجهيز commit للمشروع المستقل
```bash
cd /workspace/mobile-devkit-lite
git add .
git commit -m "feat: initial mobile devkit lite"
```

### 2) خيار نفس الاسم أو اسم مختلف

#### خيار A: نفس الاسم
أنشئ مستودعًا جديدًا على GitHub باسم:
`mobile-devkit-lite`

ثم اربطه وادفع:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/mobile-devkit-lite.git
git push -u origin main
```

#### خيار B: اسم مختلف
أنشئ مستودعًا جديدًا على GitHub بأي اسم تريده (مثال: `mobile-code-studio-lite`) ثم:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<NEW_REPO_NAME>.git
git push -u origin main
```

### 3) التحقق بعد النشر
- تأكد أن الملفات التالية موجودة في GitHub:
  - `index.html`
  - `styles.css`
  - `app.js`
  - `README.md`
- فعّل GitHub Pages لاحقًا إن أردت رابط تشغيل مباشر.
