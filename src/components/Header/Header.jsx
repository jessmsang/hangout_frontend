import { useContext } from "react";

import "./Header.css";

import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
import LocationDisplay from "../LocationDisplay/LocationDisplay";
import Logo from "../Logo/Logo";

import UserContext from "../../contexts/UserContext";

export default function Header({ handleSignupClick, handleLoginClick }) {
  const { isLoggedIn, currentUser } = useContext(UserContext);

  return (
    <header className="header">
      <div className="header__left">
        <Logo />
        <LocationDisplay />
        <WeatherDisplay />
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
      {isLoggedIn && (
        <div className="header__authorized-view">
          <button
            className="header__avatar-btn"
            // onClick={}
          >
            <p className="header__avatar-placeholder">
              {currentUser.name[0].toUpperCase()}
            </p>
          </button>
        </div>
      )}
    </header>
  );
}
