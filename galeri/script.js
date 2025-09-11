const images = document.querySelectorAll(".falling img");
const imgs = document.querySelectorAll(".falling img");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.getElementById("close");

imgs.forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
  });
});

closeBtn.onclick = () => modal.style.display = "none";
modal.onclick = (e) => { if(e.target === modal) modal.style.display = "none"; };
images.forEach(img => {
  // posisi horizontal random
  img.style.left = Math.random() * 90 + "%";

  // durasi jatuh random (6s – 12s)
  img.style.animationDuration = (6 + Math.random() * 6) + "s";

  // delay random supaya jatuhnya nggak barengan
  img.style.animationDelay = Math.random() * 8 + "s";
});