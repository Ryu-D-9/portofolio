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

// Deklarasi variabel musik
var music = document.getElementById("bg-music");
var musicBtn = document.getElementById("music-control");

// Fungsi Membuka Undangan
function bukaUndangan() {
    document.getElementById('cover').style.top = '-100vh';
    
    setTimeout(() => {
        document.getElementById('cover').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        
        // Memutar musik saat undangan dibuka
        music.play();
        
        // Menampilkan tombol kontrol musik di pojok kanan bawah
        if (musicBtn) {
            musicBtn.style.display = 'block';
        }
    }, 800);
}

// Fungsi untuk Play / Pause Musik
function toggleMusic() {
    if (music.paused) {
        music.play();
        musicBtn.innerHTML = "🎵"; // Ikon saat musik menyala
    } else {
        music.pause();
        musicBtn.innerHTML = "🔇"; // Ikon saat musik mati
    }
}

// --- SENSOR EFEK SCROLL (INTERSECTION OBSERVER) ---
document.addEventListener("DOMContentLoaded", function() {
    // Pengaturan sensor
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Animasi berputar saat 15% bagian elemen sudah terlihat di layar
    };

    // Membuat fungsi sensor
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Menambahkan efek muncul
                observer.unobserve(entry.target); // Supaya animasi hanya terjadi 1 kali (tidak mengulang saat discroll ke atas)
            }
        });
    }, observerOptions);

    // Mencari semua elemen yang memiliki class 'fade-up'
    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));
});
// ... (Biarkan fungsi salinRekening dan hitung mundur/Countdown Timer tetap ada di bawah sini) ...