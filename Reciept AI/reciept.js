async function findRecipes(ingredients) {
  const res = await fetch(`/api/gemini?prompt=${encodeURIComponent(ingredients)}`);
  const data = await res.json();

  try {
    // parse hasil JSON dari Gemini
    const recipes = JSON.parse(data.result);
    renderRecipes(recipes);
  } catch (e) {
    console.error("Output bukan JSON valid:", data.result);
  }
}

function renderRecipes(recipes) {
  const results = document.getElementById("results");
  results.innerHTML = "";
  recipes.forEach(r => {
    const div = document.createElement("div");
    div.className = "recipe";
    div.innerHTML = `
      <h3>${r.nama} (${r.asal})</h3>
      <p><strong>Bahan:</strong> ${r.bahan.join(", ")}</p>
      <ol>${r.langkah.map(l => `<li>${l}</li>`).join("")}</ol>
    `;
    results.appendChild(div);
  });
}