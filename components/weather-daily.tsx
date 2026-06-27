import { getWeatherDescription, dateFormatter } from "../utils/weather"

export default function WeatherDaily({dailyWeatherData}:{dailyWeatherData: DailyWeather}) {
  return <>
    {dailyWeatherData && dailyWeatherData.time && 
      <div>
        <h1 className="text-xl font-bold">Daily forecast:</h1>
        <ul>
          {dailyWeatherData.time.map((time,index)=>
            <li key={index}>{dateFormatter.format(time)} - {" "}
              <span>
                {dailyWeatherData.weatherCode && 
                  getWeatherDescription(dailyWeatherData.weatherCode[index])}
                {" "}-{" "}
              </span>
              <span>
                {dailyWeatherData.temperatureMin && 
                  Math.round(dailyWeatherData.temperatureMin[index])}
                {" "} to {" "}
              </span>
              <span>
                {dailyWeatherData.temperatureMax && 
                  Math.round(dailyWeatherData.temperatureMax[index])}
                {" "}degrees
              </span>
            </li>
          )}
        </ul>
      </div>
    }
  </>
}