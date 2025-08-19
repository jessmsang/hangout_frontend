import "./ModalWithForm.css";

function ModalWithForm({
  children,
  variant,
  titleText,
  btnText,
  onClose,
  isOpen,
  onSubmit,
  onNavBtnClick,
  navBtnText,
  isDisabled,
}) {
  const handleModalBackdropClick = (e) => {
    if (e.target.classList.contains("modal")) {
      onClose();
    }
  };

  return (
    <div
      className={`modal ${isOpen ? "modal_opened" : ""}`}
      id="modal-with-form"
      onClick={handleModalBackdropClick}
    >
      <div
        className={`modal__container ${
          variant ? `modal__container_${variant}` : ""
        }`}
      >
        <h2 className="modal__title">{titleText}</h2>
        <button
          onClick={onClose}
          type="button"
          className="modal__close-btn"
        ></button>
        <form className="modal__form" onSubmit={onSubmit}>
          {children}
          <div className="modal__btn-wrapper">
            <button
              className={`modal__submit-btn ${
                variant ? `modal__submit-btn_${variant}` : ""
              }`}
              type="submit"
              disabled={isDisabled}
            >
              {btnText}
            </button>
            {navBtnText && (
              <button
                className="modal__nav-btn"
                type="button"
                onClick={onNavBtnClick}
              >
                {navBtnText}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
