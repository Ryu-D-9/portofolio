const btn = document.getElementById("findBtn");
const input = document.getElementById("ingredients");
const results = document.getElementById("results");

// Event klik tombol
btn.addEventListener("click", () => {
  const ingredients = input.value.trim();
  if (!ingredients) {
    alert("Masukkan bahan dulu ya 🙂");
    return;
  }
  findRecipes(ingredients);
});

// === Fungsi utama ===
async function findRecipes(ingredients) {
  results.innerHTML = "<p>🔎 Sedang mencari resep...</p>";

  try {
    // Panggil Gemini API via backend Vercel
    const res = await fetch(`/api/gemini?prompt=${encodeURIComponent(ingredients)}`);
    if (!res.ok) throw new Error("Gemini error");

    const data = await res.json();
    const text = data.result || "";

    let recipes = [];
    try {
      recipes = JSON.parse(text); // Harus format JSON dari Gemini
      renderRecipes(recipes);
    } catch (e) {
      console.warn("❌ JSON Gemini gagal diparsing:", e);
      await fetchMealDB(ingredients); // fallback ke MealDB
    }
  } catch (err) {
    console.warn("⚠️ Gemini gagal, fallback ke MealDB...", err);
    await fetchMealDB(ingredients); // fallback ke MealDB
  }
}

// Render hasil Gemini
function renderRecipes(recipes) {
  results.innerHTML = "";
  if (!recipes.length) {
    results.innerHTML = "<p>Tidak ada resep ditemukan dari Gemini.</p>";
    return;
  }

  recipes.forEach(r => {
    const div = document.createElement("div");
    div.className = "recipe";
    div.innerHTML = `
      <h3>${r.nama} (${r.asal})</h3>
      <p><strong>Bahan:</strong></p>
      <ul>${r.bahan.map(b => `<li>${b}</li>`).join("")}</ul>
      <p><strong>Langkah:</strong></p>
      <ol>${r.langkah.map(l => `<li>${l}</li>`).join("")}</ol>
    `;
    results.appendChild(div);
  });
}

// === Fallback MealDB ===
async function fetchMealDB(ingredients) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredients)}`);
    const data = await res.json();

    if (!data.meals) {
      results.innerHTML = "<p>⚠️ Tidak ada resep ditemukan di MealDB untuk bahan ini.</p>";
      return;
    }

    renderMealDB(data.meals);
  } catch (err) {
    console.error("MealDB error:", err);
    results.innerHTML = "<p>⚠️ Gagal juga memanggil MealDB.</p>";
  }
}

async function renderMealDB(meals) {
  results.innerHTML = "";

  for (const m of meals) {
    // Ambil detail resep MealDB
    const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`);
    const detailData = await detailRes.json();
    const meal = detailData.meals[0];

    // Kumpulkan bahan + takaran
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim()) {
        ingredients.push(`${ing} - ${measure}`);
      }
    }

    // Render ke HTML
 const div = document.createElement("div");
div.className = "recipe";
div.setAttribute("data-aos", "zoom-in"); // animasi zoom saat muncul
div.innerHTML = `
  <h3>${meal.strMeal} (${meal.strArea})</h3>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="max-width:200px;border-radius:8px"/>
  <p><strong>Bahan:</strong></p>
  <ul>${ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
  <p><strong>Instruksi:</strong> ${meal.strInstructions}</p>
`;
results.appendChild(div);
  }
}