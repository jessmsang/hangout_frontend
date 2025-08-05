import { useEffect, useState } from "react";

import "./App.css";

import Header from "../Header/Header";

import UserContext from "../../contexts/UserContext";

import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import { fetchCoordinatesByCity } from "../../utils/location";
import { APIkey } from "../../utils/constants";

export default function App() {
  const [weatherData, setWeatherData] = useState({
    city: "",
    condition: "",
    icon: "",
    isDay: true,
    temp: { F: 999, C: 999 },
    // TODO: see if i can change "type" to "season"
    type: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModal, setActiveModal] = useState("");

  const handleSignupClick = () => {
    setActiveModal("register-modal");
    setIsMobileMenuActive(false);
  };

  const handleLoginClick = () => {
    setActiveModal("login-modal");
    setIsMobileMenuActive(false);
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  useEffect(() => {
    fetchCoordinatesByCity("Cincinnati", APIkey)
      .then((coordinates) => {
        console.log(coordinates);
        return getWeather(coordinates, APIkey);
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
    <UserContext.Provider
      value={{
        // currentUser,
        isLoggedIn,
        // isAuthenticating,
        // handleLogout,
        // handleLogin,
      }}
    >
      <div className="page">
        <div className="page__content">
          <Header
            handleSignupClick={handleSignupClick}
            weatherData={weatherData}
          />
        </div>
      </div>
    </UserContext.Provider>
  );
}
