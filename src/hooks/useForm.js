import { useState } from "react";

export function useForm(inputValues, { matchFields = {} } = {}) {
  const [values, setValues] = useState(inputValues);
  const [errorMessage, setErrorMessage] = useState({});

  const handleChange = (evt) => {
    const { value, name } = evt.target;
    const { field, confirmField } = matchFields;
    let updatedValues = { ...values, [name]: value };
    let validationMessage = "";
    const matchMessage = "Fields don't match";
    const validity = evt.target.validity;

    if (evt.target.name !== confirmField) {
      if (!validity.valid) {
        if (validity.valueMissing) {
          validationMessage = "This field is required";
        }
        if (validity.typeMismatch && evt.target.type === "email") {
          validationMessage = "Please enter a valid email address";
        }
        if (validity.patternMismatch) {
          validationMessage =
            "Requirements: at least 1 uppercase letter, at least 1 special character (!@#$%^&*_+-=?), 8-50 characters long";
        }
      } else {
        validationMessage = "";
      }
    }

    if (field && confirmField) {
      if (updatedValues[confirmField] !== "") {
        if (evt.target.name === confirmField) {
          validationMessage =
            value === updatedValues[field] ? "" : matchMessage;
        } else if (evt.target.name === field) {
          if (value === updatedValues[confirmField]) {
            validationMessage = "";
          }
        }
      }
    }

    setValues(updatedValues);

    setErrorMessage({
      ...errorMessage,
      [name]: validationMessage,
      [confirmField]:
        updatedValues[confirmField] !== updatedValues[field]
          ? matchMessage
          : null,
    });
  };

  const hasErrors =
    Object.values(errorMessage).some((msg) => msg && msg.length > 0) ||
    Object.values(values).some((val) => val === "");

  const isValid = !hasErrors;

  return {
    values,
    handleChange,
    setValues,
    setErrorMessage,
    errorMessage,
    hasErrors,
    isValid,
  };
}
