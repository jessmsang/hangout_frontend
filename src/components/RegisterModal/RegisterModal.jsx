import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";

function RegisterModal({ onClose, isOpen, handleRegistration, isLoading }) {
  const { values, handleChange, setValues, errorMessage } = useForm(
    {
      registerName: "",
      registerEmail: "",
      registerPassword: "",
      confirmPassword: "",
    },
    {
      matchFields: {
        field: "registerPassword",
        confirmField: "confirmPassword",
      },
    }
  );

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (values.registerPassword !== values.confirmPassword) {
      return;
    } else {
      handleRegistration(values, () => {
        setValues({
          registerName: "",
          registerEmail: "",
          registerPassword: "",
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
      // onNavBtnClick={() => setActiveModal("login-modal")}
      // navBtnText="or Log In"
    >
      <label htmlFor="register-name-input" className="modal__label">
        Name*:
        <input
          type="text"
          name="registerName"
          id="register-name-input"
          className="modal__input"
          placeholder="Name"
          required
          minLength="1"
          maxLength="30"
          onChange={handleChange}
          value={values.registerName}
        />
        <span className="modal__error" id="register-name-input-error">
          {errorMessage.registerName}
        </span>
      </label>
      <label htmlFor="register-email-input" className="modal__label">
        Email*:
        <input
          type="email"
          name="registerEmail"
          id="register-email-input"
          className="modal__input"
          placeholder="Email"
          required
          minLength="1"
          maxLength="30"
          onChange={handleChange}
          value={values.registerEmail}
        />
        <span className="modal__error" id="register-email-input-error">
          {errorMessage.registerEmail}
        </span>
      </label>
      <label htmlFor="register-password-input" className="modal__label">
        Password*:
        <input
          type="password"
          name="registerPassword"
          id="register-password-input"
          className="modal__input"
          placeholder="Password"
          required
          pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*_+-=?]).{8,50}$"
          onChange={handleChange}
          value={values.registerPassword}
        />
        <span className="modal__error" id="register-password-input-error">
          {errorMessage.registerPassword}
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
