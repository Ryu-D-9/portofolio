/* ================================
   To-Do List — LocalStorage Ready
   ================================ */

// KONFIG: key penyimpanan di browser
const STORAGE_KEY = "todo.items.v1";

// ---- State ----
let items = load();        // [{id, text, done}]
let currentFilter = "all"; // 'all' | 'active' | 'done'

// ---- Ambil elemen DOM ----
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const inputNew = $("#newTask");
const btnAdd = $("#addBtn");
const ulList = $("#list");
const textCounter = $("#counter");
const btnClearDone = $("#clearDone");
const filterBtns = $$(".filters [data-filter]");

// ---- Util ----
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// =================== Render ===================
function render() {
  // 1) tentukan data yang ditampilkan berdasar filter
  let shown = items;
  if (currentFilter === "active") shown = items.filter(i => !i.done);
  if (currentFilter === "done")   shown = items.filter(i =>  i.done);

  // 2) render list
  ulList.innerHTML = "";
  shown.forEach(item => ulList.appendChild(renderItem(item)));

  // 3) counter
  const left = items.filter(i => !i.done).length;
  textCounter.textContent = `${items.length} tugas • ${left} belum selesai`;

  // 4) highlight tombol filter aktif
  filterBtns.forEach(b => {
    const active = b.dataset.filter === currentFilter;
    b.style.outline = active ? "2px solid rgba(124,92,255,.8)" : "1px solid rgba(255,255,255,.08)";
    b.style.opacity = active ? "1" : ".85";
  });
}

function renderItem(item) {