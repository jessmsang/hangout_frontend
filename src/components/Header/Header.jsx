import { useContext } from "react";

import "./Header.css";

import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
import LocationDisplay from "../LocationDisplay/LocationDisplay";
import Logo from "../Logo/Logo";
import AccountDropdown from "../AccountDropdown/AccountDropdown";

import UserContext from "../../contexts/UserContext";
import LoadingContext from "../../contexts/LoadingContext";

export default function Header({
  handleSignupClick,
  handleLoginClick,
  openEditProfileModal,
  openChangePasswordModal,
  openDeleteConfirmationModal,
  openLogoutConfirmationModal,
  isMobile,
}) {
  const { isLoggedIn, currentUser, handleLogout, handleDeleteAccount } =
    useContext(UserContext);
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  return (
    <header className="header">
      <div className="header__left">
        <div className="header__mobile-top-container">
          <Logo />
          {isLoggedIn && isMobile && (
            <div className="header__mobile-dropdown-location">
              <AccountDropdown
                user={currentUser}
                onLogout={handleLogout}
                onDeleteAccount={handleDeleteAccount}
                onEditProfileClick={openEditProfileModal}
                onChangePasswordClick={openChangePasswordModal}
                onLogoutClick={openLogoutConfirmationModal}
                onDeleteAccountClick={openDeleteConfirmationModal}
              />
            </div>
          )}
        </div>

        <hr className="header__divider" />
        <div className="header__mobile-middle-container">
          <LocationDisplay />
          <hr className="header__divider" />
          <WeatherDisplay />
        </div>
        <hr className="header__divider" />
      </div>
      {!isLoggedIn && (
        <ul className="header__unauthorized-view">
          <li className="header__unauthorized-item">
            <button
              onClick={handleSignupClick}
              className="header__unauthorized-btn"
            >
              Sign Up
            </button>
          </li>
          <li className="header__unauthorized-item">
            <button
              onClick={handleLoginClick}
              className="header__unauthorized-btn"
            >
              Log In
            </button>
          </li>
        </ul>
      )}
      {isLoggedIn && !isMobile && (
        <div className="header__authorized-view">
          <AccountDropdown
            user={currentUser}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
            onEditProfileClick={openEditProfileModal}
            onChangePasswordClick={openChangePasswordModal}
            onLogoutClick={openLogoutConfirmationModal}
            onDeleteAccountClick={openDeleteConfirmationModal}
          />
        </div>
      )}
    </header>
  );
}
