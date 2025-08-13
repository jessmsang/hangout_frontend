import { useContext } from "react";
import "./SearchActivities.css";
import ActivitiesCarousel from "../ActivitiesCarousel/ActivitiesCarousel";
import FilterContext from "../../contexts/FilterContext";
import FilterActivitiesForm from "../FilterActivitiesForm/FilterActivitiesForm";

export default function SearchActivities() {
  const { filteredActivities } = useContext(FilterContext);
  return (
    <section className="search-activities">
      <div className="search-activities__header">
        <h2 className="search-activities__title">Search for Activities</h2>
        <button className="search-activities__filter-btn"></button>
      </div>
      <ActivitiesCarousel activities={filteredActivities} />
      <FilterActivitiesForm />
    </section>
  );
}
