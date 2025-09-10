// Ambil elemen dari DOM
const btn = document.getElementById("findBtn");
const input = document.getElementById("ingredients");
const results = document.getElementById("results");

// Event klik tombol
btn.addEventListener("click", () => {
  console.log("Tombol Cari diklik ✅"); // cek event
  const ingredients = input.value.trim();
  if (!ingredients) {
    alert("Masukkan bahan dulu ya 🙂");
    return;
  }
  findRecipes(ingredients);
});

// Fungsi panggil API backend di Vercel
async function findRecipes(ingredients) {
  results.innerHTML = "<p>Sedang mencari resep...</p>";

  try {
    const res = await fetch(`ResepAI/api/gemini?prompt=${encodeURIComponent(ingredients)}`);
    const data = await res.json();

    // Cek hasil balik
    console.log("Response dari server:", data);

    const text = data.result || "";
    let recipes = [];

    try {
      // coba parse JSON yang dikembalikan Gemini
      recipes = JSON.parse(text);
    } catch (e) {
      results.innerHTML = `<p>❌ Gagal parsing hasil. Coba cek format JSON dari Gemini.</p>`;
      console.error("Parsing error:", e, text);
      return;
    }

    renderRecipes(recipes);

  } catch (err) {
    console.error("Error fetch:", err);
    results.innerHTML = `<p>⚠️ Terjadi kesalahan memanggil server.</p>`;
  }
}

// Render hasil resep ke HTML
function renderRecipes(recipes) {
  results.innerHTML = "";
  if (!recipes.length) {
    results.innerHTML = "<p>Tidak ada resep ditemukan.</p>";
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