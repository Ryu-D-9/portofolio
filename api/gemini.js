export default async function handler(req, res) {
  const { prompt } = req.query;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY tidak ditemukan" });
  }

  // daftar model yang akan dicoba satu per satu
  const models = [
    "gemini-1.5-pro-latest",
    "gemini-1.5-pro-002",
    "gemini-1.5-pro"
  ];

  let responseData = null;
  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      const data = await response.json();

      if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseData = data.candidates[0].content.parts[0].text;
        break; // kalau berhasil, hentikan loop
      } else {
        lastError = data.error || "Tidak ada teks di respons";
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  if (responseData) {
    res.status(200).json({ result: responseData });
  } else {
    res.status(500).json({ error: lastError || "Semua model gagal dipanggil" });
  }
}