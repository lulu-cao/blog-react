import { getWeatherDescription, timeFormatter } from "../utils/weather"

export default function WeatherHourly({hourlyWeatherData}:{hourlyWeatherData: HourlyWeather}) {
  return <>
    {hourlyWeatherData && hourlyWeatherData.time && 
      <div>
        <h1 className="text-xl font-bold">Hourly forecast:</h1>
        <ol>
          {hourlyWeatherData.time.map((time,index)=>
            <li key={index}>{timeFormatter.format(time)} - {" "}
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
  </>
}