import "./SearchActivities.css";
import ActivitiesCarousel from "../ActivitiesCarousel/ActivitiesCarousel";

export default function SearchActivities() {
  return (
    <section className="search-activities">
      <div className="search-activities__header">
        <h2 className="search-activities__title">Search for Activities</h2>
        <button className="search-activities__filter-btn"></button>
      </div>
      <ActivitiesCarousel />
    </section>
  );
}
