import "./Carousel.css";

import activitiesData from "../../../db.json";
import ActivityCard from "../ActivityCard/ActivityCard";

export default function Carousel() {
  const activities = activitiesData.activities;
  return (
    <div className="carousel">
      <button className="carousel-btn__left"></button>
      <ul className="carousel__cards-list">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </ul>
      <button className="carousel-btn__right"></button>
    </div>
  );
}
