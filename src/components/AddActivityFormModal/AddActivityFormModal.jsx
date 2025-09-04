import "./AddActivityFormModal.css";

import { useContext, useState } from "react";
import ActivityCriteriaForm from "../ActivityCriteriaForm/ActivityCriteriaForm";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import LoadingContext from "../../contexts/LoadingContext";

export default function AddActivityFormModal({
  isOpen,
  onClose,
  handleAddActivity,
}) {
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [seasons, setSeasons] = useState([]);
  const [location, setLocation] = useState([]);
  const [category, setCategory] = useState([]);
  const [groupSize, setGroupSize] = useState({ min: 1, max: 12 });
  const [cost, setCost] = useState({ min: "$", max: "$$$" });
  const [isExactGroupSize, setIsExactGroupSize] = useState(false);
  const [isExactCost, setIsExactCost] = useState(false);
  const [formError, setFormError] = useState("");

  const filter = {
    seasons,
    location,
    category,
    groupSize,
    cost,
    isExactGroupSize,
    isExactCost,
  };

  const updateFilter = (updates) => {
    if (updates.seasons !== undefined) setSeasons(updates.seasons);
    if (updates.location !== undefined) setLocation(updates.location);
    if (updates.category !== undefined) setCategory(updates.category);
    if (updates.groupSize !== undefined) setGroupSize(updates.groupSize);
    if (updates.cost !== undefined) setCost(updates.cost);
    if (updates.isExactGroupSize !== undefined)
      setIsExactGroupSize(updates.isExactGroupSize);
    if (updates.isExactCost !== undefined) setIsExactCost(updates.isExactCost);
  };

  const handleFormReset = () => {
    setName("");
    setDescription("");
    setSeasons([]);
    setLocation([]);
    setCategory([]);
    setCost({ min: "$", max: "$$$" });
    setGroupSize({ min: 1, max: 12 });
    setIsExactCost(false);
    setIsExactGroupSize(false);
  };

  const handleAddActivitySubmit = (evt) => {
    evt.preventDefault();

    if (
      !name.trim() ||
      !description.trim() ||
      !seasons.length ||
      !location.length ||
      !category.length
    ) {
      setFormError("Please fill out all required fields.");
      return;
    }

    setFormError("");

    const newActivity = {
      name,
      description,
      seasons,
      location,
      category,
      groupSize,
      cost,
      isSaved: false,
      isCompleted: false,
    };

    setIsLoading(true);
    setFormError("");

    console.log("Submitting new activity:", newActivity);
    handleAddActivity(newActivity)
      .then(() => {
        handleFormReset();
        onClose();
      })
      .catch((err) => {
        setFormError(err.message || "Something went wrong");
      });
  };

  const isValid =
    name.trim() !== "" &&
    description.trim() !== "" &&
    seasons.length > 0 &&
    location.length > 0 &&
    category.length > 0;

  return (
    <ModalWithForm
      variant="add-activity"
      titleText="Add New Activity"
      btnText={isLoading ? "Adding activity..." : "Add Activity"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleAddActivitySubmit}
      isDisabled={isLoading || !isValid}
    >
      <section className="add-activity-form">
        <label className="add-activity-form__label">
          Activity Name
          <input
            type="text"
            className="add-activity-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter activity name"
            required
          />
        </label>

        <label className="add-activity-form__label">
          Description
          <textarea
            className="add-activity-form__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the activity..."
            rows="3"
            maxLength={200}
            required
          />
        </label>
        <ActivityCriteriaForm
          variant="modal"
          filter={filter}
          updateFilter={updateFilter}
          onReset={handleFormReset}
        />
        {formError && <p className="add-activity-form__error">{formError}</p>}
      </section>
    </ModalWithForm>
  );
}
