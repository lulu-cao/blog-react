"use client"

import { fetchWeatherApi } from "openmeteo";
import { useState } from "react";
import WeatherHourly from "./weather-hourly";
import WeatherDaily from "./weather-daily";
import WeatherCurrent from "./weather-current";

export default function Weather() {
  const [currentWeatherData, setCurrentWeatherData] = useState({} as CurrentWeather);
  const [hourlyWeatherData, setHourlyWeatherData] = useState({} as HourlyWeather);
  const [dailyWeatherData, setDailytWeatherData] = useState({} as DailyWeather);
  const [geolocation, setGeolocation] = useState({} as UserGeolocation)
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else { 
      console.error("Geolocation is not supported by this browser.")
    }
  }
  
  const success = (position: Position) => {
    setGeolocation({latitude: position.coords.latitude, longitude: position.coords.longitude});
  }
  
  const error = () => {
    alert("Sorry, no position available.");
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
      current: ["temperature_2m", "weather_code", "is_day"],
      hourly: ["weather_code", "temperature_2m"],
	    daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    console.log("Refreshing weather");

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    setCurrentWeatherData({
      temperature: current.variables(0)!.value(), 
      weatherCode: current.variables(1)!.value() as WeatherCode,
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

  return <div>
    <div>
      <button onClick={getLocation}>Get Location</button>
    </div>
    <div>
      <button onClick={refreshWeather}>Refresh Weather</button>
    </div>
    <WeatherCurrent 
      currentWeatherData={currentWeatherData as CurrentWeather} 
    />
    <WeatherDaily dailyWeatherData={dailyWeatherData as DailyWeather} />
    <WeatherHourly hourlyWeatherData={hourlyWeatherData as HourlyWeather} />
  </div>
}