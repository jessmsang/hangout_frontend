import { useEffect, useState, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import "./App.css";

import FilterContextProvider from "../FilterContextProvider/FilterContextProvider";

import Header from "../Header/Header";
import Main from "../Main/Main";
import AddActivityButton from "../AddActivityButton/AddActivityButton";
import Footer from "../Footer/Footer";
import MyActivities from "../MyActivities/MyActivities";

import AddActivityFormModal from "../AddActivityFormModal/AddActivityFormModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import LogoutConfirmationModal from "../LogoutConfirmationModal/LogoutConfirmationModal";

import Preloader from "../Preloader/Preloader";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { useEscClose } from "../../hooks/useEscClose";

import UserContext from "../../contexts/UserContext";
import WeatherContext from "../../contexts/WeatherContext";
import ActivitiesContext from "../../contexts/ActivitiesContext";
import LoadingContext from "../../contexts/LoadingContext";
import DeleteContext from "../../contexts/DeleteContext";

import { getWeather, filterWeatherData } from "../../api/weatherApi";
import { fetchCoordinatesByCity } from "../../utils/location";
import { weatherAPIkey } from "../../constants/apiEndpoints";

import * as activitiesApi from "../../api/activitiesApi";
import * as usersApi from "../../api/usersApi";
import * as auth from "../../api/auth";
import * as token from "../../utils/token";

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

  const [currentUser, setCurrentUser] = useState({
    _id: "",
    name: "",
    email: "",
    createdAt: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activities, setActivities] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({
    isOpen: false,
    variant: null,
    card: null,
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  const location = useLocation();
  const navigate = useNavigate();
  const isMyActivitiesPage = location.pathname === "/my-activities";

  const savedActivities = activities.filter((activity) => activity.isSaved);
  const completedActivities = activities.filter(
    (activity) => activity.isCompleted
  );

  // --- AUTHENTICATION ---
  useEffect(() => {
    const tokenValue = token.getToken();
    if (!tokenValue) {
      setIsAuthenticating(false);
      setIsLoggedIn(false);
      return;
    }

    token
      .tokenValidation(tokenValue)
      .then(() => {
        return usersApi.getCurrentUser();
      })
      .then((user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        token.removeToken();
        setIsLoggedIn(false);
        setCurrentUser({
          _id: "",
          name: "",
          email: "",
          createdAt: "",
        });
      })
      .finally(() => {
        setIsAuthenticating(false);
      });
  }, []);

  // --- FETCH ACTIVITIES ---
  useEffect(() => {
    setIsLoading(true);
    activitiesApi
      .getActivities()
      .then((data) => {
        setActivities(
          data.map((activity) => ({
            ...activity,
            isSaved: activity.isSaved ?? false,
            isCompleted: activity.isCompleted ?? false,
          }))
        );
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // --- FETCH WEATHER ---
  useEffect(() => {
    setIsLoading(true);
    fetchCoordinatesByCity("Cincinnati", weatherAPIkey)
      .then((coordinates) => getWeather(coordinates, weatherAPIkey))
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // --- RESPONSIVE DESIGN ---
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- UI HANDLERS ---
  const handleSignupClick = () => {
    setActiveModal("register-modal");
  };
  const handleLoginClick = () => {
    setActiveModal("login-modal");
  };

  const openModal = (modalName) => setActiveModal(modalName);
  const closeActiveModal = useCallback(() => setActiveModal(""), []);

  const openLogoutConfirmationModal = () => setIsLogoutModalOpen(true);
  const closeLogoutConfirmationModal = () => setIsLogoutModalOpen(false);

  const openEditProfileModal = () => setIsEditProfileOpen(true);
  const closeEditProfileModal = () => setIsEditProfileOpen(false);

  const openDeleteConfirmationModal = (variant, card = null) =>
    setDeleteConfig({ isOpen: true, variant, card });
  const closeDeleteConfirmationModal = () =>
    setDeleteConfig({ isOpen: false, variant: null, card: null });

  const openChangePasswordModal = () => setIsChangePasswordOpen(true);
  const closeChangePasswordModal = () => setIsChangePasswordOpen(false);

  const handleEscClose = useCallback(() => {
    if (activeModal) {
      closeActiveModal();
    } else if (isEditProfileOpen) {
      closeEditProfileModal();
    } else if (isChangePasswordOpen) {
      closeChangePasswordModal();
    } else if (isLogoutModalOpen) {
      closeLogoutConfirmationModal();
    } else if (deleteConfig.isOpen) {
      closeDeleteConfirmationModal();
    }
  }, [
    activeModal,
    isEditProfileOpen,
    isChangePasswordOpen,
    isLogoutModalOpen,
    deleteConfig,
    closeActiveModal,
    closeEditProfileModal,
    closeChangePasswordModal,
    closeLogoutConfirmationModal,
    closeDeleteConfirmationModal,
  ]);

  useEscClose(
    handleEscClose,
    activeModal ||
      isEditProfileOpen ||
      isChangePasswordOpen ||
      isLogoutModalOpen ||
      deleteConfig.isOpen
  );

  // --- ACTION FUNCTIONS ---
  const handleSubmit = (req) => {
    setIsLoading(true);
    req()
      .then(closeActiveModal)
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRegistration = ({ email, password, confirmPassword, name }) => {
    if (password !== confirmPassword) {
      return Promise.reject(new Error("Passwords do not match"));
    }

    const makeRequest = () =>
      auth
        .register(email, password, name)
        .then((data) => {
          console.log("Registration successful:", data.user);
          token.setToken(data.token);
          setIsLoggedIn(true);
          setCurrentUser(data.user);

          const redirectPath = location.state?.from?.pathname || "/";
          navigate(redirectPath);

          return data.user;
        })
        .catch((error) => {
          console.error("Registration failed:", error);
          alert(`Error registering: ${error.message}`);
          throw error;
        });

    handleSubmit(makeRequest);
  };

  const handleLogin = ({ email, password }) => {
    if (!email || !password)
      return Promise.reject(new Error("Missing credentials"));

    const makeRequest = () =>
      auth.login(email, password).then((data) => {
        token.setToken(data.token);
        setIsLoggedIn(true);
        setCurrentUser(data.user);

        const redirectPath = location.state?.from?.pathname || "/";
        navigate(redirectPath);

        return data.user;
      });

    handleSubmit(makeRequest);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser({
      _id: "",
      name: "",
      email: "",
      createdAt: "",
    });
    token.removeToken();
    navigate("/");
  };

  const handleUpdateProfile = (updatedValues) => {
    const makeRequest = () =>
      usersApi.updateUser(updatedValues).then((updatedUser) => {
        setCurrentUser(updatedUser);
        console.log("Profile updated successfully.", updatedUser);
        return updatedUser;
      });

    handleSubmit(makeRequest);
  };

  const handleAddActivity = (activityData) => {
    const makeRequest = () => {
      const newActivity = {
        owner: currentUser._id,
        ...activityData,
        isSaved: false,
        isCompleted: false,
      };

      return activitiesApi
        .addActivity(newActivity)
        .then((savedActivity) => {
          setActivities((prev) => [savedActivity, ...prev]);
          console.log("Activity added successfully:", savedActivity);
          return savedActivity;
        })
        .catch((error) => {
          console.error("Error adding activity:", error);
          alert(`Error adding activity: ${error.message}`);
          throw error;
        });
    };

    handleSubmit(makeRequest);
  };

  const handleUpdatePassword = (oldPassword, newPassword) => {
    const makeRequest = () => {
      return auth
        .updatePassword(currentUser._id, { oldPassword, newPassword })
        .then(() => {
          console.log("Password updated successfully.");
          alert("Password updated successfully.");
        })
        .catch((error) => {
          console.error("Password update failed:", error);
          alert(`Error updating password: ${error.message}`);
          throw error;
        });
    };

    handleSubmit(makeRequest);
  };

  const handleDeleteAccount = () => {
    const makeRequest = () =>
      usersApi.deleteUser(currentUser._id).then(() => {
        setCurrentUser({
          _id: "",
          name: "",
          email: "",
          createdAt: "",
        });
        setIsLoggedIn(false);
        token.removeToken();
        navigate("/");
        console.log("Account deleted successfully.");
      });

    handleSubmit(makeRequest);
  };

  const handleDeleteActivity = (activity) => {
    const makeRequest = () => {
      return activitiesApi
        .deleteActivity(activity._id)
        .then(() => {
          setActivities((prev) => prev.filter((a) => a._id !== activity._id));
          console.log(`Activity ${activity._id} deleted successfully.`);
        })
        .catch((error) => {
          console.error("Delete activity error:", error);
          alert(`Error deleting activity: ${error.message}`);
          throw error;
        });
    };

    handleSubmit(makeRequest);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {(isLoading || isAuthenticating) && <Preloader />}
      {!isAuthenticating && (
        <WeatherContext.Provider
          value={{ weatherData, setWeatherData, weatherAPIkey }}
        >
          <UserContext.Provider
            value={{
              currentUser,
              setCurrentUser,
              isLoggedIn,
              isAuthenticating,
              handleLogout,
              handleLogin,
              handleRegistration,
              handleUpdateProfile,
              handleDeleteAccount,
              handleUpdatePassword,
              savedActivities,
              completedActivities,
            }}
          >
            <ActivitiesContext.Provider value={{ activities, setActivities }}>
              <FilterContextProvider>
                <DeleteContext.Provider
                  value={{
                    deleteConfig,
                    openDeleteConfirmationModal,
                    closeDeleteConfirmationModal,
                  }}
                >
                  <div className="page">
                    <div className="page__content">
                      <Header
                        handleSignupClick={handleSignupClick}
                        handleLoginClick={handleLoginClick}
                        openEditProfileModal={openEditProfileModal}
                        openChangePasswordModal={openChangePasswordModal}
                        onDeleteAccountClick={() =>
                          openDeleteConfirmationModal("account")
                        }
                        openLogoutConfirmationModal={
                          openLogoutConfirmationModal
                        }
                        isMobile={isMobile}
                        isMyActivitiesPage={isMyActivitiesPage}
                      />

                      <Routes>
                        <Route path="/" element={<Main />} />

                        <Route
                          path="/my-activities"
                          element={
                            <ProtectedRoute setActiveModal={setActiveModal}>
                              <MyActivities />
                            </ProtectedRoute>
                          }
                        ></Route>
                      </Routes>

                      {isLoggedIn && activeModal !== "add-activity" && (
                        <AddActivityButton
                          onClick={() => openModal("add-activity")}
                        />
                      )}
                      <AddActivityFormModal
                        isOpen={activeModal === "add-activity"}
                        onClose={closeActiveModal}
                        handleAddActivity={handleAddActivity}
                      />

                      <Footer isMobile={isMobile} />

                      <RegisterModal
                        onClose={closeActiveModal}
                        isOpen={activeModal === "register-modal"}
                        activeModal={activeModal}
                        setActiveModal={setActiveModal}
                      />
                      <LoginModal
                        onClose={closeActiveModal}
                        isOpen={activeModal === "login-modal"}
                        activeModal={activeModal}
                        setActiveModal={setActiveModal}
                      />
                      <EditProfileModal
                        isOpen={isEditProfileOpen}
                        onClose={closeEditProfileModal}
                      />
                      <ChangePasswordModal
                        isOpen={isChangePasswordOpen}
                        onClose={closeChangePasswordModal}
                      />
                      <LogoutConfirmationModal
                        isOpen={isLogoutModalOpen}
                        onClose={closeLogoutConfirmationModal}
                        onLogout={handleLogout}
                      />
                      <DeleteConfirmationModal
                        isOpen={deleteConfig.isOpen}
                        onClose={closeDeleteConfirmationModal}
                        card={deleteConfig.card}
                        variant={deleteConfig.variant}
                        onDelete={(card) => {
                          if (deleteConfig.variant === "account") {
                            handleDeleteAccount();
                          } else if (deleteConfig.variant === "activity") {
                            handleDeleteActivity(card);
                          }
                          closeDeleteConfirmationModal();
                        }}
                      />
                    </div>
                  </div>
                </DeleteContext.Provider>
              </FilterContextProvider>
            </ActivitiesContext.Provider>
          </UserContext.Provider>
        </WeatherContext.Provider>
      )}
    </LoadingContext.Provider>
  );
}
