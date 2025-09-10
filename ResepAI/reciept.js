// Ambil elemen dari halaman
const btn = document.getElementById("findBtn");
const input = document.getElementById("ingredients");
const results = document.getElementById("results");

// Event tombol "Cari Resep"
btn.addEventListener("click", () => {
  const ingredients = input.value.trim();
  if (!ingredients) {
    alert("Masukkan bahan dulu ya 🙂");
    return;
  }
  findRecipes(ingredients);
});

// Fungsi utama: coba Gemini, kalau gagal pakai MealDB
async function findRecipes(ingredients) {
  results.innerHTML = "<p>🔎 Sedang mencari resep...</p>";

  try {
    // === Coba panggil API Gemini lewat backend Vercel ===
    const res = await fetch(`/api/gemini?prompt=${encodeURIComponent(ingredients)}`);
    if (!res.ok) throw new Error("Gagal panggil Gemini");

    const data = await res.json();
    const text = data.result || "";

    let recipes = [];
    try {
      recipes = JSON.parse(text); // Gemini harus balikin JSON
      renderRecipes(recipes);
    } catch (e) {
      console.warn("❌ Gagal parsing JSON dari Gemini:", e);
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
      <p><strong>Bahan:</strong> ${r.bahan.join(", ")}</p>
      <p><strong>Langkah:</strong></p>
      <ol>${r.langkah.map(l => `<li>${l}</li>`).join("")}</ol>
    `;
    results.appendChild(div);
  });
}

// === Fallback: API MealDB ===
async function fetchMealDB(ingredients) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredients)}`);
    const data = await res.json();

    if (!data.meals) {
      results.innerHTML = "<p>Tidak ada resep ditemukan di MealDB.</p>";
      return;
    }

    renderMealDB(data.meals);
  } catch (err) {
    console.error("MealDB error:", err);
    results.innerHTML = "<p>⚠️ Gagal juga memanggil MealDB.</p>";
  }
}

function renderMealDB(meals) {
  results.innerHTML = "";
  meals.forEach(m => {
    const div = document.createElement("div");
    div.className = "recipe";
    div.innerHTML = `
      <h3>${m.strMeal}</h3>
      <img src="${m.strMealThumb}" alt="${m.strMeal}" style="max-width:200px;border-radius:8px"/>
    `;
    results.appendChild(div);
  });
}