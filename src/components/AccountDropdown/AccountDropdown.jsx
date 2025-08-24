import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./AccountDropdown.css";

import DeleteContext from "../../contexts/DeleteContext";

export default function AccountDropdown({
  user,
  onEditProfileClick,
  onChangePasswordClick,
  onLogoutClick,
}) {
  const { openDeleteConfirmationModal } = useContext(DeleteContext);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="account-dropdown">
      <button className="account-dropdown__btn" onClick={toggleDropdown}>
        <p className="account-dropdown__avatar-placeholder">
          {user.name[0].toUpperCase()}
        </p>
      </button>

      {isOpen && (
        <div className="account-dropdown__menu">
          <Link
            to="/my-activities"
            className="account-dropdown__link"
            onClick={toggleDropdown}
          >
            <button className="account-dropdown__item">My Activities</button>
          </Link>
          <button
            className="account-dropdown__item"
            onClick={() => {
              onEditProfileClick();
              setIsOpen(false);
            }}
          >
            View/Edit Profile
          </button>
          <button
            className="account-dropdown__item"
            onClick={() => {
              onChangePasswordClick();
              setIsOpen(false);
            }}
          >
            Change Password
          </button>
          <hr className="account-dropdown__divider" />
          <button
            className="account-dropdown__item"
            onClick={() => {
              onLogoutClick();
              setIsOpen(false);
            }}
          >
            Log Out
          </button>
          <button
            className="account-dropdown__item account-dropdown__danger"
            onClick={() => {
              openDeleteConfirmationModal("account");
              setIsOpen(false);
            }}
          >
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
}
