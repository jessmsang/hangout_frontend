import { useEffect, useState } from "react";

import "./App.css";

import Header from "../Header/Header";
import Main from "../Main/Main";
import FilterContextProvider from "../FilterContextProvider/FilterContextProvider";
import AddActivityButton from "../AddActivityButton/AddActivityButton";
import AddActivityFormModal from "../AddActivityFormModal/AddActivityFormModal";
import Footer from "../Footer/Footer";

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
  const [activities, setActivities] = useState(
    activitiesData.activities.map((activity) => ({
      ...activity,
      isLiked: false,
      isCompleted: false,
    }))
  );
  const [activeModal, setActiveModal] = useState("");

  const openModal = (modalName) => setActiveModal(modalName);
  const closeActiveModal = () => setActiveModal("");

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

  useEffect(() => {
    fetchCoordinatesByCity("Cincinnati", weatherAPIkey)
      .then((coordinates) => {
        // console.log(coordinates);
        return getWeather(coordinates, weatherAPIkey);
      })
      .then((data) => {
        const filteredData = filterWeatherData(data);
        // console.log(filteredData);
        setWeatherData(filteredData);
      })
      .catch(console.error);
  }, []);

  // TODO: SET UP USER CONTEXT
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const handleSignupClick = () => {
  //   setActiveModal("register-modal");
  //   setIsMobileMenuActive(false);
  // };

  // const handleLoginClick = () => {
  //   setActiveModal("login-modal");
  //   setIsMobileMenuActive(false);
  // };

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
        <ActivitiesContext.Provider value={{ activities, setActivities }}>
          <FilterContextProvider>
            <div className="page">
              <div className="page__content">
                <Header
                // handleSignupClick={handleSignupClick}
                />
                <Main />
                <AddActivityButton onClick={() => openModal("add-activity")} />
                {activeModal === "add-activity" && (
                  <AddActivityFormModal isOpen onClose={closeActiveModal} />
                )}
                {/* Future: */}
                {/* {activeModal === "login" && <LoginModal isOpen onClose={closeActiveModal} />} */}
                {/* {activeModal === "signup" && <SignupModal isOpen onClose={closeActiveModal} />} */}
                <Footer />
              </div>
            </div>
          </FilterContextProvider>
        </ActivitiesContext.Provider>
      </UserContext.Provider>
    </WeatherContext.Provider>
  );
}
