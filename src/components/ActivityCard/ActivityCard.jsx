import { useContext } from "react";
import "./ActivityCard.css";

import UserContext from "../../contexts/UserContext";

// TO COMPLETE AFTER MEETING:
// import {
//   activityCategories,
//   activityCategoryLabels,
// } from "../../constants/activityCategories";
// import { categoryIcons } from "../../constants/categoryIcons";

export default function ActivityCard({ activity }) {
  const { currentUser, isLoggedIn } = useContext(UserContext);

  // TO COMPLETE AFTER MEETING:
  //   const Icon = categoryIcons[activity.activityCategory];

  //   const categories = Array.isArray(activity.category)
  //     ? activity.category
  //     : [activity.category];

  //   const categoryLabel = activityCategoryLabels[activity.category] || "Unknown";

  //   const activityIcon = categoryIcons[activity.activityCategory] || DefaultIcon;

  // const handleCardClick = () => {
  //     onCardClick(activity);
  //   };
  //
  //   const handleLike = () => {
  //     onCardLike({ id: activity._id, isLiked });
  //   };

  const isLiked = currentUser
    ? activity.likes.some((id) => id === currentUser._id)
    : false;

  const activityLikeBtnClassName = isLiked
    ? "card__like-filled"
    : "card__like-empty";

  return (
    <li className="card">
      <div className="card__container">
        <div className="card__header">
          <img src="null" alt="" className="card__icon" />
          <h3 className="card__name">{activity.name}</h3>
          {currentUser && isLoggedIn && (
            <button
              className={activityLikeBtnClassName}
              //   onClick={handleLike}
            ></button>
          )}
        </div>
        {/* TO COMPLETE AFTER MEETING: */}
        {/* <div className="card__category-list">
          {categories.map((category) => {
            //   const Icon = categoryIcons[category];
            const label = activityCategoryLabels[category] || "Unknown";
            return (
              <div key={category} className="category-item">
                {Icon && <Icon className="category-icon" />}
                <span>{label}</span>
              </div>
            );
          })}
        </div> */}
        <div className="card__description-container">
          <p className="card__description">{activity.description}</p>
        </div>
      </div>
    </li>
  );
}
