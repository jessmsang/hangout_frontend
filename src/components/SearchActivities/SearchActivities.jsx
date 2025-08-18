import { useContext, useState } from "react";
import "./SearchActivities.css";
import ActivitiesCarousel from "../ActivitiesCarousel/ActivitiesCarousel";
import FilterContext from "../../contexts/FilterContext";
import ActivityCriteriaForm from "../ActivityCriteriaForm/ActivityCriteriaForm";

export default function SearchActivities() {
  const { filters, updateFilter, filteredActivities } =
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
    <section className="search-activities">
      <div
        className={`search-activities__header ${
          formIsVisible ? "search-activities__header-with-padding" : ""
        }`}
      >
        <h2 className="search-activities__title">Search for Activities</h2>
        <button
          className="search-activities__filter-btn"
          onClick={toggleDisplayFilterForm}
        ></button>
      </div>

      {formIsVisible && (
        <ActivityCriteriaForm
          variant="search"
          filter={filters.search}
          updateFilter={(newData) => updateFilter("search", newData)}
          onReset={handleReset}
        />
      )}

      <ActivitiesCarousel activities={filteredActivities.search} />
    </section>
  );
}
