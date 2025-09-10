// netlify/functions/gemini.js
export async function handler(event) {
  const { prompt } = event.queryStringParameters;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await res.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}