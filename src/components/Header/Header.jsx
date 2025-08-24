import { useContext } from "react";
import { Link } from "react-router-dom";

import "./Header.css";

import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
import LocationDisplay from "../LocationDisplay/LocationDisplay";
import Logo from "../Logo/Logo";
import AccountDropdown from "../AccountDropdown/AccountDropdown";

import UserContext from "../../contexts/UserContext";

export default function Header({
  handleSignupClick,
  handleLoginClick,
  openEditProfileModal,
  openChangePasswordModal,
  openLogoutConfirmationModal,
  isMobile,
}) {
  const { isLoggedIn, currentUser, handleLogout } = useContext(UserContext);

  return (
    <header className="header">
      <div className="header__left">
        <div className="header__mobile-top-container">
          <Link to="/" className="logo-link">
            <Logo />
          </Link>
          {isLoggedIn && isMobile && (
            <div className="header__mobile-dropdown-location">
              <AccountDropdown
                user={currentUser}
                onLogout={handleLogout}
                onEditProfileClick={openEditProfileModal}
                onChangePasswordClick={openChangePasswordModal}
                onLogoutClick={openLogoutConfirmationModal}
              />
            </div>
          )}

          {!isLoggedIn && isMobile && (
            <ul className="header__unauthorized-view-mobile">
              <li className="header__unauthorized-item-mobile">
                <button
                  onClick={handleSignupClick}
                  className="header__unauthorized-btn-mobile"
                >
                  Sign Up
                </button>
              </li>
              <li className="header__unauthorized-item-mobile">
                <button
                  onClick={handleLoginClick}
                  className="header__unauthorized-btn-mobile"
                >
                  Log In
                </button>
              </li>
            </ul>
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
      {!isLoggedIn && !isMobile && (
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
            onEditProfileClick={openEditProfileModal}
            onChangePasswordClick={openChangePasswordModal}
            onLogoutClick={openLogoutConfirmationModal}
          />
        </div>
      )}
    </header>
  );
}
