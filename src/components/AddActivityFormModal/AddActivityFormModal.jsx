import "./AddActivityFormModal.css";

import { useState } from "react";
import ActivityCriteriaForm from "../ActivityCriteriaForm/ActivityCriteriaForm";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

export default function AddActivityFormModal({ isOpen, onClose, isLoading }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [seasons, setSeasons] = useState([]);
  const [location, setLocation] = useState([]);
  const [category, setCategory] = useState([]);
  const [groupSize, setGroupSize] = useState({ min: 1, max: 12 });
  const [cost, setCost] = useState({ min: "$", max: "$$$" });
  const [isExactGroupSize, setIsExactGroupSize] = useState(false);
  const [isExactCost, setIsExactCost] = useState(false);

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

  const generateIdFromName = (input) => {
    return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newActivity = {
      id: generateIdFromName(name),
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

    console.log("Submitting new activity:", newActivity);
  };

  return (
    <ModalWithForm
      variant="add-activity"
      titleText="Add New Activity"
      btnText={isLoading ? "Adding activity..." : "Add Activity"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
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
          />
        </label>
        <ActivityCriteriaForm
          variant="modal"
          seasons={seasons}
          setSeasons={setSeasons}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          groupSize={groupSize}
          setGroupSize={setGroupSize}
          cost={cost}
          setCost={setCost}
          isExactGroupSize={isExactGroupSize}
          setIsExactGroupSize={setIsExactGroupSize}
          isExactCost={isExactCost}
          setIsExactCost={setIsExactCost}
          onReset={handleFormReset}
        />
      </section>
    </ModalWithForm>
  );
}
