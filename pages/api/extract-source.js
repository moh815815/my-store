export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body || {};

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" });
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return res.status(400).json({ error: "Only HTTP/HTTPS URLs are allowed" });
  }

  try {
    const response = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": "MyStore Source Extractor/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return res
        .status(400)
        .json({ error: `Failed to fetch source (status ${response.status})` });
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("text/html")) {
      return res.status(400).json({ error: "URL did not return an HTML page" });
    }

    const html = await response.text();

    return res.status(200).json({ html });
  } catch {
    return res.status(500).json({ error: "Could not fetch URL source" });
  }
}
