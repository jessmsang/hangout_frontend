import ModalWithForm from "../ModalWithForm/ModalWithForm";

export default function LogoutConfirmationModal({
  isOpen,
  onClose,
  onLogout,
  isLoading,
}) {
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
