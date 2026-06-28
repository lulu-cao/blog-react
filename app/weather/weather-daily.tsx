import { useEffect, useState } from "react";
import { dateFormatter, getWeatherIcon } from "../../utils/weather"

export default function WeatherDaily({dailyWeatherData}:{dailyWeatherData: DailyWeather}) {
  const [weatherDescription, setWeatherDescription] = useState({} as WeatherDescriptions);
  
  useEffect(()=>{
    const getWeatherDescriptions = async() => {
      const fetchedDescription = await getWeatherIcon();
      setWeatherDescription(fetchedDescription)
    };
    getWeatherDescriptions();
  },[dailyWeatherData])

  return <>
    {dailyWeatherData && dailyWeatherData.time && 
      <div>
        <h1 className="text-xl font-bold">Daily forecast:</h1>
        <ul>
          {dailyWeatherData.time.map((time,index)=>
            <li key={index}>{dateFormatter.format(time)} - {" "}
              <img 
                src={weatherDescription && 
                  weatherDescription[dailyWeatherData.weatherCode[index] as keyof WeatherDescriptions]["day"]["image"]}
                height={32}
                width={32}
                className="inline-block"
              ></img>
              <span>
                {dailyWeatherData.temperatureMin && 
                  Math.round(dailyWeatherData.temperatureMin[index])}
                {" "} to {" "}
              </span>
              <span>
                {dailyWeatherData.temperatureMax && 
                  Math.round(dailyWeatherData.temperatureMax[index])}
                °C
              </span>
            </li>
          )}
        </ul>
      </div>
    }
  </>
}