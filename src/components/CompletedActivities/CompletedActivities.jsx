import { useContext } from "react";
import "./CompletedActivities.css";
import ActivitiesCarousel from "../ActivitiesCarousel/ActivitiesCarousel";
import FilterContext from "../../contexts/FilterContext";

export default function CompletedActivities() {
  const { completedActivities } = useContext(FilterContext);

  return (
    <section className="completed-activities">
      <div className="completed-activities__header">
        <h2 className="completed-activities__title">Completed Activities</h2>
      </div>

      {completedActivities.length > 0 ? (
        <ActivitiesCarousel activities={completedActivities} />
      ) : (
        <p className="completed-activities__empty-text">No Cards Completed</p>
      )}
    </section>
  );
}
