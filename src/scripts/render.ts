import { userPreferenece } from "./dropdown.js";
import {
  getCity,
  handleFetching,
  type WeatherPreference,
  type WeatherData,
  type DailyForecast,
} from "./fetch.js";

const countryCity = document.querySelector(
  ".country-city"
) as HTMLHeadingElement;
const dayDate = document.querySelector(".day-date") as HTMLHeadingElement;
const currentTemp = document.querySelector(".current-temp") as HTMLSpanElement;
const searchBtn = document.querySelector(".search-button") as HTMLButtonElement;

const feelsLike = document.querySelector(".feelsLike") as HTMLParagraphElement;
const humidity = document.querySelector(".humidity") as HTMLParagraphElement;
const wind = document.querySelector(".wind") as HTMLParagraphElement;
const prec = document.querySelector(".precipitation") as HTMLParagraphElement;
const { Precipitation, Temperature, Wind } = JSON.parse(
  localStorage.getItem("userPreferenece") as string
);

function getWeatherIcon(code: number): string {
  if (code === 0) return "icon-sunny.webp";
  if (code >= 1 && code <= 3) return "icon-partly-cloudy.webp";
  if (code >= 45 && code <= 48) return "icon-fog.webp";
  if (code >= 51 && code <= 57) return "icon-drizzle.webp";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82))
    return "icon-rain.webp";
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86))
    return "icon-snow.webp";
  if (code >= 95 && code <= 99) return "icon-storm.webp";

  return "icon-overcast.svg";
}

searchBtn.addEventListener("click", () => handleSearch());
async function handleSearch() {
  console.log("click");

  const { Precipitation, Temperature, Wind } = JSON.parse(
    localStorage.getItem("userPreferenece") as string
  );
  const citySearchBar = document.querySelector(
    ".search-bar"
  ) as HTMLInputElement;
  const cityToSearch = citySearchBar.value.trim() || "Amman";
  const geocode = await getCity(cityToSearch);
  if (geocode) {
    const prefereneces: WeatherPreference = {
      windUnit: Wind.toLowerCase(),
      tempUnit: Temperature.toLowerCase(),
      precipUnit: Precipitation.toLowerCase(),
    };
    const data: WeatherData = (await handleFetching(
      geocode,
      prefereneces
    )) as WeatherData;
    if (data) {
      renderTodayContent(data, cityToSearch);
      renderMetaData(
        data.current.feelsLike,
        data.current.wind,
        data.current.humidity,
        data.current.precipitation
      );
      renderDaysCards(data.days);
      renderTimeTemps(data.days);
      return;
    }
    const content = document.querySelectorAll(".weather-container");
    const errorMsg = document.querySelector(".error-msg");

    errorMsg?.classList.remove("hidden");
    content.forEach((section) => section.classList.add("hidden"));
    return;
  }
}
function renderTodayContent(data: WeatherData, city: string) {
  const date = new Date(data.current.time).toLocaleDateString("en-GB");
  const dayName = new Date(data.current.time).toLocaleDateString("en-US", {
    weekday: "long",
  });
  const mainIcon = document.querySelector(
    ".main-weather-icon"
  ) as HTMLImageElement;
  if (mainIcon) {
    const iconName = getWeatherIcon(data.current.weatherCode);
    mainIcon.src = `../../assets/images/${iconName}`;
  }
  const cityWrapper = document.querySelector(
    ".city-date-wrapper"
  ) as HTMLDivElement;
  cityWrapper.classList.remove("hide-content");
  countryCity.textContent = city;
  dayDate.textContent = `${dayName}, ${date}`;
  currentTemp.textContent = `${data.current.temperature}°`;
}
function renderMetaData(
  feel: number,
  windSpeed: number,
  humidityValue: number,
  precipitation: number
) {
  const { Precipitation, Temperature, Wind } = JSON.parse(
    localStorage.getItem("userPreferenece") as string
  );

  const unit = Wind === "mph" ? "mph" : "km/h";
  feelsLike.textContent = `${feel}°`;
  humidity.textContent = `${humidityValue}%`;
  wind.textContent = `${windSpeed} ${unit}`;
  prec.textContent = `${precipitation} ${Precipitation}`;
}
function renderDaysCards(days: DailyForecast[]) {
  const weekContainer = document.querySelector(
    ".week-forecast"
  ) as HTMLDivElement;
  if (!weekContainer) return;
  weekContainer.innerHTML = "";
  const elementBlueprint = `<p class="week-day"></p>
                <img
                  src=""
                  class="daily-img"
                  alt="weather icon"
                />
                <div class="d-data">
                  <p class="data max"></p>
                  <p class="data min"></p>
                </div>
              `;

  days?.forEach((day, index) => {
    const iconName = getWeatherIcon(day.weatherCode);
    const card = document.createElement("div");
    card.className = "card flex border-r";
    card.innerHTML = elementBlueprint;
    card.dataset.index = index.toString();
    const weekDay = card.querySelector(".week-day") as HTMLHeadElement;
    weekDay.textContent = day.dayName.slice(0, 3);
    const icon = card.querySelector("img") as HTMLImageElement;
    icon.setAttribute("src", `../../assets/images/${iconName}`);

    const maxTemp = card.querySelector(".max") as HTMLHeadElement;
    maxTemp.textContent = `${day.maxTemp}°`;

    const minTemp = card.querySelector(".min") as HTMLHeadElement;
    minTemp.textContent = `${day.minTemp}°`;
    card.addEventListener("click", () => {
      renderTimeTemps(days, index);
    });
    weekContainer.append(card);
  });
}
function renderTimeTemps(days: DailyForecast[], index: number = 0) {
  const hoursWeather = document.querySelector(
    ".hours-weather"
  ) as HTMLDivElement;
  if (!hoursWeather) return;

  const selectedDay = days[index];
  if (!selectedDay) return;

  const temps = selectedDay.hourlyTemps;
  const codes = selectedDay.hourlyCodes;

  hoursWeather.innerHTML = "";

  const elementBlueprint = `
              <div class="uflex row gap-0-5 center-V">
                <img src="" alt=""><span class="hour"></span>
              </div>
              <span class="hour-temp"></span>`;

  temps.forEach((temp, index) => {
    const hoursCard = document.createElement("div") as HTMLDivElement;
    hoursCard.className = "hours-card uflex row";
    hoursCard.innerHTML = elementBlueprint;
    const icon = hoursCard.querySelector("img") as HTMLImageElement;
    const iconName = getWeatherIcon(codes[index] ?? 0);
    icon.setAttribute("src", `../../assets/images/${iconName}`);

    const ampm = index >= 12 ? "PM" : "AM";
    const displayHour = index % 12 === 0 ? 12 : index % 12;
    const hour = hoursCard.querySelector(".hour") as HTMLSpanElement;
    hour.textContent = `${displayHour} ${ampm}`;

    const hourTemp = hoursCard.querySelector(".hour-temp") as HTMLSpanElement;
    hourTemp.textContent = `${Math.round(temp)}°`;
    hoursWeather.appendChild(hoursCard);
  });
}
handleSearch();
