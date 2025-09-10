// Modal
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const caption = document.getElementById("caption");
const span = document.getElementsByClassName("close")[0];

document.querySelectorAll(".gallery img").forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "block";
    modalImg.src = img.src;
    caption.innerHTML = img.alt;
  });
});

span.onclick = () => { modal.style.display = "none"; };
modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };