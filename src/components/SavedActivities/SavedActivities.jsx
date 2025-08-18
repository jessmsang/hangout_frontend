import { useContext, useState } from "react";
import "./SavedActivities.css";
import ActivitiesCarousel from "../ActivitiesCarousel/ActivitiesCarousel";
import FilterContext from "../../contexts/FilterContext";
import ActivityCriteriaForm from "../ActivityCriteriaForm/ActivityCriteriaForm";

export default function SavedActivities() {
  const { filters, updateFilter, filteredActivities, savedActivities } =
    useContext(FilterContext);
  const [formIsVisible, setFormIsVisible] = useState(false);

  const toggleDisplayFilterForm = () => setFormIsVisible(!formIsVisible);

  const handleReset = () => {
    updateFilter({
      seasons: [],
      location: [],
      category: [],
      groupSize: { min: 1, max: 12 },
      cost: { min: "$", max: "$$$" },
      isExactGroupSize: false,
      isExactCost: false,
    });
  };

  return (
    <section className="saved-activities">
      <div
        className={`saved-activities__header ${
          formIsVisible ? "saved-activities__header-with-padding" : ""
        }`}
      >
        <h2 className="saved-activities__title">Saved Activities</h2>
        <button
          className="saved-activities__filter-btn"
          onClick={toggleDisplayFilterForm}
        ></button>
      </div>

      {formIsVisible && (
        <ActivityCriteriaForm
          variant="search"
          filter={filters.saved}
          updateFilter={(newData) => updateFilter("saved", newData)}
          onReset={handleReset}
        />
      )}

      {filteredActivities.saved.length > 0 ? (
        <ActivitiesCarousel activities={filteredActivities.saved} />
      ) : (
        <p className="saved-activities__empty-text">No Cards Saved</p>
      )}
    </section>
  );
}
