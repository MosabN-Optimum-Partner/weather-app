export interface Geocode {
  latitude: number;
  longitude: number;
  name: string;
}
export interface WeatherPreference {
  tempUnit: string;
  windUnit: string;
  precipUnit: string;
}

export interface DailyForecast {
  time: string;
  dayName: string;
  minTemp: number;
  maxTemp: number;
  hourlyTemps: number[];
  weatherCode: number;
  hourlyCodes: number[];
}

export async function fetchData(URL: string): Promise<any> {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`Message: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error", error);
    return null;
  }
}
interface WeatherAPI {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
}
export interface WeatherData {
  current: {
    time: string;
    temperature: number;
    humidity: number;
    precipitation: number;
    feelsLike: number;
    weatherCode: number;
    wind: number;
  };
  days: DailyForecast[];
}

export async function handleFetching(
  geocode: Geocode,
  preferences: WeatherPreference
) {
  const { latitude, longitude } = geocode;
  const { tempUnit, windUnit, precipUnit } = preferences;
  const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}&timezone=auto`;
  const data: WeatherAPI = await fetchData(URL);
  if (!data) {
    const content = document.querySelectorAll(".weather-container");
    const errorMsg = document.querySelector(".error-msg");

    errorMsg?.classList.remove("hidden");
    content.forEach((section) => section.classList.add("hidden"));
    return;
  }
  const formmatedData = transformData(data);
  console.log(formmatedData);
  return formmatedData;
}

function transformData(API: WeatherAPI): WeatherData {
  const days: DailyForecast[] = API.daily.time.map((time, i) => {
    const start = i * 24;
    const end = start + 24;
    return {
      time: time,
      dayName: new Date(time).toLocaleDateString("en-US", { weekday: "long" }),
      maxTemp: Math.round(API.daily.temperature_2m_max[i]!),
      minTemp: Math.round(API.daily.temperature_2m_min[i]!),
      weatherCode: API.daily.weather_code[i]!,
      hourlyTemps: API.hourly.temperature_2m.slice(start, end),
      hourlyCodes: API.hourly.weather_code.slice(start, end),
    };
  });
  return {
    current: {
      time: API.current.time,
      temperature: Math.round(API.current.temperature_2m),
      humidity: API.current.relative_humidity_2m,
      precipitation: API.current.precipitation,
      feelsLike: API.current.apparent_temperature,
      weatherCode: API.current.weather_code,
      wind: API.current.wind_speed_10m,
    },
    days: days,
  };
}

export async function getCity(city: string = "Amman"): Promise<Geocode | null> {
  const data = await fetchData(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
  );
  if (!data || !data.results || data.results.length === 0) {
    console.log("error");
    return null;
  }
  const result = data.results[0];

  return {
    latitude: result.latitude,
    longitude: result.longitude,
    name: result.name,
  };
}
