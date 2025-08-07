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
  const result = {};
  result.city = data.name;
  result.temp = {
    C: Math.round(data.main.temp),
    F: Math.round((data.main.temp * 9) / 5 + 32),
  };
  result.latitude = data.coord.lat;
  result.season = getSeasonType(result.temp.C, result.latitude);
  result.condition = data.weather[0].main.toLowerCase();
  result.id = data.weather[0].id;
  result.isDay = isDay(data.sys, Date.now());
  result.icon = data.weather[0].icon;
  return result;
};

export const filterOutdoor = (id) => {
  if (id >= 800 && id <= 804) {
    return true;
  } else {
    return false;
  }
};

export const isDay = ({ sunrise, sunset }, now) => {
  return sunrise * 1000 < now && now < sunset * 1000;
};

export const getSeasonType = (temp, latitude) => {
  const month = new Date().getMonth(); // 0 = Jan, 11 = Dec

  // Determine hemisphere
  const isNorthern = latitude >= 0;

  if (temp >= 22) {
    return "summer";
  } else if (temp <= 8) {
    return "winter";
  } else if (temp > 8 && temp < 22) {
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
