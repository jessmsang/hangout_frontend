import { useState } from "react";
import "./AccountDropdown.css";

export default function AccountDropdown({
  user,
  onLogout,
  onDeleteAccount,
  onEditProfileClick,
}) {
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
          <button
            className="account-dropdown__item"
            onClick={() => {
              onEditProfileClick();
              setIsOpen(false);
            }}
          >
            View/Edit Profile
          </button>
          <button className="account-dropdown__item">Change Password</button>
          <hr className="account-dropdown__divider" />
          <button className="account-dropdown__item" onClick={onLogout}>
            Log Out
          </button>
          <button
            className="account-dropdown__item account-dropdown__danger"
            onClick={onDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
}
