"use client"

import WeatherHourly from "./weather-hourly";
import WeatherDaily from "./weather-daily";

export default function Weather(
  {geolocation,weatherDescription}:{geolocation:UserGeolocation,weatherDescription:WeatherDescriptions}
) {

  return <div>
    <WeatherDaily geolocation={geolocation} weatherDescription={weatherDescription} />
    <WeatherHourly geolocation={geolocation} weatherDescription={weatherDescription} />
  </div>
}