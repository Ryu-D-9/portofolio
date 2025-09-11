// Ambil & simpan user dari localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]"); // ambil array user
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users)); // simpan user ke localStorage
}

// DOM
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

// Register user baru
registerBtn?.addEventListener("click", () => {
  const users = getUsers();
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();

  if (!email || !pass) return alert("Isi email & password!");
  if (users.find(u => u.email === email)) return alert("Email sudah terdaftar!");

  users.push({ email, pass }); // simpan user baru
  saveUsers(users);
  alert("Registrasi berhasil, silakan login!");
});

// Login user
loginBtn?.addEventListener("click", () => {
  const users = getUsers();
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();

  const user = users.find(u => u.email === email && u.pass === pass);
  if (!user) return alert("Email / password salah!");

  localStorage.setItem("currentUser", JSON.stringify(user)); // simpan user aktif
  window.location.href = "dashboard.html"; // pindah ke dashboard
});