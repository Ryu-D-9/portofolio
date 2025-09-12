export default async function handler(req, res) {
  const { prompt } = req.query;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY tidak terbaca" });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    res.status(200).json({ result: data.candidates?.[0]?.content?.parts?.[0]?.text || "" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}