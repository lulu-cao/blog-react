import { fetchWeatherApi } from "openmeteo";

export default async function Weather() {
  // const x = window.document.getElementById("weather");
  // function getLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(success, error);
  //   } else { 
  //     x.innerHTML = "Geolocation is not supported by this browser.";
  //   }
  // }
  // function success(position) {
  //   x.innerHTML = "Latitude: " + position.coords.latitude +
  //   "<br>Longitude: " + position.coords.longitude;
  // }
  // function error() {
  //   alert("Sorry, no position available.");
  // }
  const params = {
    latitude: 39.11,
    longitude: -94.59,
    current: 'temperature_2m,weather_code',
    hourly: "weather_code,temperature_2m",
    daily: 'weather_code,temperature_2m_max,temperature_2m_min'
  };
  type weatherCode = 0|1|2|3|45|48|51|53|55|56|57;
  const weatherCodeMap: Record<weatherCode, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
  }
  const getWeatherDescription = (code: number) => {
    if (code in weatherCodeMap) {
      return weatherCodeMap[code as weatherCode]
    } else {
      return `code ${code}`
    }
  }
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // Helper function to form time ranges
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];
  const utcOffsetSeconds = response.utcOffsetSeconds();

  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    current: {
      temperature: current.variables(0)!.value(), // Current is only 1 value, therefore `.value()`
      weatherCode: current.variables(1)!.value(),
    },
    hourly: {
      time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
      ),
      weatherCode: hourly.variables(0)!.valuesArray()!,
      temperature_2m: hourly.variables(0)!.valuesArray(),
    },
    daily: {
      time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
      ),
      weatherCode: daily.variables(0)!.valuesArray()!,
      temperatureMax: daily.variables(1)!.valuesArray()!,
      temperatureMin: daily.variables(2)!.valuesArray()!,
    }
  };

  // The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
  console.log("\nhourly data:\n", weatherData.hourly)
  const formatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "America/Chicago",
  })

  return <div>
    {/* <button onClick={getLocation}>Get Weather</button> */}
    <div id="weather"></div>
    <div>
      <h1 className="text-xl font-bold">Current temperature: </h1>
      <p>{Math.round(weatherData.current.temperature)} degrees</p>
    </div>
    <div>
      <h1 className="text-xl font-bold">Hourly forecast:</h1>
      <ol>
        {weatherData.hourly.time.map((time,index)=>
          <li key={index}>{formatter.format(time)} - {" "}
            <span>
              {weatherData.hourly.weatherCode && 
                getWeatherDescription(weatherData.hourly.weatherCode[index])}
              {" "}-{" "}
            </span>
            <span>
              {weatherData.hourly.temperature_2m && 
                Math.round(weatherData.hourly.temperature_2m[index])}
              {" "}degrees
            </span>
          </li>
        )}
      </ol>
    </div>
    <div>
      <h1 className="text-xl font-bold">Daily forecast:</h1>
      <ul>
        {weatherData.daily.time.map((time,index)=>
          <li key={index}>{formatter.format(time)} - {" "}
            <span>
              {weatherData.daily.weatherCode && 
                getWeatherDescription(weatherData.daily.weatherCode[index])}
              {" "}-{" "}
            </span>
            <span>
              {weatherData.daily.temperatureMin && 
                Math.round(weatherData.daily.temperatureMin[index])}
              {" "} to {" "}
            </span>
            <span>
              {weatherData.daily.temperatureMax && 
                Math.round(weatherData.daily.temperatureMax[index])}
              {" "}degrees
            </span>
          </li>
        )}
      </ul>
    </div>
  </div>
}