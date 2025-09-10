async function findRecipes(ingredients) {
  const res = await fetch(`/api/gemini?prompt=${encodeURIComponent("Bahan: " + ingredients)}`);
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
  
    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memanggil Gemini API" });
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