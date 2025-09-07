document.getElementById("addBtn").addEventListener("click", function () {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const taskList = document.getElementById("taskList");

  if (taskInput.value.trim() === "") {
    alert("Tugas tidak boleh kosong!");
    return;
  }

  // Format tanggal
  let formattedDate = "Tanpa tanggal";
  if (dateInput.value) {
    const date = new Date(dateInput.value);
    formattedDate = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  // buat elemen <li>
  const li = document.createElement("li");

  // buat span teks tugas
  const span = document.createElement("span");
  span.textContent = `${taskInput.value} (📅 ${formattedDate})`;

  // tombol hapus
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Hapus";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.addEventListener("click", function () {
    taskList.removeChild(li);
  });

  // tombol edit
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.style.marginLeft = "5px";
  editBtn.addEventListener("click", function () {
    const newTask = prompt("Edit tugas:", taskInput.value);
    const newDate = prompt("Edit tanggal (dd/mm/yyyy):", formattedDate);

    if (newTask !== null && newTask.trim() !== "") {
      span.textContent = `${newTask} (📅 ${newDate || "Tanpa tanggal"})`;
    }
  });

  // susun elemen
  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  // reset input
  taskInput.value = "";
  dateInput.value = "";
});