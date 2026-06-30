import { useEffect, useState } from "react";
import { dateFormatter, getWeatherIcon } from "../../utils/weather"
import { useQuery } from "@tanstack/react-query";
import { fetchWeatherApi } from "openmeteo";

export default function WeatherDaily() {
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

  useEffect(()=>{
    if (!geolocation.latitude) {
      getLocation()
    }
  },[geolocation])
  
  const success = (position: Position) => {
    setGeolocation({latitude: position.coords.latitude, longitude: position.coords.longitude});
  }
  
  const error = () => {
    alert("Sorry, no position available.");
  }

  // Helper function to form time ranges
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  const getDailyWeather = async (): Promise<DailyWeather> => {
    const params = {
      latitude: geolocation.latitude,
      longitude: geolocation.longitude,
	    daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
      timezone: "America/Chicago",
      forecast_days: 16,
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const daily = response.daily()!;

    return {
      time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
      ),
      weatherCode: daily.variables(0)!.valuesArray()!,
      temperatureMax: daily.variables(1)!.valuesArray()!,
      temperatureMin: daily.variables(2)!.valuesArray()!,
    }
  }

  const dailyWeatherQuery = useQuery({
    queryKey: ['daily-weather'],
    queryFn: () => getDailyWeather()
  })

  useEffect(()=>{
    const getWeatherDescriptions = async() => {
      const fetchedDescription = await getWeatherIcon();
      setWeatherDescription(fetchedDescription)
    };
    getWeatherDescriptions();
  },[dailyWeatherQuery.data])

  if (dailyWeatherQuery.isPending) {
    return <div>Loading...</div>
  }

  if (dailyWeatherQuery.isError) {
    return <div>Error: {dailyWeatherQuery.error.message}</div>
  }

  return <>
    {dailyWeatherQuery.data && dailyWeatherQuery.data.time && 
      <div>
        <h1 className="text-xl font-bold">Daily forecast:</h1>
        <ul>
          {dailyWeatherQuery.data.time.map((time,index)=>
            <li key={index}>{dateFormatter.format(time)} - {" "}
              <img 
                src={weatherDescription && 
                  weatherDescription[dailyWeatherQuery.data.weatherCode[index] as keyof WeatherDescriptions]["day"]["image"]}
                height={32}
                width={32}
                className="inline-block"
              ></img>
              <span>
                {dailyWeatherQuery.data.temperatureMin && 
                  Math.round(dailyWeatherQuery.data.temperatureMin[index])}
                {" "} to {" "}
              </span>
              <span>
                {dailyWeatherQuery.data.temperatureMax && 
                  Math.round(dailyWeatherQuery.data.temperatureMax[index])}
                °C
              </span>
            </li>
          )}
        </ul>
      </div>
    }
  </>
}