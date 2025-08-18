import { useContext } from "react";
import { useForm } from "../../hooks/useForm";

import ModalWithForm from "../ModalWithForm/ModalWithForm";
import UserContext from "../../contexts/UserContext";

function LoginModal({ onClose, isOpen, isLoading, setActiveModal }) {
  const { handleLogin } = useContext(UserContext);

  const { values, handleChange, setValues, errorMessage } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleLogin(values, () => {
      setValues({
        email: "",
        password: "",
      });
    });
  };

  return (
    <ModalWithForm
      variant="login"
      titleText="Log In"
      name="login-modal"
      btnText={isLoading ? "Logging In..." : "Log In"}
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onNavBtnClick={() => setActiveModal("register-modal")}
      navBtnText="or Sign Up"
    >
      <label htmlFor="login-email-input" className="modal__label">
        Email*
        <input
          type="email"
          name="email"
          id="login-email-input"
          className="modal__input"
          placeholder="Email"
          required
          minLength="1"
          maxLength="30"
          onChange={handleChange}
          value={values.email}
        />
        <span className="modal__error" id="login-email-input-error">
          {errorMessage.email}
        </span>
      </label>
      <label htmlFor="login-password-input" className="modal__label">
        Password*
        <input
          type="password"
          name="password"
          id="login-password-input"
          className="modal__input"
          placeholder="Password"
          required
          minLength="8"
          maxLength="50"
          onChange={handleChange}
          value={values.password}
        />
        <span className="modal__error" id="login-password-input-error">
          {errorMessage.password}
        </span>
      </label>
    </ModalWithForm>
  );
}
export default LoginModal;
