// ====== Cek login ======
if (!localStorage.getItem("currentUser")) {
  window.location.href = "index.html";
}

// ====== Logout ======
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

// ====== Ayat Random ======
async function getRandomAyat() {
  const surah = Math.floor(Math.random() * 114) + 1;
  const ayah = Math.floor(Math.random() * 7) + 1;
  const res = await fetch(`https://api.quran.gading.dev/surah/${surah}/${ayah}`);
  const data = await res.json();

  document.getElementById("ayatArab").textContent = data.data.text.arab;
  document.getElementById("ayatID").textContent = data.data.translation.id;

  // simpan sementara di sessionStorage untuk favorit
  sessionStorage.setItem("lastAyat", JSON.stringify(data.data));
}

// ====== Jadwal Sholat ======
async function getPrayerTimes(city="Jakarta") {
  const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia`);
  const data = await res.json();
  const timings = data.data.timings;
  const hijri = data.data.date.hijri;

  const list = document.getElementById("prayerTimes");
  list.innerHTML = "";
  for (let [name, time] of Object.entries(timings)) {
    if (["Sunset", "Imsak", "Midnight"].includes(name)) continue;
    const li = document.createElement("li");
    li.textContent = `${name}: ${time}`;
    list.appendChild(li);
  }
  document.getElementById("hijriDate").textContent =
    `Tanggal Hijriyah: ${hijri.day} ${hijri.month.en} ${hijri.year}`;
}

// ====== Search Surah ======
document.getElementById("searchSurahBtn").addEventListener("click", async () => {
  const num = document.getElementById("surahInput").value;
  if (!num) return alert("Masukkan nomor surah 1-114!");
  const res = await fetch(`https://api.quran.gading.dev/surah/${num}`);
  const data = await res.json();
  const surah = data.data;

  document.getElementById("surahResult").innerHTML = `
    <p><b>${surah.name.transliteration.id}</b> (${surah.name.translation.id})</p>
    <p>Jumlah Ayat: ${surah.numberOfVerses}</p>
    <p>Tempat Turun: ${surah.revelation.id}</p>
  `;
});

// ====== Search Hadits ======
document.getElementById("searchHadithBtn").addEventListener("click", async () => {
  const num = document.getElementById("hadithInput").value;
  if (!num) return alert("Masukkan nomor hadits!");
  const res = await fetch(`https://api.hadith.gading.dev/books/muslim/${num}`);
  const data = await res.json();
  const hadith = data.data;

  document.getElementById("hadithResult").innerHTML = `
    <p><b>Hadits Muslim no. ${num}</b></p>
    <p>${hadith.contents.arab}</p>
    <p><i>${hadith.contents.id}</i></p>
  `;

  sessionStorage.setItem("lastHadith", JSON.stringify(hadith));
});

// ====== Simpan Favorit ======
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}
function saveFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}
function renderFavorites() {
  const favs = getFavorites();
  const list = document.getElementById("favoritesList");
  list.innerHTML = "";
  favs.forEach((f, i) => {
    const li = document.createElement("li");
    li.textContent = `${f.type}: ${f.text}`;
    list.appendChild(li);
  });
}

document.getElementById("saveAyatBtn").addEventListener("click", () => {
  const lastAyat = JSON.parse(sessionStorage.getItem("lastAyat"));
  if (!lastAyat) return alert("Tidak ada ayat untuk disimpan!");
  const favs = getFavorites();
  favs.push({ type: "Ayat", text: lastAyat.translation.id });
  saveFavorites(favs);
  renderFavorites();
});

document.getElementById("saveHadithBtn").addEventListener("click", () => {
  const lastHadith = JSON.parse(sessionStorage.getItem("lastHadith"));
  if (!lastHadith) return alert("Tidak ada hadits untuk disimpan!");
  const favs = getFavorites();
  favs.push({ type: "Hadits", text: lastHadith.contents.id });
  saveFavorites(favs);
  renderFavorites();
});

// ====== Dropdown Kota ======
document.getElementById("citySelect").addEventListener("change", (e) => {
  getPrayerTimes(e.target.value);
});

// ====== Jalankan saat load ======
getRandomAyat();
getPrayerTimes("Bandung");
renderFavorites();