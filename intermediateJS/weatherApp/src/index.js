require("./index.css");

function getWeatherData(location) {
  // Implementation for fetching weather data
  return fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today/tomorrow?key=TTTCSZ9RG8DRY7VZCN2XWGF9K`,
  )
    .then((response) => response.json())
    .then((data) => {
      return {
        location: location,
        condition: data.currentConditions.conditions,
        temperature: data.currentConditions.temp,
        data:data
      };
    });
}

function loadWeatherIcon(icon) {
  return import(`./icons/${icon}.svg`)
    .catch(() => import("./icons/default.svg"))
    .then((iconModule) => iconModule.default);
}

async function displayWeatherData(weatherData) {
  const icon = weatherData.data.currentConditions.icon;
  const iconSrc = await loadWeatherIcon(icon);
  const root = document.getElementById("root");
  root.innerHTML = `
    <h1>Weather in ${weatherData.location}</h1>
    <img src="${iconSrc}" alt="${weatherData.condition}" class="weather-icon" />
    <p>Condition: ${weatherData.condition}</p>
    <p id="weather-temp">Temperature: ${weatherData.temperature}°F</p>
  `;
  setWeatherBackground(icon);
}

const WEATHER_CLASSES = [
    "weather-clear",
    "weather-rain",
    "weather-snow",
    "weather-thunder",
    "weather-clouds",
    "weather-fog",
    "weather-wind",
    "weather-default",
];

function getWeatherClass(icon) {
  if (icon.includes("thunder")) return "weather-thunder";
  if (icon.includes("rain") || icon.includes("showers")) return "weather-rain";
  if (icon.includes("snow") || icon.includes("sleet")) return "weather-snow";
  if (icon.includes("clear")) return "weather-clear";
  if (icon.includes("cloudy")) return "weather-clouds";
  if (icon.includes("fog")) return "weather-fog";
  if (icon.includes("wind")) return "weather-wind";
  return "weather-default";
}

function setWeatherBackground(icon) {
    document.body.classList.remove(...WEATHER_CLASSES);
    document.body.classList.add(getWeatherClass(icon));
}

const root = document.getElementById("root");
const controls = document.createElement("div");
controls.id = "controls";
document.body.insertBefore(controls, root);

function makeform() {
  const form = document.createElement("form");
  form.innerHTML = `
    <input type="text" name="location" placeholder="Enter location" required />
    <button type="submit">Get Weather</button>
  `;
  controls.appendChild(form);
}

makeform();

const form = document.querySelector("form");
form.addEventListener("submit", formSubmitHandler);

const loadingIndicator = document.createElement("div");
loadingIndicator.id = "loading-indicator";
loadingIndicator.textContent = "Loading weather...";
loadingIndicator.classList.add("hidden");
controls.appendChild(loadingIndicator);

function showLoading() {
  loadingIndicator.classList.remove("hidden");
}

function hideLoading() {
  loadingIndicator.classList.add("hidden");
}

showLoading();
getWeatherData("New York")
  .then((weatherData) => displayWeatherData(weatherData))
  .finally(hideLoading);

function formSubmitHandler(event) {
  event.preventDefault();
  const location = event.target.location.value;
  showLoading();
  getWeatherData(location)
    .then((weatherData) => displayWeatherData(weatherData))
    .finally(hideLoading);
}

function farenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

const celsiusTemp = farenheitToCelsius(77);
console.log(celsiusTemp);

const celsiusFarenheightToggle = document.createElement("button");
celsiusFarenheightToggle.textContent = "Toggle Celsius/Fahrenheit";
controls.appendChild(celsiusFarenheightToggle);

celsiusFarenheightToggle.addEventListener("click", () => {
  const tempElement = document.getElementById("weather-temp");
  const currentTemp = parseFloat(tempElement.textContent.split(": ")[1]);
  if (tempElement.textContent.includes("°F")) {
    const celsiusTemp = farenheitToCelsius(currentTemp);
    tempElement.textContent = `Temperature: ${celsiusTemp.toFixed(2)}°C`;
  } else {
    const fahrenheitTemp = (currentTemp * 9 / 5) + 32;
    tempElement.textContent = `Temperature: ${fahrenheitTemp.toFixed(2)}°F`;
  }
});
console.log(getWeatherData("New York"));
