import { useContext } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import LoadingContext from "../../contexts/LoadingContext";

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  card,
  onDelete,
}) {
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const handleDelete = (e) => {
    e.preventDefault();
    onDelete(card);
  };

  return (
    <ModalWithForm
      variant="delete-confirmation"
      titleText="Are you sure you want to delete your account? This action cannot be undone."
      btnText={isLoading ? "Deleting..." : "Yes, delete account"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleDelete}
      isDisabled={isLoading}
      showCancel={true}
    />
  );
}
