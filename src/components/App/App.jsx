import { useEffect, useState } from "react";

import "./App.css";

import Header from "../Header/Header";
import Main from "../Main/Main";
import FilterContextProvider from "../FilterContextProvider/FilterContextProvider";

import UserContext from "../../contexts/UserContext";
import WeatherContext from "../../contexts/WeatherContext";
import ActivitiesContext from "../../contexts/ActivitiesContext";

import activitiesData from "../../../db.json";

import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import { fetchCoordinatesByCity } from "../../utils/location";
import { weatherAPIkey } from "../../constants/apiEndpoints";

export default function App() {
  const [weatherData, setWeatherData] = useState({
    city: "",
    temp: { F: 999, C: 999 },
    latitude: "",
    season: "",
    isOutdoor: false,
    condition: "",
    id: "",
    isDay: true,
    icon: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModal, setActiveModal] = useState("");

  // const handleSignupClick = () => {
  //   setActiveModal("register-modal");
  //   setIsMobileMenuActive(false);
  // };

  // const handleLoginClick = () => {
  //   setActiveModal("login-modal");
  //   setIsMobileMenuActive(false);
  // };

  // const closeActiveModal = () => {
  //   setActiveModal("");
  // };

  useEffect(() => {
    fetchCoordinatesByCity("Cincinnati", weatherAPIkey)
      .then((coordinates) => {
        console.log(coordinates);
        return getWeather(coordinates, weatherAPIkey);
      })
      .then((data) => {
        const filteredData = filterWeatherData(data);
        console.log(filteredData);
        setWeatherData(filteredData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!activeModal) return;

    const handleEscClose = (evt) => {
      if (evt.key === "Escape") {
        closeActiveModal();
      }
    };

    document.addEventListener("keydown", handleEscClose);

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [activeModal]);

  return (
    <WeatherContext.Provider
      value={{ weatherData, setWeatherData, weatherAPIkey }}
    >
      <UserContext.Provider
        value={{
          // currentUser,
          isLoggedIn,
          // isAuthenticating,
          // handleLogout,
          // handleLogin,
        }}
      >
        <ActivitiesContext.Provider value={activitiesData.activities}>
          <FilterContextProvider>
            <div className="page">
              <div className="page__content">
                <Header
                // handleSignupClick={handleSignupClick}
                />
                <Main />
              </div>
            </div>
          </FilterContextProvider>
        </ActivitiesContext.Provider>
      </UserContext.Provider>
    </WeatherContext.Provider>
  );
}
