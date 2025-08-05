export const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
};

export const getWeather = ({ latitude, longitude }, APIkey) => {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIkey}`
  ).then(checkResponse);
};

export const filterWeatherData = (data) => {
  const result = {};
  result.city = data.name;
  result.temp = {
    C: Math.round(data.main.temp),
    F: Math.round((data.main.temp * 9) / 5 + 32),
  };
  result.type = getSeasonType(result.temp.C);
  result.condition = data.weather[0].main.toLowerCase();
  result.isDay = isDay(data.sys, Date.now());
  result.icon = data.weather[0].icon;
  return result;
};

const isDay = ({ sunrise, sunset }, now) => {
  return sunrise * 1000 < now && now < sunset * 1000;
};

const getSeasonType = (temp) => {
  if (temp >= 25) {
    return "summer";
  } else if (temp >= 15 && temp < 25) {
    return "spring";
  } else if (temp >= 5 && temp < 15) {
    return "fall";
  } else {
    return "winter";
  }
};
