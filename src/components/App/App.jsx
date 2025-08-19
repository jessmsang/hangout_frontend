import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./App.css";

import Header from "../Header/Header";
import Main from "../Main/Main";
import FilterContextProvider from "../FilterContextProvider/FilterContextProvider";
import AddActivityButton from "../AddActivityButton/AddActivityButton";
import AddActivityFormModal from "../AddActivityFormModal/AddActivityFormModal";
import Footer from "../Footer/Footer";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import LogoutConfirmationModal from "../LogoutConfirmationModal/LogoutConfirmationModal";

import UserContext from "../../contexts/UserContext";
import WeatherContext from "../../contexts/WeatherContext";
import ActivitiesContext from "../../contexts/ActivitiesContext";

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
    email: "jess@example.com",
    createdAt: "",
  });

  const [activities, setActivities] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navigate = useNavigate();

  const savedActivities = activities.filter((activity) => activity.isSaved);
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

  // TODO: SET UP USER CONTEXT

  const handleSignupClick = () => {
    setActiveModal("register-modal");
    //TODO: ADD RESPONSIVE DESIGN
    // setIsMobileMenuActive(false);
  };

  const handleLoginClick = () => {
    setActiveModal("login-modal");
    //   setIsMobileMenuActive(false);
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

      alert("Profile updated successfully.");
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

      console.log("Password updated:", { oldPassword, newPassword });
      alert("Password updated successfully (stubbed).");
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

  const openDeleteConfirmationModal = () =>
    setIsDeleteConfirmationModalOpen(true);
  const closeDeleteConfirmationModal = () =>
    setIsDeleteConfirmationModalOpen(false);

  return (
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
            <div className="page">
              <div className="page__content">
                <Header
                  handleSignupClick={handleSignupClick}
                  handleLoginClick={handleLoginClick}
                  openEditProfileModal={openEditProfileModal}
                  openChangePasswordModal={openChangePasswordModal}
                  openDeleteConfirmationModal={openDeleteConfirmationModal}
                  openLogoutConfirmationModal={openLogoutConfirmationModal}
                />
                <Main />
                <AddActivityButton onClick={() => openModal("add-activity")} />
                <AddActivityFormModal
                  isOpen={activeModal === "add-activity"}
                  onClose={closeActiveModal}
                />

                <Footer />

                <RegisterModal
                  onClose={closeActiveModal}
                  isOpen={activeModal === "register-modal"}
                  activeModal={activeModal}
                  setActiveModal={setActiveModal}
                  isLoading={isLoading}
                />
                <LoginModal
                  onClose={closeActiveModal}
                  isOpen={activeModal === "login-modal"}
                  activeModal={activeModal}
                  setActiveModal={setActiveModal}
                  isLoading={isLoading}
                />
                <EditProfileModal
                  isOpen={isEditProfileOpen}
                  onClose={closeEditProfileModal}
                  isLoading={isLoading}
                />
                <ChangePasswordModal
                  isOpen={isChangePasswordOpen}
                  onClose={closeChangePasswordModal}
                  isLoading={isLoading}
                />
                <LogoutConfirmationModal
                  isOpen={isLogoutModalOpen}
                  onClose={closeLogoutConfirmationModal}
                  onLogout={handleLogout}
                  isLoading={isLoading}
                />
                <DeleteConfirmationModal
                  isOpen={isDeleteConfirmationModalOpen}
                  onClose={closeDeleteConfirmationModal}
                  isLoading={isLoading}
                  onDelete={() => {
                    handleDeleteAccount();
                    closeDeleteAccountModal();
                  }}
                />
              </div>
            </div>
          </FilterContextProvider>
        </ActivitiesContext.Provider>
      </UserContext.Provider>
    </WeatherContext.Provider>
  );
}
