import { useEffect, useState } from "react";
import { getWeatherIcon } from "../../utils/weather"

export default function WeatherCurrent ({currentWeatherData}:{currentWeatherData:CurrentWeather}) {
  const [weatherDescription, setWeatherDescription] = useState({} as WeatherDescriptions);
  
  useEffect(()=>{
    const getWeatherDescriptions = async() => {
      const fetchedDescription = await getWeatherIcon();
      setWeatherDescription(fetchedDescription)
    };
    getWeatherDescriptions();
  },[currentWeatherData])

  return <>
    {currentWeatherData && currentWeatherData.temperature &&
      <div>
        <img 
          src={weatherDescription && 
            weatherDescription[currentWeatherData.weatherCode]["day"]["image"]}
          height={32}
          width={32}
          className="inline-block"
        ></img>
        <span>
          {Math.round(currentWeatherData.temperature)}°C
        </span> 
      </div>
    }
  </>
}