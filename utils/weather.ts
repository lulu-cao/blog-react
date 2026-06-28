const weatherCodeMap: Record<WeatherCode, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

export const getWeatherDescription = (code: number) => {
  if (code in weatherCodeMap) {
    return weatherCodeMap[code as WeatherCode]
  } else {
    return `code ${code}`
  }
}

export const getWeatherIcon = async (): Promise<WeatherDescriptions> => {
  const url = "https://gist.githubusercontent.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c/raw/76b0cb0ef0bfd8a2ec988aa54e30ecd1b483495d/descriptions.json";
  let fetchedDescription = {} as WeatherDescriptions;
  await fetch(url)
    .then((response)=>{
      if (!response.ok) {
        console.error("Failed to fetch weather description");
        console.log(response)
      }
      return response.json();
    })
    .then((description)=>{
      fetchedDescription = description;
    });
  return fetchedDescription;
}

export const timeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeStyle: "long",
  timeZone: "America/Chicago",
})

export const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
})

