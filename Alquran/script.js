/* ==========================
   UTIL & STATE
========================== */
const grid = document.getElementById('grid');
const search = document.getElementById('search');
const drawer = document.getElementById('drawer');
const closeBtn = document.getElementById('close');
const ayahList = document.getElementById('ayahList');
const titleEl = document.getElementById('title');
const subtitleEl = document.getElementById('subtitle');
const tabQuran = document.getElementById('tabQuran');
const tabHadith = document.getElementById('tabHadith');
const quranSection = document.getElementById('quranSection');
const hadithSection = document.getElementById('hadithSection');

let SURAH = [];       // cache daftar surah
let currentAudio;     // audio player aktif

/* ==========================
   UI: TAB SWITCH
========================== */
tabQuran.onclick = () => {
  tabQuran.classList.add('active'); tabHadith.classList.remove('active');
  quranSection.style.display = 'block'; hadithSection.classList.remove('active');
}
tabHadith.onclick = () => {
  tabHadith.classList.add('active'); tabQuran.classList.remove('active');
  quranSection.style.display = 'none'; hadithSection.classList.add('active');
}
drawer.addEventListener("click", (e) => {
  if (e.target === drawer) {   // hanya kalau klik di luar sheet
    drawer.classList.remove("open");
    if (currentAudio) currentAudio.pause();
  }
});

/* ==========================
   FETCH: DAFTAR SURAH
========================== */
async function loadSurah(){
  const res = await fetch('https://api.quran.gading.dev/surah');
  const data = await res.json();
  SURAH = data.data;           // simpan ke cache
  renderGrid(SURAH);           // tampilkan grid
}
loadSurah();

/* ==========================
   RENDER: GRID SURAH
========================== */
function renderGrid(list){
  grid.innerHTML = '';
  list.forEach(s => {
    const card = document.createElement('div');
    card.className = 'card';
    card.title = 'Klik untuk membuka';

    // nomor di kiri
    const num = document.createElement('div');
    num.className = 'num';
    num.textContent = s.number;

    // teks tengah
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `
      <h3>${s.name.transliteration.id} <small style="color:var(--muted)">• ${s.name.translation.id}</small></h3>
      <small>${s.revelation.id} • ${s.numberOfVerses} ayat</small>
    `;

    // nama arab kanan
    const ar = document.createElement('div');
    ar.className = 'arab';
    ar.textContent = s.name.short;

    card.append(num, meta, ar);
    card.addEventListener('click', () => openSurah(s.number, s));
    grid.appendChild(card);
  });
}

/* ==========================
   SEARCH: nomor atau nama
========================== */
search.addEventListener('input', e=>{
  const q = e.target.value.trim().toLowerCase();
  if(!q) return renderGrid(SURAH);
  const byNum = Number(q);
  const filtered = SURAH.filter(s=>{
    const translit = s.name.transliteration.id.toLowerCase();
    const trans = s.name.translation.id.toLowerCase();
    return (byNum && s.number===byNum) || translit.includes(q) || trans.includes(q);
  });
  renderGrid(filtered);
});

/* ==========================
   QUICK CHIPS
========================== */
document.querySelectorAll('.chip[data-surah]').forEach(ch=>{
  ch.addEventListener('click', async ()=>{
    const token = ch.dataset.surah; // "2:255" atau "36"
    if(token.includes(':')){
      // Ayat Kursi spesial
      const [s,a] = token.split(':');
      const res = await fetch(`https://api.quran.gading.dev/surah/${s}/${a}`);
      const d = await res.json();
      openSurah(+s, null, d.data);   // buka panel & fokus satu ayat
    }else{
      openSurah(+token);
    }
    window.scrollTo({top:0,behavior:'smooth'});
  })
});

