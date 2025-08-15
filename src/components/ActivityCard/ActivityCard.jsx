import { useContext, useState } from "react";
import "./ActivityCard.css";

import UserContext from "../../contexts/UserContext";

import { activityCategoryLabels } from "../../constants/activityCategories";
import { categoryIcons } from "../../constants/categoryIcons";
import FilterContext from "../../contexts/FilterContext";

export default function ActivityCard({ activity }) {
  const { isLiked, setIsLiked, isCompleted, setIsCompleted } =
    useContext(FilterContext);

  const toggleIsLiked = () => {
    setIsLiked((prev) => !prev);
  };

  const toggleIsCompleted = () => {
    setIsCompleted((prev) => !prev);
  };

  // TODO: ADD USER CONTEXT
  const { currentUser, isLoggedIn } = useContext(UserContext);

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
        return min;
      } else {
        return `${min} - ${max}`;
      }
    }

    if (min) return min;
    if (max) return max;

    return "Cost unknown";
  }

  const costLabel = formatCost(cost);

  // const handleLike = () => {
  //   onCardLike({ id: activity._id, isLiked });
  // };

  // const isLiked = currentUser
  //   ? activity.likes.some((id) => id === currentUser._id)
  //   : false;

  // const activityLikeBtnClassName = isLiked
  //   ? "card__like-btn-liked"
  //   : "card__like-btn-not-liked";

  return (
    <li className="card">
      <div className="card__container">
        {isLoggedIn && (
          <div className="card__header">
            <ul className="card__header-list">
              <li className="card__header-list-item">
                <button
                  className={`${
                    !isLiked
                      ? "card__like-btn-not-liked"
                      : "card__like-btn-liked"
                  }`}
                  onClick={toggleIsLiked}
                ></button>
              </li>
              <li className="card__header-list-item">
                <button
                  className={`${
                    !isCompleted
                      ? "card__complete-btn-not-completed"
                      : "card__complete-btn-completed"
                  }`}
                  onClick={toggleIsCompleted}
                ></button>
              </li>
            </ul>
          </div>
        )}
        <div className="card__categories-container">
          {categoriesAlphabetical.map((category) => {
            const Icon = categoryIcons[category] || categoryIcons.default;
            const label = activityCategoryLabels[category] || "Unknown";
            return (
              <div key={category} className="card__category-item">
                {Icon && (
                  <img src={Icon} alt={label} className="card__category-icon" />
                )}
                <span className="card__category-label">{label}</span>
              </div>
            );
          })}
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
