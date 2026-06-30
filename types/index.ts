type WeatherCode = 0 | 1 | 2 | 3 | 45 | 48 | 51 | 53 | 55 | 56 | 57 | 61 | 63 | 65 | 66 | 67 | 71 | 73 | 75 | 77 | 80 | 81 | 82 | 85 | 86 | 95 | 96 | 99;
type WeatherCodes = "0" | "1" | "2" | "3" | "45" | "48" | "51" | "53" | "55" | "56" | "57" | "61" | "63" | "65" | "66" | "67" | "71" | "73" | "75" | "77" | "80" | "81" | "82" | "85" | "86" | "95" | "96" | "99";

// const weatherCodesMap = {
//   0: "0",
//   1: "1",
//   2: "2",
//   3: "3",
//   45: "45",
//   48: "48",
//   51: "51",
//   53: "53",
//   55: "55",
//   56: "56",
//   57: "57",
//   61: "61",
//   63: "63",
//   65: "65",
//   66: "66",
//   67: "67",
//   71: "71",
//   73: "73",
//   75: "75",
//   77: "77",
//   80: "80",
//   81: "81",
//   82: "82",
//   85: "85",
//   86: "86",
//   95: "95",
//   96: "96",
//   99: "99",
// }

// type WeatherCodes = typeof weatherCodesMap[keyof typeof weatherCodesMap]

interface CurrentWeather {
  temperature: number,
  weatherCode: WeatherCode,
  isDay?: number,
}

// const buffer = new ArrayBuffer(4);
// const float32 = new Float32Array(buffer) as Float32Array;
// const float32 = new Float32Array(
//   [0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99]
// );

interface HourlyWeather {
  time: Date[],
  weatherCode: Float32Array,
  temperature_2m: Float32Array | null,
  isDay?: number,
}

interface DailyWeather {
  time: Date[],
  weatherCode: Float32Array,
  temperatureMax: Float32Array,
  temperatureMin: Float32Array,  
}

interface KeyedDailyWeather {
  time: {
    time: Date,
    id: string,
  }[],
  weatherCode: Float32Array,
  temperatureMax: Float32Array,
  temperatureMin: Float32Array,
}

interface Position {
  coords: {
    latitude: number,
    longitude: number,
  }
}

interface UserGeolocation {
  latitude: number,
  longitude: number,
}

interface WeatherDescription {
  "day": {
    "description": string,
    "image": string,
  },
  "night": {
    "description": string,
    "image": string,
  }
}

type WeatherDescriptions = Record<WeatherCode, WeatherDescription>
// interface WeatherDescriptions {
//   "0": WeatherDescription,
//   "1": WeatherDescription,
//   "2": WeatherDescription,
//   "3": WeatherDescription,
//   "45": WeatherDescription,
//   "48": WeatherDescription,
//   "51": WeatherDescription,
//   "53": WeatherDescription,
//   "55": WeatherDescription,
//   "56": WeatherDescription,
//   "57": WeatherDescription,
//   "61": WeatherDescription,
//   "63": WeatherDescription,
//   "65": WeatherDescription,
//   "66": WeatherDescription,
//   "67": WeatherDescription,
//   "71": WeatherDescription,
//   "73": WeatherDescription,
//   "75": WeatherDescription,
//   "77": WeatherDescription,
//   "80": WeatherDescription,
//   "81": WeatherDescription,
//   "82": WeatherDescription,
//   "85": WeatherDescription,
//   "86": WeatherDescription,
//   "95": WeatherDescription,
//   "96": WeatherDescription,
//   "99": WeatherDescription,
// }