import "./LocationSelector.css";

import { useState, useContext } from "react";
import WeatherContext from "../../contexts/WeatherContext";
import { fetchCoordinatesByCity } from "../../utils/location";
import { getCurrentPosition } from "../../utils/geolocation";
import { getWeather, filterWeatherData } from "../../api/weatherApi";
import LoadingContext from "../../contexts/LoadingContext";

export default function LocationSelector() {
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const [cityInput, setCityInput] = useState("");
  const [error, setError] = useState("");

  const { setWeatherData, weatherAPIkey } = useContext(WeatherContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const coordinates = await fetchCoordinatesByCity(
        cityInput,
        weatherAPIkey
      );
      const weather = await getWeather(coordinates, weatherAPIkey);
      const filteredData = filterWeatherData(weather);
      setWeatherData(filteredData);
      setCityInput("");
    } catch (err) {
      setError("City not found. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseMyLocation = async () => {
    setIsLoading(true);
    setError("");
    setCityInput("");

    try {
      const coordinates = await getCurrentPosition();
      const weather = await getWeather(coordinates, weatherAPIkey);
      const filteredData = filterWeatherData(weather);
      setWeatherData(filteredData);
    } catch (err) {
      setError("Unable to get your location");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="location-selector">
      <button
        type="button"
        onClick={handleUseMyLocation}
        disabled={isLoading}
        className="location-selector__geolocation-btn"
      >
        📍 Use My Location
      </button>
      <form className="location-selector__form" onSubmit={handleSubmit}>
        <label className="location-selector__label">
          Choose Your City:
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="e.g. Seattle"
            required
            className="location-selector__input"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="location-selector__submit-btn"
        >
          {isLoading ? "Loading..." : "Update Location"}
        </button>
      </form>
      {error && <p className="location-selector__error">{error}</p>}
    </div>
  );
}
