// Fungsi Membuka Undangan
function bukaUndangan() {
    document.getElementById('cover').style.top = '-100vh';
    setTimeout(() => {
        document.getElementById('cover').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 800);
}

// Fungsi Salin Rekening
function salinRekening(id) {
    var rek = document.getElementById(id).innerText;
    navigator.clipboard.writeText(rek);
    alert("Nomor rekening berhasil disalin: " + rek);
}

// Fungsi Countdown Timer
var countDownDate = new Date("Sep 5, 2026 07:00:00").getTime();
var x = setInterval(function() {
    var now = new Date().getTime();
    var distance = countDownDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("hari").innerHTML = days;
    document.getElementById("jam").innerHTML = hours;
    document.getElementById("menit").innerHTML = minutes;
    document.getElementById("detik").innerHTML = seconds;

    if (distance < 0) {
        clearInterval(x);
        document.querySelector(".countdown").innerHTML = "Acara Telah Berlangsung";
    }
}, 1000);