import "./LocationDisplay.css";
import LocationSelector from "../LocationSelector/LocationSelector";
import WeatherContext from "../../contexts/WeatherContext";
import { useContext } from "react";

export default function LocationDisplay() {
  const { weatherData, weatherAPIkey } = useContext(WeatherContext);

  return (
    <div className="location-display">
      <div className="location-display__container">
        <p className="location-display__title">
          Current location:{" "}
          {weatherData?.city ? weatherData.city : "Loading..."}
        </p>
        <LocationSelector weatherAPIkey={weatherAPIkey} />
      </div>
    </div>
  );
}
