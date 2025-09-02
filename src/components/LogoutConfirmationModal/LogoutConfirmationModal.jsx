import { useContext } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import LoadingContext from "../../contexts/LoadingContext";
import UserContext from "../../contexts/UserContext";

export default function LogoutConfirmationModal({ isOpen, onClose }) {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { handleLogout } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleLogout) return;

    setIsLoading(true);

    try {
      const result = handleLogout();
      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
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
