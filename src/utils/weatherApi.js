export const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
};

export const getWeather = ({ latitude, longitude }, weatherAPIkey) => {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherAPIkey}`
  ).then(checkResponse);
};

export const filterWeatherData = (data) => {
  const tempC = Math.round(data.main.temp);
  const id = data.weather[0].id;

  const result = {
    city: data.name,
    temp: {
      C: tempC,
      F: Math.round((tempC * 9) / 5 + 32),
    },
    latitude: data.coord.lat,
    season: getSeasonType(Math.round(tempC), data.coord.lat),
    isOutdoor: isOutdoor(id, tempC),
    condition: data.weather[0].main.toLowerCase(),
    id,
    isDay: isDay(data.sys, Date.now()),
    icon: data.weather[0].icon,
  };

  return result;
};

export const isOutdoor = (id, tempC) => {
  const goodWeatherCodes = [701, 711, 721, 731, 741];
  const goodWeather = (id >= 800 && id <= 804) || goodWeatherCodes.includes(id);
  const comfortableTemp = tempC >= -5 && tempC <= 35;
  return goodWeather && comfortableTemp;
};

export const isDay = ({ sunrise, sunset }, now) => {
  return sunrise * 1000 < now && now < sunset * 1000;
};

export const getSeasonType = (tempC, latitude) => {
  const month = new Date().getMonth(); // 0 = Jan, 11 = Dec

  // Determine hemisphere
  const isNorthern = latitude >= 0;

  if (tempC >= 22) {
    return "summer";
  } else if (tempC <= 8) {
    return "winter";
  } else if (tempC > 8 && tempC < 22) {
    if (
      (isNorthern && month >= 2 && month <= 4) || // March–May
      (!isNorthern && month >= 8 && month <= 10) // Sept–Nov
    ) {
      return "spring";
    } else if (
      (isNorthern && month >= 8 && month <= 10) || // Sept–Nov
      (!isNorthern && month >= 2 && month <= 4) // March–May
    ) {
      return "fall";
    } else {
      // If not clearly spring or fall, default to spring
      return "spring";
    }
  }
};
