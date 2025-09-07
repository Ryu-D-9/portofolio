const apiKey = "d042368b6874927fae1947b8c1efe0df"; 
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");

searchBtn.addEventListener("click", getWeather);

function getWeather() {
  const city = cityInput.value.trim();
  if (city === "") return;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=id`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === "404") {
        weatherResult.innerHTML = `<p>Kota tidak ditemukan 😢</p>`;
      } else {
        const temp = data.main.temp;
        const desc = data.weather[0].description;
        const icon = data.weather[0].icon;

        weatherResult.innerHTML = `
          <h2>${data.name}</h2>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon">
          <p><b>${temp}°C</b></p>
          <p>${desc}</p>
        `;
      }
    })
    .catch(error => {
      weatherResult.innerHTML = `<p>Error: ${error.message}</p>`;
    });

  cityInput.value = "";
}