/* ==========================
   DETAIL SURAH + AUDIO
========================== */
async function openSurah(no, surahMeta=null, singleAyah=null){
  drawer.classList.add('open');
  ayahList.innerHTML = '<div class="ayah"><small>Memuat...</small></div>';

  // Ambil meta bila belum
  if(!surahMeta){
    surahMeta = SURAH.find(s=>s.number===no);
  }
  titleEl.textContent = `${surahMeta.number}. ${surahMeta.name.transliteration.id}`;
  subtitleEl.textContent = `${surahMeta.name.translation.id} • ${surahMeta.revelation.id} • ${surahMeta.numberOfVerses} ayat`;

  // Ambil isi ayat
  let verses = [];
  if(singleAyah){
    verses = [singleAyah];
  }else{
    const res = await fetch(`https://api.quran.gading.dev/surah/${no}`);
    const data = await res.json();
    verses = data.data.verses;
  }

  // Render ayat
  ayahList.innerHTML = '';
  verses.forEach((v, idx)=>{
    const row = document.createElement('div');
    row.className = 'ayah';
    row.innerHTML = `
      <div class="row">
        <div class="num">${v.number.inSurah}</div>
        <button class="play">▶️ Putar</button>
      </div>
      <div class="ar">${v.text.arab}</div>
      <div class="id">${v.translation.id}</div>
      <audio preload="none" src="${v.audio.primary}"></audio>
    `;
    // kontrol play
    const btn = row.querySelector('.play');
    const audio = row.querySelector('audio');
    btn.addEventListener('click', ()=>{
      // stop audio lain
      if(currentAudio && currentAudio!==audio){ currentAudio.pause(); }
      if(audio.paused){ audio.play(); btn.textContent='⏸️ Jeda'; currentAudio = audio; }
      else{ audio.pause(); btn.textContent='▶️ Putar'; }
      audio.onended = ()=>{ btn.textContent='▶️ Putar'; }
    });
    ayahList.appendChild(row);
  });
}
closeBtn.onclick = ()=>{ drawer.classList.remove('open'); if(currentAudio) currentAudio.pause(); };

/* ==========================
   HADITS: cari kitab + nomor
========================== */
document.getElementById('findHadith').addEventListener('click', async ()=>{
  const book = document.getElementById('book').value; // bukhari | muslim
  const n = document.getElementById('hadNo').value.trim();
  if(!n) return alert('Masukkan nomor hadits');

  const box = document.getElementById('hadithResult');
  box.innerHTML = '<div class="card">Memuat…</div>';
  try{
    const res = await fetch(`https://api.hadith.gading.dev/books/${book}/${n}`);
    const data = await res.json();
    const h = data.data;
    box.innerHTML = `
      <div class="card">
        <div class="meta">
          <h3>Hadits ${book[0].toUpperCase()+book.slice(1)} No. ${n}</h3>
          <small>Sumber: api.hadith.gading.dev</small>
        </div>
        <div class="arabic" style="grid-column:1/-1;margin-top:8px">${h.contents.arab}</div>
        <div style="color:var(--muted);margin-top:6px">${h.contents.id}</div>
      </div>
    `;
  }catch(e){
    box.innerHTML = `<div class="card">Gagal memuat hadits.</div>`;
  }
});

async function loadPrayerTimes() {
  if (!navigator.geolocation) {
    document.getElementById("location").textContent = "Lokasi tidak tersedia.";
    return;
  }

  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    document.getElementById("location").textContent = 
      `Lokasi: ${lat.toFixed(2)}, ${lon.toFixed(2)}`;

    try {
      const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`);
      const data = await res.json();
      const times = data.data.timings;

      const list = document.getElementById("prayTimes");
      list.innerHTML = `
        <li>Subuh: ${times.Fajr}</li>
        <li>Dzuhur: ${times.Dhuhr}</li>
        <li>Ashar: ${times.Asr}</li>
        <li>Maghrib: ${times.Maghrib}</li>
        <li>Isya: ${times.Isha}</li>
      `;
    } catch (err) {
      document.getElementById("prayTimes").innerHTML = "<li>Gagal memuat jadwal.</li>";
    }
  }, () => {
    document.getElementById("location").textContent = "Izin lokasi ditolak.";
  });
}

loadPrayerTimes();

const toggleBtn = document.getElementById("themeToggle");

// Cek mode terakhir di localStorage
if (localStorage.getItem("theme") === "light") {
  document.documentElement.setAttribute("data-theme", "light");
  toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
  if (document.documentElement.getAttribute("data-theme") === "light") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "☀️";
  }
});
