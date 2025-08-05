import "./WeatherDisplay.css";

export default function WeatherDisplay({ weatherData }) {
  const icon = weatherData.icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  const celsiusTemperature = weatherData.temp["C"];
  const fahrenheitTemperature = weatherData.temp["F"];

  return (
    <div className="weather-display">
      <img src={iconUrl} alt="weather icon" className="weather-display__icon" />
      <p className="weather-display__temperature">
        {celsiusTemperature}&deg;C/
        {fahrenheitTemperature}
        &deg;F
      </p>
    </div>
  );
}
