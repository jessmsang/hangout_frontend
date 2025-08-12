import { useContext } from "react";
import "./ActivityCard.css";

// import UserContext from "../../contexts/UserContext";

import { activityCategoryLabels } from "../../constants/activityCategories";
import { categoryIcons } from "../../constants/categoryIcons";

export default function ActivityCard({ activity }) {
  // TODO: ADD USER CONTEXT
  // const { currentUser, isLoggedIn } = useContext(UserContext);

  const categories = Array.isArray(activity.category)
    ? activity.category
    : [activity.category];

  const categoriesAlphabetical = categories.sort();

  const groupSize = activity.groupSize;

  function formatGroupSize(groupSize) {
    const { min, max } = groupSize || {};
    if (min && max) {
      if (min === max) {
        return min === 1 ? "1 person" : `${min} people`;
      }
      return `${min}-${max} people`;
    }
    if (min) {
      return min === 1 ? "1+ person" : `${min}+ people`;
    }
    if (max) {
      return `Up to ${max} people`;
    }
    return "Any group size";
  }
  const groupSizeLabel = formatGroupSize(groupSize);

  const cost = activity.cost;

  function formatCost(cost) {
    if (!cost) return "Cost unknown";

    const { min, max } = cost;

    if (min && max) {
      if (min === max) {
        return min; // exact cost like "$$"
      } else {
        return `${min} - ${max}`; // range like "$ - $$"
      }
    }

    // If only min or max is present, just show that value:
    if (min) return min;
    if (max) return max;

    return "Cost unknown";
  }

  const costLabel = formatCost(cost);

  // TODO: HANDLE CARD LIKES
  // const handleCardClick = () => {
  //     onCardClick(activity);
  //   };
  //
  //   const handleLike = () => {
  //     onCardLike({ id: activity._id, isLiked });
  //   };

  //   const isLiked = currentUser
  //     ? activity.likes.some((id) => id === currentUser._id)
  //     : false;

  //   const activityLikeBtnClassName = isLiked
  //     ? "card__like-filled"
  //     : "card__like-empty";

  return (
    <li className="card">
      <div className="card__container">
        <div className="card__header">
          <div className="card__categories-container">
            {categoriesAlphabetical.map((category) => {
              const Icon = categoryIcons[category] || categoryIcons.default;
              const label = activityCategoryLabels[category] || "Unknown";
              return (
                <div key={category} className="card__category-item">
                  {Icon && (
                    <img
                      src={Icon}
                      alt={label}
                      className="card__category-icon"
                    />
                  )}
                  <span className="card__category-label">{label}</span>
                </div>
              );
            })}
          </div>
          {/*TODO: ADD USER CONTEXT
           {currentUser && isLoggedIn && (
            <button
              className={activityLikeBtnClassName}
              //   onClick={handleLike}
            ></button>
          )} */}
        </div>
        <div className="card__text-container">
          <h3 className="card__name">{activity.name}</h3>
          <p className="card__description">{activity.description}</p>
        </div>
        <div className="card__footer">
          <div className="card__cost">{costLabel}</div>
          <div className="card__group-size">{groupSizeLabel}</div>
        </div>
      </div>
    </li>
  );
}
