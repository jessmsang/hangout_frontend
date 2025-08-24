import { useContext } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import LoadingContext from "../../contexts/LoadingContext";

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  card,
  onDelete,
  variant = "default",
}) {
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const handleDelete = (e) => {
    e.preventDefault();
    onDelete(card);
  };

  const titleText =
    variant === "account"
      ? "Are you sure you want to delete your account? This action cannot be undone."
      : variant === "activity"
      ? "Are you sure you want to delete this activity? This action cannot be undone."
      : "Are you sure you want to delete this? This action cannot be undone.";

  const btnText = isLoading
    ? "Deleting..."
    : variant === "account"
    ? "Yes, delete account"
    : variant === "activity"
    ? "Yes, delete activity"
    : "Yes, delete";

  return (
    <ModalWithForm
      variant="delete-confirmation"
      titleText={titleText}
      btnText={btnText}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleDelete}
      isDisabled={isLoading}
      showCancel={true}
    />
  );
}
