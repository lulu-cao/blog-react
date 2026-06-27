"use client"

import { fetchWeatherApi } from "openmeteo";
import { useState } from "react";

type weatherCode = 0|1|2|3|45|48|51|53|55|56|57;

type CurrentWeather = {
  temperature: number,
  weatherCode: number,
}

type HourlyWeather = {
  time: Date[],
  weatherCode: Float32Array,
  temperature_2m: Float32Array | null,
}

type DailyWeather = {
  time: Date[],
  weatherCode: Float32Array,
  temperatureMax: Float32Array,
  temperatureMin: Float32Array,  
}

type Position = {
  coords: {
    latitude: number,
    longitude: number,
  }
}

type Geolocation = {
  latitude: number,
  longitude: number,
}

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

export default function Weather() {
  const [currentWeatherData, setCurrentWeatherData] = useState({} as CurrentWeather);
  const [hourlyWeatherData, setHourlyWeatherData] = useState({} as HourlyWeather);
  const [dailyWeatherData, setDailytWeatherData] = useState({} as DailyWeather);
  const [geolocation, setGeolocation] = useState({} as Geolocation)
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else { 
      console.error("Geolocation is not supported by this browser.")
    }
  }
  
  const success = (position: Position) => {
    setGeolocation({latitude: position.coords.latitude, longitude: position.coords.longitude})
    alert("Success");
  }
  
  const error = () => {
    alert("Sorry, no position available.");
  }

  const getWeatherDescription = (code: number) => {
    if (code in weatherCodeMap) {
      return weatherCodeMap[code as weatherCode]
    } else {
      return `code ${code}`
    }
  }

  // Helper function to form time ranges
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  const refreshWeather = async (): Promise<void> => {
    if (!geolocation.latitude) {
      console.error("Geolocation not provided");
      return;
    };

    const params = {
      latitude: geolocation.latitude,
      longitude: geolocation.longitude,
      current: 'temperature_2m,weather_code',
      hourly: "weather_code,temperature_2m",
      daily: 'weather_code,temperature_2m_max,temperature_2m_min'
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    
    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    setCurrentWeatherData({
      temperature: current.variables(0)!.value(), 
      weatherCode: current.variables(1)!.value(),
    })

    setHourlyWeatherData({
      time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
      ),
      weatherCode: hourly.variables(0)!.valuesArray()!,
      temperature_2m: hourly.variables(0)!.valuesArray(),      
    })

    setDailytWeatherData({
      time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
      ),
      weatherCode: daily.variables(0)!.valuesArray()!,
      temperatureMax: daily.variables(1)!.valuesArray()!,
      temperatureMin: daily.variables(2)!.valuesArray()!,
    })
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "America/Chicago",
  })

  return <div>
    <div>
      <button onClick={getLocation}>Get Location</button>
    </div>
    <div>
      <button onClick={refreshWeather}>Refresh Weather</button>
    </div>
    {currentWeatherData && currentWeatherData.temperature &&
      <div>
        <h1 className="text-xl font-bold">Current temperature: </h1>
        <p>{Math.round(currentWeatherData.temperature)} degrees</p>
      </div>
    }
    {hourlyWeatherData && hourlyWeatherData.time && 
      <div>
        <h1 className="text-xl font-bold">Hourly forecast:</h1>
        <ol>
          {hourlyWeatherData.time.map((time,index)=>
            <li key={index}>{formatter.format(time)} - {" "}
              <span>
                {hourlyWeatherData.weatherCode && 
                  getWeatherDescription(hourlyWeatherData.weatherCode[index])}
                {" "}-{" "}
              </span>
              <span>
                {hourlyWeatherData.temperature_2m && 
                  Math.round(hourlyWeatherData.temperature_2m[index])}
                {" "}degrees
              </span>
            </li>
          )}
        </ol>
      </div>
    }
    {dailyWeatherData && dailyWeatherData.time && 
      <div>
        <h1 className="text-xl font-bold">Daily forecast:</h1>
        <ul>
          {dailyWeatherData.time.map((time,index)=>
            <li key={index}>{formatter.format(time)} - {" "}
              <span>
                {dailyWeatherData.weatherCode && 
                  getWeatherDescription(dailyWeatherData.weatherCode[index])}
                {" "}-{" "}
              </span>
              <span>
                {dailyWeatherData.temperatureMin && 
                  Math.round(dailyWeatherData.temperatureMin[index])}
                {" "} to {" "}
              </span>
              <span>
                {dailyWeatherData.temperatureMax && 
                  Math.round(dailyWeatherData.temperatureMax[index])}
                {" "}degrees
              </span>
            </li>
          )}
        </ul>
      </div>
    }
  </div>
}