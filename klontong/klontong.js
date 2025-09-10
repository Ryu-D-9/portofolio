const products = [
  {id:1, name:"Kaos Hitam", category:"fashion", price:50000, img:"https://via.placeholder.com/200x150?text=Kaos"},
  {id:2, name:"Celana Jeans", category:"fashion", price:120000, img:"https://via.placeholder.com/200x150?text=Jeans"},
  {id:3, name:"Laptop", category:"elektronik", price:5000000, img:"https://via.placeholder.com/200x150?text=Laptop"},
  {id:4, name:"Headset", category:"elektronik", price:200000, img:"https://via.placeholder.com/200x150?text=Headset"},
  {id:5, name:"Nasi Goreng", category:"makanan", price:25000, img:"https://via.placeholder.com/200x150?text=Nasi+Goreng"},
  {id:6, name:"Burger", category:"makanan", price:30000, img:"https://via.placeholder.com/200x150?text=Burger"}
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById("productList");
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const search = document.getElementById("search");

// checkout
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");
const notification = document.getElementById("notification");

// render products
function renderProducts(filter="all", keyword="") {
  productList.innerHTML = "";
  products
    .filter(p => (filter==="all" || p.category===filter))
    .filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()))
    .forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>Rp ${p.price.toLocaleString()}</p>
        <button class="add" onclick="addToCart(${p.id})">Tambah</button>
      `;
      productList.appendChild(card);
    });
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item,i) => {
    total += item.price;
    const li = document.createElement("li");
    li.textContent = `${item.name} - Rp ${item.price.toLocaleString()}`;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = total.toLocaleString();
  cartCount.textContent = cart.length;
}

// modal
cartBtn.onclick = () => cartModal.style.display = "block";
closeCart.onclick = () => cartModal.style.display = "none";
window.onclick = (e) => { if(e.target == cartModal) cartModal.style.display = "none"; }

// checkout modal
checkoutBtn.onclick = () => {
  cartModal.style.display = "none";
  checkoutModal.style.display = "block";
};
closeCheckout.onclick = () => checkoutModal.style.display = "none";
window.onclick = (e) => { if(e.target == checkoutModal) checkoutModal.style.display = "none"; }

// submit checkout
checkoutForm.onsubmit = (e) => {
  e.preventDefault();
  checkoutModal.style.display = "none";
  cart = [];
  localStorage.removeItem("cart");
  updateCart();

  notification.style.display = "block";
  setTimeout(()=> notification.style.display="none", 3000);
};

// filter
document.querySelectorAll(".filters button").forEach(btn=>{
  btn.addEventListener("click", ()=> renderProducts(btn.dataset.filter, search.value));
});

// search
search.addEventListener("input", ()=> renderProducts("all", search.value));

// init
renderProducts();
updateCart();