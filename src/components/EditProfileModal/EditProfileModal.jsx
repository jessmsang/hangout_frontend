import { useContext, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";
import UserContext from "../../contexts/UserContext";

export default function EditProfileModal({ onClose, isOpen, isLoading }) {
  const { currentUser, handleUpdateProfile } = useContext(UserContext);

  const { values, handleChange, setValues } = useForm({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
  });

  useEffect(() => {
    setValues({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
    });
  }, [currentUser]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await handleUpdateProfile(values);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalWithForm
      variant="edit-profile"
      titleText="Update profile data"
      name="edit-profile-modal"
      btnText={isLoading ? "Saving..." : "Save changes"}
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
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
