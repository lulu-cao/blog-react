"use client"

import { fetchWeatherApi } from "openmeteo";
import { skipToken, useQuery } from '@tanstack/react-query';

export default function WeatherCurrent(
  {geolocation, weatherDescription}:{geolocation: UserGeolocation, weatherDescription:WeatherDescriptions}
) {
  const getCurrentWeather = async (latitude?: number, longitude?: number): Promise<CurrentWeather> => {
    console.log("getting current weather");
    if (!latitude || !longitude) {
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
    queryFn: geolocation ? 
      () => getCurrentWeather(geolocation.latitude, geolocation.longitude) 
      : 
      skipToken,
    staleTime: 60 * 60 * 1000,
  });

  if (currentWeatherQuery.isPending) {
    return <span>Loading...</span>
  }

  if (currentWeatherQuery.isError) {
    return <span>Error: {currentWeatherQuery.error.message}</span>
  }

  return (
    <>
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
    </>
  )
}