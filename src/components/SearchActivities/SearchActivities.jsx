import { useContext, useState } from "react";
import "./SearchActivities.css";
import ActivitiesCarousel from "../ActivitiesCarousel/ActivitiesCarousel";
import FilterContext from "../../contexts/FilterContext";
import FilterActivitiesForm from "../FilterActivitiesForm/FilterActivitiesForm";

export default function SearchActivities() {
  const { filteredActivities } = useContext(FilterContext);

  const [formIsVisible, setFormIsVisible] = useState(false);

  const toggleDisplayActivitiesForm = () => {
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
          onClick={toggleDisplayActivitiesForm}
        ></button>
      </div>
      {formIsVisible && <FilterActivitiesForm />}
      <ActivitiesCarousel activities={filteredActivities} />
    </section>
  );
}
