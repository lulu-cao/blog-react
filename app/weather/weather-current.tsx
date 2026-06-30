"use client"

import { fetchWeatherApi } from "openmeteo";
import { useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { getWeatherIcon } from "@/utils/weather";

export default function WeatherCurrent() {
  const [geolocation, setGeolocation] = useState({} as UserGeolocation)
  const [weatherDescription, setWeatherDescription] = useState({} as WeatherDescriptions);
  
  const getLocation = () => {
    console.log("Getting location")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
    } else { 
      console.error("Geolocation is not supported by this browser.")
    }
  }
  
  const geolocationSuccess = (position: Position) => {
    setGeolocation({latitude: position.coords.latitude, longitude: position.coords.longitude});
  }
  
  const geolocationError = () => {
    alert("Sorry, no position available.");
  }

  const getCurrentWeather = async (latitude?: number, longitude?: number): Promise<CurrentWeather> => {
    console.log("Getting current weather");
    if (!geolocation.latitude) {
      getLocation();
      throw new Error("Geolocation not available")
    };

    const params = {
      latitude: latitude || geolocation.latitude,
      longitude: longitude || geolocation.longitude,
      current: ["temperature_2m", "weather_code", "is_day"],
      timezone: "America/Chicago",
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
    const current = response.current()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    return {
      temperature: current.variables(0)!.value(), 
      weatherCode: current.variables(1)!.value() as WeatherCode,
      isDay: current.variables(2)!.value()
    }
  }

  const currentWeatherQuery = useQuery({
    queryKey: ['current-weather'],
    queryFn: () => getCurrentWeather(),
  })

  useEffect(()=>{
    const getWeatherDescriptions = async() => {
      const fetchedDescription = await getWeatherIcon();
      setWeatherDescription(fetchedDescription)
    };
    getWeatherDescriptions();
  },[currentWeatherQuery.data])

  if (currentWeatherQuery.isPending) {
    return <span>Loading...</span>
  }

  if (currentWeatherQuery.isError) {
    return <span>Error: {currentWeatherQuery.error.message}</span>
  }

  return (
    <div>
      {currentWeatherQuery.data.isDay == 0 ? 
        <img 
          src={weatherDescription && 
            weatherDescription[currentWeatherQuery.data.weatherCode]["night"]["image"]}
          alt={weatherDescription && 
            weatherDescription[currentWeatherQuery.data.weatherCode]["night"]["description"]}
          height={32}
          width={32}
          className="inline-block"
        />
        :
        <img 
          src={weatherDescription && 
            weatherDescription[currentWeatherQuery.data.weatherCode]["day"]["image"]}
          alt={weatherDescription && 
            weatherDescription[currentWeatherQuery.data.weatherCode]["day"]["description"]}
          height={32}
          width={32}
          className="inline-block"
        />
      }
      <span>
        {Math.round(currentWeatherQuery.data.temperature)}°C
      </span> 
    </div>
  )
}