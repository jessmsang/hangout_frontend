import { useEffect, useState } from "react";

import "./App.css";

import Header from "../Header/Header";
import Main from "../Main/Main";
import FilterContextProvider from "../FilterContextProvider/FilterContextProvider";
import AddActivityButton from "../AddActivityButton/AddActivityButton";
import AddActivityFormModal from "../AddActivityFormModal/AddActivityFormModal";
import Footer from "../Footer/Footer";
import RegisterModal from "../RegisterModal/RegisterModal";

import UserContext from "../../contexts/UserContext";
import WeatherContext from "../../contexts/WeatherContext";
import ActivitiesContext from "../../contexts/ActivitiesContext";

// import activitiesData from "../../../db.json";

import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import { fetchCoordinatesByCity } from "../../utils/location";
import { weatherAPIkey } from "../../constants/apiEndpoints";

import * as activitiesApi from "../../utils/activitiesApi";
import * as auth from "../../utils/auth";

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

  const [activities, setActivities] = useState([]);

  const [currentUser, setCurrentUser] = useState({
    _id: "",
    name: "",
    email: "",
    createdAt: "",
  });
  const [activeModal, setActiveModal] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const savedActivities = activities.filter((activity) => activity.isLiked);
  const completedActivities = activities.filter(
    (activity) => activity.isCompleted
  );

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
    activitiesApi
      .getActivities()
      .then((data) =>
        setActivities(
          data.map((activity) => ({
            ...activity,
            isLiked: activity.isLiked ?? false,
            isCompleted: activity.isCompleted ?? false,
          }))
        )
      )
      .catch(console.error);
  }, []);

  const handleCardLike = ({ id, isLiked }) => {
    activitiesApi
      .updateActivity(id, { isLiked: !isLiked })
      .then((updatedActivity) => {
        setActivities((prev) =>
          prev.map((activity) =>
            activity._id === id ? updatedActivity : activity
          )
        );
      })
      .catch(console.error);
  };

  const handleCardComplete = ({ id, isCompleted }) => {
    activitiesApi
      .updateActivity(id, { isCompleted: !isCompleted })
      .then((updatedActivity) => {
        setActivities((prev) =>
          prev.map((activity) =>
            activity._id === id ? updatedActivity : activity
          )
        );
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchCoordinatesByCity("Cincinnati", weatherAPIkey)
      .then((coordinates) => {
        return getWeather(coordinates, weatherAPIkey);
      })
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch(console.error);
  }, []);

  // TODO: SET UP USER CONTEXT
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignupClick = () => {
    setActiveModal("register-modal");
    //TODO: ADD RESPONSIVE DESIGN
    // setIsMobileMenuActive(false);
  };

  // const handleLoginClick = () => {
  //   setActiveModal("login-modal");
  //   setIsMobileMenuActive(false);
  // };

  const handleSubmit = (request) => {
    setIsLoading(true);
    request()
      .then(closeActiveModal)
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRegistration = ({ email, password, confirmPassword, name }) => {
    if (password === confirmPassword) {
      const makeRequest = () => {
        return auth.register(email, password, name).then(() => {
          closeActiveModal();
          handleLogin({ email, password }, resetForm);
          resetForm();
        });
      };
      handleSubmit(makeRequest);
    }
  };

  const handleLogin = ({ email, password }, resetForm) => {
    if (!email || !password) {
      return;
    }

    const makeRequest = () => {
      return auth.login(email, password).then((data) => {
        if (data.token) {
          token.setToken(data.token);
          setIsLoggedIn(true);
          const redirectPath = location.state?.from?.pathname || "/";
          navigate(redirectPath);
          setCurrentUser(data);
          closeActiveModal();
          resetForm();
        }
      });
    };
    handleSubmit(makeRequest);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    token.removeToken();
    navigate("/");
  };

  return (
    <WeatherContext.Provider
      value={{ weatherData, setWeatherData, weatherAPIkey }}
    >
      <UserContext.Provider
        value={{
          currentUser,
          isLoggedIn,
          isAuthenticating,
          handleLogout,
          handleLogin,
          handleRegistration,
          savedActivities,
          completedActivities,
        }}
      >
        <ActivitiesContext.Provider value={{ activities, setActivities }}>
          <FilterContextProvider>
            <div className="page">
              <div className="page__content">
                <Header handleSignupClick={handleSignupClick} />
                <Main />
                <AddActivityButton onClick={() => openModal("add-activity")} />
                <AddActivityFormModal
                  isOpen={activeModal === "add-activity"}
                  onClose={closeActiveModal}
                />
                {/* Future: */}
                {/* {activeModal === "login" && <LoginModal isOpen onClose={closeActiveModal} />} */}
                {/* {activeModal === "signup" && <SignupModal isOpen onClose={closeActiveModal} />} */}
                <Footer />

                <RegisterModal
                  onClose={closeActiveModal}
                  isOpen={activeModal === "register-modal"}
                  activeModal={activeModal}
                  handleRegistration={handleRegistration}
                  setActiveModal={setActiveModal}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </FilterContextProvider>
        </ActivitiesContext.Provider>
      </UserContext.Provider>
    </WeatherContext.Provider>
  );
}
