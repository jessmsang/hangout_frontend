import { useContext, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";
import UserContext from "../../contexts/UserContext";
import LoadingContext from "../../contexts/LoadingContext";

export default function EditProfileModal({ onClose, isOpen }) {
  const { currentUser, handleUpdateProfile } = useContext(UserContext);
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const { values, handleChange, setValues, isValid } = useForm({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
  });

  useEffect(() => {
    setValues({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
    });
  }, [currentUser, setValues]);

  const handleEditProfileSubmit = (evt) => {
    evt.preventDefault();
    handleUpdateProfile(values);
    onClose();
  };

  return (
    <ModalWithForm
      variant="edit-profile"
      titleText="Update profile data"
      name="edit-profile-modal"
      btnText={isLoading ? "Saving..." : "Save changes"}
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleEditProfileSubmit}
      isDisabled={isLoading || !isValid}
    >
      <label htmlFor="edit-name-input" className="modal__label">
        Name*
        <input
          type="text"
          name="name"
          id="edit-name-input"
          className="modal__input"
          placeholder="Name"
          required
          minLength="1"
          maxLength="30"
          onChange={handleChange}
          value={values.name}
        />
        <span className="modal__error" id="name-input-error"></span>
      </label>

      <label htmlFor="edit-email-input" className="modal__label">
        Email*
        <input
          type="email"
          name="email"
          id="edit-email-input"
          className="modal__input"
          placeholder="Email"
          required
          onChange={handleChange}
          value={values.email}
        />
        <span className="modal__error" id="email-input-error"></span>
      </label>
    </ModalWithForm>
  );
}
