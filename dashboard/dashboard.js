// ===== Cek login =====
if (!localStorage.getItem("currentUser")) {
  window.location.href = "index.html"; // jika belum login, kembali ke login
}

// ====== Logout ======
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

// ====== Data Produk (LocalStorage) ======
function getProducts() {
  return JSON.parse(localStorage.getItem("products") || "[]");
}
function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// ====== Render Tabel Produk ======
const tableBody = document.querySelector("#productTable tbody");

function renderProducts() {
  const products = getProducts();
  tableBody.innerHTML = "";

  products.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.stock}</td>
      <td>Rp ${p.price}</td>
      <td>
        <button onclick="editProduct(${i})">Edit</button>
        <button onclick="deleteProduct(${i})">Hapus</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  renderChart(); // update grafik setiap render
}

// ====== Tambah Produk ======
document.getElementById("addProduct").addEventListener("click", () => {
  const name = document.getElementById("productName").value.trim();
  const stock = +document.getElementById("productStock").value;
  const price = +document.getElementById("productPrice").value;

  if (!name || !stock || !price) return alert("Isi semua data!");

  const products = getProducts();
  products.push({ name, stock, price });
  saveProducts(products);
  renderProducts();

  // reset input
  document.getElementById("productName").value = "";
  document.getElementById("productStock").value = "";
  document.getElementById("productPrice").value = "";
});

// ====== Edit Produk ======
window.editProduct = (i) => {
  const products = getProducts();
  const p = products[i];

  const name = prompt("Nama:", p.name);
  const stock = prompt("Stok:", p.stock);
  const price = prompt("Harga:", p.price);

  if (name && stock && price) {
    products[i] = { name, stock: +stock, price: +price };
    saveProducts(products);
    renderProducts();
  }
};

// ====== Hapus Produk ======
window.deleteProduct = (i) => {
  const products = getProducts();
  products.splice(i, 1);
  saveProducts(products);
  renderProducts();
};

// ====== Chart.js ======
let stockChart, lowStockChart;

function renderChart() {
  const products = getProducts();

  // Chart semua produk
  const labels = products.map(p => p.name);
  const stocks = products.map(p => p.stock);

  const ctx = document.getElementById("stockChart").getContext("2d");
  if (stockChart) stockChart.destroy();

  stockChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Stok Produk", data: stocks, backgroundColor: "#7c5cff" }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  // Chart 5 stok terendah
  const sorted = [...products].sort((a, b) => a.stock - b.stock).slice(0, 5);
  const lowLabels = sorted.map(p => p.name);
  const lowStocks = sorted.map(p => p.stock);

  const ctxLow = document.getElementById("lowStockChart").getContext("2d");
  if (lowStockChart) lowStockChart.destroy();

  lowStockChart = new Chart(ctxLow, {
    type: "bar",
    data: {
      labels: lowLabels,
      datasets: [{ label: "Stok Terendah", data: lowStocks, backgroundColor: "#ff5e62" }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

// ====== First render ======
renderProducts();