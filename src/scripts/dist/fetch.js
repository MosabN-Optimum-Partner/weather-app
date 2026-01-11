export async function fetchData(URL) {
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Message: ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error("Error", error);
        return null;
    }
}
export async function handleFetching(geocode, preferences) {
    const { latitude, longitude } = geocode;
    const { tempUnit, windUnit, precipUnit } = preferences;
    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}&timezone=auto`;
    const data = await fetchData(URL);
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
function transformData(API) {
    const days = API.daily.time.map((time, i) => {
        const start = i * 24;
        const end = start + 24;
        return {
            time: time,
            dayName: new Date(time).toLocaleDateString("en-US", { weekday: "long" }),
            maxTemp: Math.round(API.daily.temperature_2m_max[i]),
            minTemp: Math.round(API.daily.temperature_2m_min[i]),
            weatherCode: API.daily.weather_code[i],
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
export async function getCity(city = "Amman") {
    const data = await fetchData(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
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
//# sourceMappingURL=fetch.js.map