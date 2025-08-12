import "./WeatherDisplay.css";
import WeatherContext from "../../contexts/WeatherContext";
import { useContext } from "react";

export default function WeatherDisplay() {
  const { weatherData } = useContext(WeatherContext);

  const icon = weatherData.icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  const celsiusTemperature = weatherData.temp["C"];
  const fahrenheitTemperature = weatherData.temp["F"];

  return (
    <div className="weather-display">
      <p className="weather-display__title">Current weather:</p>
      <div className="weather-display__container">
        <img
          src={iconUrl}
          alt="weather icon"
          className="weather-display__icon"
        />
        <p className="weather-display__temperature">
          {celsiusTemperature}&deg;C/
          {fahrenheitTemperature}
          &deg;F
        </p>
      </div>
    </div>
  );
}
