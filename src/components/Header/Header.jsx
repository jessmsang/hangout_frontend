import { useContext } from "react";

import "./Header.css";

import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
import Logo from "../Logo/Logo";
import UserContext from "../../contexts/UserContext";

export default function Header({
  handleSignupClick,
  handleLoginClick,
  weatherData,
}) {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <header className="header">
      <div className="header__left">
        <Logo />
        <WeatherDisplay weatherData={weatherData} />
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
    </header>
  );
}
