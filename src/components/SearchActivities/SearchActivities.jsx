import { useContext, useState } from "react";
import "./SearchActivities.css";
import ActivitiesCarousel from "../ActivitiesCarousel/ActivitiesCarousel";
import FilterContext from "../../contexts/FilterContext";
import ActivityCriteriaForm from "../ActivityCriteriaForm/ActivityCriteriaForm";

export default function SearchActivities() {
  const {
    seasons,
    setSeasons,
    location,
    setLocation,
    category,
    setCategory,
    groupSize,
    setGroupSize,
    cost,
    setCost,
    isExactGroupSize,
    setIsExactGroupSize,
    isExactCost,
    setIsExactCost,
    filteredActivities,
  } = useContext(FilterContext);

  const handleReset = () => {
    setSeasons([]);
    setLocation([]);
    setCategory([]);
    setCost({ min: "$", max: "$$$" });
    setGroupSize({ min: 1, max: 12 });
    setIsExactCost(false);
    setIsExactGroupSize(false);
  };

  const [formIsVisible, setFormIsVisible] = useState(false);

  const toggleDisplayFilterForm = () => {
    setFormIsVisible(!formIsVisible);
  };

  return (
    <section className="search-activities">
      <div
        className={`search-activities__header ${
          formIsVisible ? `search-activities__header-with-padding` : ""
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
          onReset={handleReset}
        />
      )}
      <ActivitiesCarousel activities={filteredActivities} />
    </section>
  );
}
