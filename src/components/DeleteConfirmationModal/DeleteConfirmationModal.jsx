import ModalWithForm from "../ModalWithForm/ModalWithForm";

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  card,
  onDelete,
  isLoading,
}) {
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
