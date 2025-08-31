import "./LocationSelector.css";

import { useState, useContext } from "react";
import WeatherContext from "../../contexts/WeatherContext";
import { fetchCoordinatesByCity } from "../../utils/location";
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

  return (
    <div className="location-selector">
      <form className="location-selector__form" onSubmit={handleSubmit}>
        <label className="location-selector__label">
          Choose Your City:
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="e.g. Cincinnati"
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
