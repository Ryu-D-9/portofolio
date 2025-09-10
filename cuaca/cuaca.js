const API_KEY = "d042368b6874927fae1947b8c1efe0df"; // ganti dengan API key OpenWeatherMap
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherDiv = document.getElementById("weather");
const forecastDiv = document.getElementById("forecast");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

async function fetchWeather(city) {
  try {
    // data sekarang
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=id`
    );
    const data = await res.json();

    if (data.cod !== 200) {
      weatherDiv.innerHTML = `<p>Kota tidak ditemukan ❌</p>`;
      return;
    }

    const { main, weather, wind, sys, name } = data;
    const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    // ubah background sesuai kondisi
    document.body.style.background = weather[0].main.includes("Rain")
      ? "linear-gradient(to right, #2c3e50, #3498db)"
      : "linear-gradient(to right, #2980b9, #6dd5fa)";

    // sunrise/sunset
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString("id-ID");
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString("id-ID");

    weatherDiv.innerHTML = `
      <h2>${name}</h2>
      <img src="${icon}" alt="icon">
      <p><strong>${main.temp}°C</strong> | ${weather[0].description}</p>
      <p>Kelembaban: ${main.humidity}%</p>
      <p>Angin: ${wind.speed} m/s</p>
      <p>🌅 ${sunrise} | 🌇 ${sunset}</p>
    `;

    // forecast 5 hari
    fetchForecast(city);
  } catch (err) {
    weatherDiv.innerHTML = `<p>Error mengambil data ⚠️</p>`;
  }
}

async function fetchForecast(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=id`
  );
  const data = await res.json();

  forecastDiv.innerHTML = "<h3>Prakiraan 5 Hari</h3>";

  // ambil 1 data per 24 jam (jam 12 siang)
  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  daily.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString("id-ID", { weekday:"long", day:"numeric", month:"short" });
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

    forecastDiv.innerHTML += `
      <div class="forecast-day">
        <h4>${date}</h4>
        <img src="${icon}" alt="">
        <p>${item.main.temp}°C</p>
        <small>${item.weather[0].description}</small>
      </div>
    `;
  });
}