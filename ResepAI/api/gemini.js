export default async function handler(req, res) {
  const prompt = req.query.prompt || "Buatkan resep sederhana";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.status(200).json({ result: text });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Gagal memanggil Gemini API" });
  }
}