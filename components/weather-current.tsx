import { getWeatherDescription } from "../utils/weather"

export default function WeatherCurrent ({currentWeatherData}:{currentWeatherData:CurrentWeather}) {
  return <>
    {currentWeatherData && currentWeatherData.temperature &&
      <div>
        <h1 className="text-xl font-bold">Current temperature: </h1>
        <p>
          {getWeatherDescription(currentWeatherData.weatherCode)}
          {" "}-{" "}
          {Math.round(currentWeatherData.temperature)} degrees
        </p> 
      </div>
    }
  </>
}