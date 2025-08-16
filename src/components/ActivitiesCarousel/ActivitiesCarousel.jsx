import { useContext, useRef } from "react";
import "./ActivitiesCarousel.css";

import ActivityCard from "../ActivityCard/ActivityCard";
import ActivitiesContext from "../../contexts/ActivitiesContext";

export default function ActivitiesCarousel({ activities }) {
  const activitiesCarouselRef = useRef();

  const { activities: allActivities } = useContext(ActivitiesContext);

  const activitiesToDisplay = activities?.length ? activities : allActivities;

  const scrollVisibleCards = (direction) => {
    if (!activitiesCarouselRef.current) return;

    const track = activitiesCarouselRef.current;
    const cards = Array.from(track.querySelectorAll(".card"));
    if (!cards.length) return;

    const trackWidth = track.offsetWidth;
    const cardStyle = getComputedStyle(cards[0]);
    const cardWidth =
      cards[0].offsetWidth +
      parseFloat(cardStyle.marginLeft) +
      parseFloat(cardStyle.marginRight);

    const currentScroll = track.scrollLeft;

    let firstVisibleIndex = 0;
    for (let i = 0; i < cards.length; i++) {
      const cardLeft = cards[i].offsetLeft;
      if (cardLeft >= currentScroll - 1) {
        firstVisibleIndex = i;
        break;
      }
    }

    const visibleCards = Math.floor(trackWidth / cardWidth);

    let targetIndex;
    if (direction === "right") {
      targetIndex = firstVisibleIndex + visibleCards;
    } else {
      targetIndex = Math.max(firstVisibleIndex - visibleCards, 0);
    }

    const targetCard = cards[targetIndex];
    if (targetCard) {
      track.scrollTo({
        left: targetCard.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="activities-carousel">
      <button
        className="activities-carousel__arrow left"
        onClick={() => scrollVisibleCards("left")}
      >
        ◀
      </button>
      <ul className="activities-carousel__track" ref={activitiesCarouselRef}>
        {activitiesToDisplay.map((activity) => (
          <ActivityCard key={activity._id} activity={activity} />
        ))}
      </ul>
      <button
        className="activities-carousel__arrow right"
        onClick={() => scrollVisibleCards("right")}
      >
        ▶
      </button>
    </div>
  );
}
