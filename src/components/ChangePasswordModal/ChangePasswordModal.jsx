import { useContext } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";
import UserContext from "../../contexts/UserContext";

export default function ChangePasswordModal({ onClose, isOpen, isLoading }) {
  const { handleUpdatePassword } = useContext(UserContext);

  const { values, handleChange, setValues, errorMessage, hasErrors, isValid } =
    useForm(
      {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      {
        matchFields: {
          field: "newPassword",
          confirmField: "confirmNewPassword",
        },
        patternFields: {
          newPassword: /^(?=.*[A-Z])(?=.*[!@#$%^&*_+\-=?]).{8,50}$/,
        },
      }
    );

  const handleFormSubmit = async (evt) => {
    evt.preventDefault();

    if (hasErrors) return;

    try {
      await handleUpdatePassword(values.currentPassword, values.newPassword);
      setValues({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalWithForm
      variant="change-password"
      titleText="Change Password"
      name="change-password-modal"
      btnText={isLoading ? "Saving..." : "Update Password"}
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleFormSubmit}
      isDisabled={isLoading || !isValid}
    >
      <label htmlFor="current-password-input" className="modal__label">
        Current Password*
        <input
          type="password"
          name="currentPassword"
          id="current-password-input"
          className="modal__input"
          placeholder="Enter current password"
          required
          onChange={handleChange}
          value={values.currentPassword}
        />
        <span className="modal__error" id="current-password-error">
          {errorMessage.currentPassword}
        </span>
      </label>

      <label htmlFor="new-password-input" className="modal__label">
        New Password*
        <input
          type="password"
          name="newPassword"
          id="new-password-input"
          className="modal__input"
          placeholder="Enter new password"
          required
          pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*_+\-=?]).{8,50}$"
          onChange={handleChange}
          value={values.newPassword}
        />
        <span className="modal__error" id="new-password-error">
          {errorMessage.newPassword}
        </span>
      </label>

      <label htmlFor="confirm-new-password-input" className="modal__label">
        Confirm New Password*
        <input
          type="password"
          name="confirmNewPassword"
          id="confirm-new-password-input"
          className="modal__input"
          placeholder="Re-enter new password"
          required
          onChange={handleChange}
          value={values.confirmNewPassword}
        />
        <span className="modal__error" id="confirm-new-password-error">
          {errorMessage.confirmNewPassword}
        </span>
      </label>
    </ModalWithForm>
  );
}
