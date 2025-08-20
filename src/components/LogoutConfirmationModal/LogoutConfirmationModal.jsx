import { useContext } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import LoadingContext from "../../contexts/LoadingContext";

export default function LogoutConfirmationModal({ isOpen, onClose, onLogout }) {
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogout) {
      onLogout();
    }
    onClose();
  };

  return (
    <ModalWithForm
      variant="logout-confirmation"
      titleText="Are you sure you want to logout?"
      btnText={isLoading ? "Logging out..." : "Yes, logout"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isDisabled={isLoading}
      showCancel={true}
    />
  );
}
