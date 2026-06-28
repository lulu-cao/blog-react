import { useEffect, useState } from "react";
import { getWeatherIcon, getWeatherDescription, timeFormatter } from "../utils/weather"

export default function WeatherHourly({hourlyWeatherData}:{hourlyWeatherData: HourlyWeather}) {
  const [weatherDescription, setWeatherDescription] = useState({} as WeatherDescriptions);
  
  useEffect(()=>{
    const getWeatherDescriptions = async() => {
      const fetchedDescription = await getWeatherIcon();
      setWeatherDescription(fetchedDescription)
    };
    getWeatherDescriptions();
  },[hourlyWeatherData])

  return <>
    {hourlyWeatherData && hourlyWeatherData.time && 
      <div>
        <h1 className="text-xl font-bold">Hourly forecast:</h1>
        <ol>
          {hourlyWeatherData.time.map((time,index)=>
            <li key={index}>
              {timeFormatter.format(time)}
               {/* - {" "} */}
              {/* <span>
                {hourlyWeatherData.weatherCode && 
                  getWeatherDescription(hourlyWeatherData.weatherCode[index])}
                {" "}-{" "}
              </span> */}
              <img 
                src={weatherDescription && 
                  weatherDescription[hourlyWeatherData.weatherCode[index]]["day"]["image"]}
                height={32}
                width={32}
                className="inline-block"
              ></img>
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
  </>
}