import { useEffect, useState } from "react";
import { getWeatherIcon, timeFormatter } from "../../utils/weather"
import { fetchWeatherApi } from "openmeteo";
import { useQuery } from "@tanstack/react-query";

export default function WeatherHourly() {
  const [weatherDescription, setWeatherDescription] = useState({} as WeatherDescriptions);
  
  const [geolocation, setGeolocation] = useState({} as UserGeolocation)

  const getLocation = () => {
    console.log("Getting location")
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

  const getHourlyWeather = async (): Promise<HourlyWeather> => {
    if (!geolocation.latitude) {
      getLocation();
      throw new Error("Geolocation not available")
    };
    
    const params = {
      latitude: geolocation.latitude,
      longitude: geolocation.longitude,
      hourly: ["weather_code", "temperature_2m"],
      timezone: "America/Chicago",
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly()!;

    return {
      time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
      ),
      weatherCode: hourly.variables(0)!.valuesArray()!,
      temperature_2m: hourly.variables(1)!.valuesArray(), 
    }
  }

  const hourlyWeatherQuery = useQuery({
    queryKey: ['hourly-weather'],
    queryFn: () => getHourlyWeather()
  })

  useEffect(()=>{
    const getWeatherDescriptions = async() => {
      const fetchedDescription = await getWeatherIcon();
      setWeatherDescription(fetchedDescription)
    };
    getWeatherDescriptions();
  },[hourlyWeatherQuery.data])

  if (hourlyWeatherQuery.isPending) {
    return <div>Loading...</div>
  }

  if (hourlyWeatherQuery.isError) {
    return <div>Error: {hourlyWeatherQuery.error.message}</div>
  }

  return <>
    {hourlyWeatherQuery.data && hourlyWeatherQuery.data.time && 
      <div>
        <h1 className="text-xl font-bold">Hourly forecast:</h1>
        <ol>
          {hourlyWeatherQuery.data.time.map((time,index)=>{
            {/* Could also just set `forecast_days` to 1 in api params */}
            const today = new Date();
            if (time.toDateString() == today.toDateString()) {
              return <li key={index}>
                  {timeFormatter.format(time)}
                  <img 
                    src={weatherDescription && 
                      weatherDescription[hourlyWeatherQuery.data.weatherCode[index] as keyof WeatherDescriptions]["day"]["image"]}
                    height={32}
                    width={32}
                    className="inline-block"
                  ></img>
                  <span>
                    {hourlyWeatherQuery.data.temperature_2m && 
                      Math.round(hourlyWeatherQuery.data.temperature_2m[index])}
                    °C
                  </span>
                </li>
              }
            }
          )}
        </ol>
      </div>
    }
  </>
}