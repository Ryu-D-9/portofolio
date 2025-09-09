const ingInput = document.getElementById("ingInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");
const tpl = document.getElementById("mealCardTpl");

searchBtn.addEventListener("click", () => runSearch());
ingInput.addEventListener("keydown", (e) => { if (e.key === "Enter") runSearch(); });

async function runSearch() {
  const raw = ingInput.value.trim();
  if (!raw) { results.innerHTML = infoBox("Tulis minimal 1 bahan terlebih dulu 🙏"); return; }

  const ingredients = raw.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  results.innerHTML = loadingBox("Mencari resep yang cocok dengan: " + ingredients.join(", "));

  try {
    // 1) Ambil daftar meal per bahan → lalu intersect ID-nya
    const lists = await Promise.all(ingredients.map(fetchMealsByIngredient));
    const intersection = intersectMealIds(lists);

    if (intersection.length === 0) {
      results.innerHTML = infoBox("Belum ketemu resep yang mengandung SEMUA bahan itu. Coba kurangi bahan atau ganti variasi.");
      return;
    }

    // 2) Ambil detail tiap meal agar dapat resep & negara
    const details = await Promise.all(intersection.slice(0, 20).map(fetchMealDetail));

    // 3) Render kartu
    results.innerHTML = "";
    details.forEach(meal => results.appendChild(buildMealCard(meal, ingredients)));
  } catch (err) {
    console.error(err);
    results.innerHTML = errorBox("Gagal mengambil data. Coba lagi sebentar.");
  }
}

async function fetchMealsByIngredient(ingredient) {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`;
  const res = await fetch(url);
  const data = await res.json();
  // hasil: { meals: [ {idMeal, strMeal, strMealThumb}, ... ] } atau { meals: null }
  return (data.meals || []).map(m => m.idMeal);
}

function intersectMealIds(arraysOfIds) {
  if (arraysOfIds.length === 0) return [];
  // mulai dari set pertama, lalu iriskan berturut-turut
  return arraysOfIds.reduce((acc, curr) => acc.filter(id => curr.includes(id)));
}

async function fetchMealDetail(mealId) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.meals ? data.meals[0] : null;
}

function buildMealCard(meal, wantedIngredients) {
  const node = tpl.content.cloneNode(true);
  node.querySelector(".thumb").src = meal.strMealThumb;
  node.querySelector(".thumb").alt = meal.strMeal;

  node.querySelector(".title").textContent = meal.strMeal;
  node.querySelector(".area").textContent = `Negara/Area asal: ${meal.strArea || "-"}`;

  // kumpulkan bahan dari strIngredient1..20 + ukurannya strMeasure1..20
  const ings = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const mea = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ings.push(`${ing}${mea && mea.trim() ? ` — ${mea}` : ""}`);
  }

  const ul = node.querySelector(".ingredients");
  ings.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    // highlight jika termasuk yang dicari
    const ingName = t.split(" — ")[0].trim().toLowerCase();
    if (wantedIngredients.some(w => ingName.includes(w))) li.style.fontWeight = "600";
    ul.appendChild(li);
  });

  node.querySelector(".instructions").textContent = (meal.strInstructions || "").trim();
  const yt = node.querySelector(".youtube");
  if (meal.strYoutube && meal.strYoutube.trim()) {
    yt.href = meal.strYoutube;
  } else {
    yt.style.display = "none";
  }

  return node;
}

/* UI helpers */
function loadingBox(text) {
  return `<div style="max-width:900px;margin:24px auto;padding:16px;border-radius:12px;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.06);text-align:center;">⏳ ${escapeHtml(text)}</div>`;
}
function infoBox(text) {
  return `<div style="max-width:900px;margin:24px auto;padding:16px;border-radius:12px;background:#fff0d6;border:1px solid #ffd18b;color:#7a4a00;">${escapeHtml(text)}</div>`;
}
function errorBox(text) {
  return `<div style="max-width:900px;margin:24px auto;padding:16px;border-radius:12px;background:#ffe2e2;border:1px solid #ffb4b4;color:#7a0000;">${escapeHtml(text)}</div>`;
}
function escapeHtml(s){return s.replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));}