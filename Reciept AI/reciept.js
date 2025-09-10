async function findRecipes(ingredients) {
  const res = await fetch(`/.netlify/functions/gemini?prompt=${encodeURIComponent("Bahan: " + ingredients)}`);
  const data = await res.json();
  console.log(data);
}
const btn = document.getElementById("findBtn");
const input = document.getElementById("ingredients");
const results = document.getElementById("results");

btn.addEventListener("click", () => {
  const ingredients = input.value.trim();
  if (!ingredients) return;
  findRecipes(ingredients);
});

async function findRecipes(ingredients) {
  results.innerHTML = "<p>Sedang mencari resep...</p>";

  const prompt = `
  Saya punya bahan: ${ingredients}.
  Buatkan 3 ide resep dalam format JSON rapi dengan struktur:
  [
    {
      "nama": "...",
      "asal": "...",
      "bahan": ["...", "..."],
      "langkah": ["...", "..."]
    }
  ]
  Jangan beri teks tambahan, hanya JSON valid.
  `;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await res.json();
    const text = data.candidates[0].content.parts[0].text;

    // coba parse JSON
    const recipes = JSON.parse(text);
    renderRecipes(recipes);

  } catch (err) {
    results.innerHTML = `<p>❌ Gagal mengambil resep. Cek API key atau response.</p>`;
    console.error(err);
  }
}

function renderRecipes(recipes) {
  results.innerHTML = "";
  recipes.forEach(r => {
    const div = document.createElement("div");
    div.className = "recipe";
    div.innerHTML = `
      <h3>${r.nama} (${r.asal})</h3>
      <p><strong>Bahan:</strong> ${r.bahan.join(", ")}</p>
      <p><strong>Langkah:</strong></p>
      <ol>${r.langkah.map(l => `<li>${l}</li>`).join("")}</ol>
    `;
    results.appendChild(div);
  });
}