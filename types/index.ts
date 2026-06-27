type weatherCode = 0 | 1 | 2 | 3 | 45 | 48 | 51 | 53 | 55 | 56 | 57 | 61 | 63 | 65 | 66 | 67 | 71 | 73 | 75 | 77 | 80 | 81 | 82 | 85 | 86 | 95 | 96 | 99;

type CurrentWeather = {
  temperature: number,
  weatherCode: number,
}

type HourlyWeather = {
  time: Date[],
  weatherCode: Float32Array,
  temperature_2m: Float32Array | null,
}

type DailyWeather = {
  time: Date[],
  weatherCode: Float32Array,
  temperatureMax: Float32Array,
  temperatureMin: Float32Array,  
}

type Position = {
  coords: {
    latitude: number,
    longitude: number,
  }
}

type UserGeolocation = {
  latitude: number,
  longitude: number,
}