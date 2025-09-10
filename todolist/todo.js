/* ================================
   To-Do List — LocalStorage + Date
   ================================ */
const STORAGE_KEY = "todo.items.v2";

// State
let items = load();
let currentFilter = "all";
let sortAsc = true;

// DOM
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const inputNew = $("#newTask");
const inputDate = $("#newDate");
const btnAdd = $("#addBtn");
const ulList = $("#list");
const textCounter = $("#counter");
const btnClearDone = $("#clearDone");
const btnSortDate = $("#sortDate");
const filterBtns = $$(".filters [data-filter]");

// Storage
function load(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

// Utils
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2);
const todayStr = () => new Date().toISOString().slice(0,10);
function compareDate(a,b){ if(!a) return 1; if(!b) return -1; return a.localeCompare(b); }
function dueBadge(dateStr){
  if(!dateStr) return "";
  const t = todayStr();
  if(dateStr < t)  return `<span class="badge overdue">Jatuh tempo</span>`;
  if(dateStr === t) return `<span class="badge today">Hari ini</span>`;
  return `<span class="badge">Jatuh tempo: ${dateStr}</span>`;
}

// Render
function render(){
  let shown = items.slice();
  if(currentFilter==="active") shown = shown.filter(i=>!i.done);
  if(currentFilter==="done")   shown = shown.filter(i=> i.done);
  shown.sort((a,b)=> sortAsc ? compareDate(a.date,b.date) : compareDate(b.date,a.date));

  ulList.innerHTML = "";
  shown.forEach(i=> ulList.appendChild(renderItem(i)));

  const left = items.filter(i=>!i.done).length;
  textCounter.textContent = `${items.length} tugas • ${left} belum selesai`;

  filterBtns.forEach(b=>{
    const active = b.dataset.filter===currentFilter;
    b.style.outline = active ? "2px solid rgba(124,92,255,.85)" : "1px solid rgba(255,255,255,.08)";
    b.style.opacity = active ? "1" : ".9";
  });
  btnSortDate.textContent = `Urutkan: Tanggal ${sortAsc ? "↑" : "↓"}`;
}

function renderItem(item){
  const li = document.createElement("li");
  li.dataset.id = item.id;

  const cb = document.createElement("input");
  cb.type = "checkbox"; cb.checked = item.done;
  cb.addEventListener("change", ()=>{ item.done = cb.checked; save(); render(); });

  const title = document.createElement("input");
  title.type="text"; title.className="title"+(item.done?" done":"");
  title.value=item.text; title.placeholder="Tugas tanpa judul";
  title.addEventListener("input",()=>{ item.text = title.value; save(); });
  title.addEventListener("keydown",e=>{ if(e.key==="Enter") title.blur(); });

  const right = document.createElement("div");
  right.style.display="grid";
  right.style.gridTemplateColumns="auto auto";
  right.style.gap="10px";
  right.style.alignItems="center";

  const dateInput = document.createElement("input");
  dateInput.type="date"; dateInput.value=item.date||"";
  dateInput.title="Ubah tanggal";
  dateInput.addEventListener("change",()=>{ item.date=dateInput.value; save(); render(); });

  const del = document.createElement("button");
  del.className="ghost danger"; del.textContent="Hapus";
  del.addEventListener("click",()=>{ items = items.filter(x=>x.id!==item.id); save(); render(); });

  right.append(dateInput, del);
  li.append(cb, title, right);

  const row2 = document.createElement("div");
  row2.className="date"; row2.style.gridColumn="1 / -1"; row2.style.marginLeft="34px";
  row2.innerHTML = dueBadge(item.date);
  li.appendChild(row2);

  return li;
}

// Actions
function addTask(){
  const text = (inputNew.value||"").trim();
  const date = inputDate.value;
  if(!text) return;
  items.unshift({ id: uid(), text, date, done:false });
  inputNew.value=""; inputDate.value="";
  save(); render();
}
function clearDone(){ items = items.filter(i=>!i.done); save(); render(); }
function setFilter(f){ currentFilter=f; render(); }
function toggleSort(){ sortAsc = !sortAsc; render(); }

// Events
btnAdd.addEventListener("click", addTask);
inputNew.addEventListener("keydown", e => { if(e.key==="Enter") addTask(); });
btnClearDone.addEventListener("click", clearDone);
btnSortDate.addEventListener("click", toggleSort);
filterBtns.forEach(b=> b.addEventListener("click",()=> setFilter(b.dataset.filter)));

// First render
render();