import "./RecommendedActivities.css";

import activitiesData from "../../../db.json";
import ActivityCard from "../ActivityCard/ActivityCard";
import Carousel from "../Carousel/Carousel";

export default function RecommendedActivities() {
  const activities = activitiesData.activities;

  return (
    <div className="recommended-activities">
      <h2 className="recommended-activities__title">Recommended Activities</h2>
      <Carousel />
    </div>
  );
}
