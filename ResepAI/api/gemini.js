export default async function handler(req, res) {
  // ambil query dari frontend
  const prompt = req.query.prompt || "Buatkan resep sederhana dengan nasi dan ayam";

  try {
    // panggil Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
                  Saya punya bahan: ${prompt}.
                  Buatkan 3 ide resep dalam format JSON:
                  [
                    {
                      "nama": "...",
                      "asal": "...",
                      "bahan": ["...", "..."],
                      "langkah": ["...", "..."]
                    }
                  ]
                  `
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // Ambil text dari response Gemini
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.status(200).json({ result: text });

  } catch (err) {
    console.error("Error call Gemini:", err);
    res.status(500).json({ error: "Gagal memanggil Gemini API" });
  }
}