import { useMemo, useState } from "react";

const sampleHtml = `<!doctype html>
<html>
<head>
  <title>My Old Site</title>
</head>
<body>
  <header>
    <img src="https://old-site.com/logo.png" alt="logo" />
    <h1>Welcome</h1>
  </header>
</body>
</html>`;

function replaceTitle(html: string, newTitle: string) {
  if (!newTitle.trim()) return html;

  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${newTitle}</title>`);
  }

  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>\n  <title>${newTitle}</title>`);
  }

  return `<head><title>${newTitle}</title></head>\n${html}`;
}

function replaceLogo(html: string, logoUrl: string) {
  if (!logoUrl.trim()) return html;

  const logoRegex = /<img([^>]*)(src=["'][^"']*["'])([^>]*)>/i;

  if (logoRegex.test(html)) {
    return html.replace(logoRegex, `<img$1src="${logoUrl}"$3>`);
  }

  return html;
}

export default function Home() {
  const [sourceUrl, setSourceUrl] = useState("");
  const [isLoadingSource, setIsLoadingSource] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");
  const [inputHtml, setInputHtml] = useState(sampleHtml);
  const [newTitle, setNewTitle] = useState("My New Brand");
  const [newLogoUrl, setNewLogoUrl] = useState("https://my-brand.com/new-logo.png");

  const transformedHtml = useMemo(() => {
    const withTitle = replaceTitle(inputHtml, newTitle);
    return replaceLogo(withTitle, newLogoUrl);
  }, [inputHtml, newTitle, newLogoUrl]);

  const extractSource = async () => {
    if (!sourceUrl.trim()) {
      setFetchMessage("من فضلك أدخل رابط الموقع أولاً.");
      return;
    }

    setIsLoadingSource(true);
    setFetchMessage("");

    try {
      const response = await fetch("/api/extract-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sourceUrl.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        setFetchMessage(data.error || "فشل استخراج السورس.");
        return;
      }

      setInputHtml(data.html || "");
      setFetchMessage("تم استخراج السورس بنجاح.");
    } catch {
      setFetchMessage("حصل خطأ أثناء الاتصال بالخادم.");
    } finally {
      setIsLoadingSource(false);
    }
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(transformedHtml);
      setFetchMessage("تم نسخ السورس المعدل.");
    } catch {
      setFetchMessage("تعذر النسخ التلقائي. انسخ النص يدويًا.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 text-center">
          أداة استخراج وتعديل السورس كود (العنوان + اللوجو)
        </h1>

        <p className="text-center text-slate-600">
          اكتب رابط موقع لاستخراج السورس أو الصق HTML يدويًا، ثم غيّر العنوان واللوجو فورًا.
        </p>

        <section className="bg-white rounded-xl shadow p-4 md:p-6 space-y-4">
          <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">رابط الموقع لاستخراج السورس</span>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </label>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              onClick={extractSource}
              disabled={isLoadingSource}
            >
              {isLoadingSource ? "جاري الاستخراج..." : "استخراج السورس"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">العنوان الجديد</span>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">رابط اللوجو الجديد</span>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                value={newLogoUrl}
                onChange={(e) => setNewLogoUrl(e.target.value)}
              />
            </label>
          </div>

          {fetchMessage ? <p className="text-sm text-slate-600">{fetchMessage}</p> : null}

          <div className="grid lg:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">السورس الأصلي (HTML)</span>
              <textarea
                className="w-full min-h-[320px] border border-slate-300 rounded-lg p-3 font-mono text-sm"
                value={inputHtml}
                onChange={(e) => setInputHtml(e.target.value)}
              />
            </label>

            <label className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-700">السورس بعد التعديل</span>
                <button
                  onClick={copyResult}
                  className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700"
                >
                  نسخ الناتج
                </button>
              </div>
              <textarea
                className="w-full min-h-[320px] border border-emerald-300 rounded-lg p-3 font-mono text-sm bg-emerald-50"
                value={transformedHtml}
                readOnly
              />
            </label>
          </div>
        </section>
      </div>
    </main>
  );
}
