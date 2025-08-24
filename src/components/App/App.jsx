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

// import activitiesData from "../../../db.json";

import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import { fetchCoordinatesByCity } from "../../utils/location";
import { weatherAPIkey } from "../../constants/apiEndpoints";

import * as activitiesApi from "../../utils/activitiesApi";
import * as auth from "../../utils/auth";
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
  //UNCOMMENT AFTER TESTING PROFILE (NEEDED A USER FOR TESTING)
  // const [currentUser, setCurrentUser] = useState({
  //   _id: "",
  //   name: "",
  //   email: "",
  //   createdAt: "",
  // });
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    _id: "dummy-id",
    name: "Jess Test",
    email: "jess@test.com",
    createdAt: "",
  });

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

  // useEffect(() => {
  //   if (!activeModal) return;

  //   const handleEscClose = (evt) => {
  //     if (evt.key === "Escape") {
  //       closeActiveModal();
  //     }
  //   };
  //   document.addEventListener("keydown", handleEscClose);

  //   return () => {
  //     document.removeEventListener("keydown", handleEscClose);
  //   };
  // }, [activeModal]);

  useEffect(() => {
    activitiesApi
      .getActivities()
      .then((data) =>
        setActivities(
          data.map((activity) => ({
            ...activity,
            isSaved: activity.isSaved ?? false,
            isCompleted: activity.isCompleted ?? false,
          }))
        )
      )
      .catch(console.error);
  }, []);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignupClick = () => {
    setActiveModal("register-modal");
  };

  const handleLoginClick = () => {
    setActiveModal("login-modal");
  };

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
          handleLogin({ email, password });
        });
      };
      handleSubmit(makeRequest);
    }
  };

  const handleLogin = ({ email, password }) => {
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
          setCurrentUser(data.user);
          closeActiveModal();
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

  const openLogoutConfirmationModal = () => setIsLogoutModalOpen(true);
  const closeLogoutConfirmationModal = () => setIsLogoutModalOpen(false);

  const handleUpdateProfile = async (updatedValues) => {
    try {
      const updatedUser = { ...currentUser, ...updatedValues };
      setCurrentUser(updatedUser);

      //TODO: FOR REAL BACKEND:
      // await auth.updateUser(currentUser._id, updatedValues);

      console.log("Profile updated successfully.");
      return updatedUser;
    } catch (error) {
      console.error("Profile update failed:", error);
      alert(`Error updating profile: ${error.message}`);
      throw error;
    }
  };

  const openEditProfileModal = () => setIsEditProfileOpen(true);
  const closeEditProfileModal = () => setIsEditProfileOpen(false);

  const handleUpdatePassword = async (oldPassword, newPassword) => {
    try {
      // TODO: Replace with real backend request
      // await auth.updatePassword(currentUser._id, { oldPassword, newPassword });

      console.log("Password updated successfully (stubbed).");
      console.log("Password updated:", { oldPassword, newPassword });
    } catch (error) {
      console.error("Password update failed:", error);
      alert(`Error updating password: ${error.message}`);
      throw error;
    }
  };

  const openChangePasswordModal = () => setIsChangePasswordOpen(true);
  const closeChangePasswordModal = () => setIsChangePasswordOpen(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setCurrentUser(null);
      setIsLoggedIn(false);
      token.removeToken();
      navigate("/");

      alert("Your account has been deleted successfully (stubbed).");
    } catch (error) {
      console.error("Delete account error:", error);
      alert(`Error deleting account: ${error.message}`);
    }
  };

  const handleDeleteActivity = async (activity) => {
    try {
      await activitiesApi.deleteActivity(activity._id); // or stub
      setActivities((prev) => prev.filter((a) => a._id !== activity._id));
    } catch (error) {
      console.error("Delete activity error:", error);
      alert(`Error deleting activity: ${error.message}`);
    }
  };

  const openDeleteConfirmationModal = (variant, card = null) =>
    setDeleteConfig({ isOpen: true, variant, card });

  const closeDeleteConfirmationModal = () =>
    setDeleteConfig({ isOpen: false, variant: null, card: null });

  const openModal = (modalName) => setActiveModal(modalName);
  const closeActiveModal = useCallback(() => setActiveModal(""), []);
  const handleEscClose = useCallback(() => {
    if (activeModal) {
      closeActiveModal(); // closes the currently active modal
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

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <Preloader />}
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
                      openLogoutConfirmationModal={openLogoutConfirmationModal}
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

                    <AddActivityButton
                      onClick={() => openModal("add-activity")}
                    />
                    <AddActivityFormModal
                      isOpen={activeModal === "add-activity"}
                      onClose={closeActiveModal}
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
    </LoadingContext.Provider>
  );
}
