import { useContext } from "react";
import "./RecommendedActivities.css";

import FilterContext from "../../contexts/FilterContext";
import ActivitiesCarousel from "../ActivitiesCarousel/ActivitiesCarousel";

export default function RecommendedActivities() {
  const { activitiesFilteredByWeather } = useContext(FilterContext);

  return (
    <section className="recommended-activities">
      <div className="recommended-activities__header">
        <h2 className="recommended-activities__title">
          Recommended Activities
        </h2>
      </div>
      <ActivitiesCarousel activities={activitiesFilteredByWeather} />
    </section>
  );
}
