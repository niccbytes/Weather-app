const apiKey = "8c4febd32c6b1c91aee4fdb805d2b5ea";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".Weather-icon");
const forecastContainer = document.getElementById("forecastContainer");

async function checkWeather(city) {
  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status === 404) {
      displayError("City not found");
      hideWeatherDetails();
    } else if (!response.ok) {
      displayError("Error fetching weather data");
      hideWeatherDetails();
    } else {
      const data = await response.json();
      updateWeatherUI(data);
      updateForecast(data.list);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    displayError("An unexpected error occurred");
    hideWeatherDetails();
  }
}

function updateForecast(forecastData) {
  forecastContainer.innerHTML = ""; // Clear previous forecast data

  for (let i = 0; i < forecastData.length; i += 8) {
    const day = forecastData[i];
    const date = new Date(day.dt * 1000);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

    const forecastDayElement = document.createElement("div");
    forecastDayElement.classList.add("forecast-day");

    forecastDayElement.innerHTML = `
      <p class="day-of-week">${dayOfWeek}</p>
      <img src="images/${day.weather[0].icon}.png" class="Weather-icon">
      <p class="temp">${day.main.temp.toFixed(1)}°C</p>
    `;

    forecastContainer.appendChild(forecastDayElement);
  }
}

function displayError(message) {
  const errorElement = document.querySelector(".error");
  errorElement.innerHTML = message;
  errorElement.style.display = "block";
}

function hideWeatherDetails() {
  document.querySelector(".Weather").style.display = "none";
}

function updateWeatherUI(data) {
  document.querySelector(".city").innerHTML = data.city.name;
  document.querySelector(".temp").innerHTML = data.list[0].main.temp.toFixed(1) + "°C";
  document.querySelector(".humidity").innerHTML = data.list[0].main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.list[0].wind.speed + " km/h";

  switch (data.list[0].weather[0].main) {
    case "Clouds":
      weatherIcon.src = "images/clouds.png";
      break;
    case "Clear":
      weatherIcon.src = "images/clear.png";
      break;
    case "Rain":
      weatherIcon.src = "images/rain.png";
      break;
    case "Drizzle":
      weatherIcon.src = "images/drizzle.png";
      break;
    case "Mist":
      weatherIcon.src = "images/mist.png";
      break;
    default:
      // Handle other weather conditions or provide a default icon
      break;
  }

  document.querySelector(".Weather").style.display = "block";
  document.querySelector(".error").style.display = "none";
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});
