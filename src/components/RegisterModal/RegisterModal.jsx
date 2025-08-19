import { useForm } from "../../hooks/useForm";
import { useContext } from "react";

import UserContext from "../../contexts/UserContext";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function RegisterModal({ onClose, isOpen, isLoading, setActiveModal }) {
  const { handleRegistration } = useContext(UserContext);

  const { values, handleChange, setValues, errorMessage, isValid } = useForm(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    {
      matchFields: {
        field: "password",
        confirmField: "confirmPassword",
      },
    }
  );

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (values.password !== values.confirmPassword) {
      return;
    } else {
      handleRegistration(values, () => {
        setValues({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      });
    }
  };

  return (
    <ModalWithForm
      variant="register"
      titleText="Sign Up"
      name="register-modal"
      btnText={isLoading ? "Signing up..." : "Sign Up"}
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onNavBtnClick={() => setActiveModal("login-modal")}
      navBtnText="or Log In"
      isDisabled={isLoading || !isValid}
    >
      <label htmlFor="register-name-input" className="modal__label">
        Name*:
        <input
          type="text"
          name="name"
          id="name-input"
          className="modal__input"
          placeholder="Name"
          required
          minLength="1"
          maxLength="30"
          onChange={handleChange}
          value={values.name}
        />
        <span className="modal__error" id="register-name-input-error">
          {errorMessage.name}
        </span>
      </label>
      <label htmlFor="register-email-input" className="modal__label">
        Email*:
        <input
          type="email"
          name="email"
          id="email-input"
          className="modal__input"
          placeholder="Email"
          required
          minLength="1"
          maxLength="30"
          onChange={handleChange}
          value={values.email}
        />
        <span className="modal__error" id="email-input-error">
          {errorMessage.email}
        </span>
      </label>
      <label htmlFor="password-input" className="modal__label">
        Password*:
        <input
          type="password"
          name="password"
          id="password-input"
          className="modal__input"
          placeholder="Password"
          required
          pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*_+-=?]).{8,50}$"
          onChange={handleChange}
          value={values.password}
        />
        <span className="modal__error" id="password-input-error">
          {errorMessage.password}
        </span>
      </label>
      <label htmlFor="confirm-password-input" className="modal__label">
        Confirm Password*:
        <input
          type="password"
          name="confirmPassword"
          id="confirm-password-input"
          className="modal__input"
          placeholder="Confirm Password"
          required
          minLength="8"
          maxLength="50"
          onChange={handleChange}
          value={values.confirmPassword}
        />
        <span className="modal__error" id="confirm-password-input-error">
          {errorMessage.confirmPassword}
        </span>
      </label>
    </ModalWithForm>
  );
}
export default RegisterModal;
