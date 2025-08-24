import { useContext } from "react";
import "./ActivityCard.css";

// import UserContext from "../../contexts/UserContext";

import { activityCategoryLabels } from "../../constants/activityCategories";
import { categoryIcons } from "../../constants/categoryIcons";

import { activitySeasonsLabels } from "../../constants/activitySeasons";
import { seasonsIcons } from "../../constants/seasonsIcons";

import FilterContext from "../../contexts/FilterContext";
import UserContext from "../../contexts/UserContext";
import DeleteContext from "../../contexts/DeleteContext";
// import { data } from "react-router-dom";

export default function ActivityCard({ activity }) {
  const { handleCardSave, handleCardComplete } = useContext(FilterContext);
  const { isLoggedIn, currentUser } = useContext(UserContext);
  const { openDeleteConfirmationModal } = useContext(DeleteContext);

  const isSaved = currentUser?.savedActivities?.includes(activity._id);
  const isCompleted = currentUser?.completedActivities?.includes(activity._id);
  const isOwner = currentUser ? activity.owner === currentUser._id : false;

  const toggleIsSaved = () => {
    handleCardSave({ _id: activity._id });
  };

  const toggleIsCompleted = () => {
    handleCardComplete({ _id: activity._id });
  };

  const categories = Array.isArray(activity.category)
    ? activity.category
    : [activity.category];

  const categoriesAlphabetical = categories.sort();

  const seasons = Array.isArray(activity.seasons)
    ? activity.seasons
    : [activity.seasons];

  const seasonsAlphabetical = seasons.sort();

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

  const location = activity.location;

  function formatLocation(location) {
    if (!Array.isArray(location)) return "";

    const normalized = [
      ...new Set(location.map((loc) => loc.trim().toLowerCase())),
    ];

    const hasIndoor = normalized.includes("indoor");
    const hasOutdoor = normalized.includes("outdoor");

    if (hasIndoor && hasOutdoor) return "Indoor/Outdoor";
    if (hasIndoor) return "Indoor";
    if (hasOutdoor) return "Outdoor";

    return "";
  }

  const locationLabel = formatLocation(location);

  return (
    <li className="card">
      <div className="card__container">
        {isLoggedIn && currentUser && (
          <div className="card__header">
            <ul className="card__header-list">
              {isOwner && (
                <li className="card__header-list-item">
                  <button
                    className="card__delete-btn"
                    onClick={() =>
                      openDeleteConfirmationModal("activity", activity)
                    }
                  ></button>
                </li>
              )}
              <li className="card__header-list-item card__header-right">
                <button
                  className={`${
                    !isSaved
                      ? "card__save-btn-not-saved"
                      : "card__save-btn-saved"
                  }`}
                  onClick={toggleIsSaved}
                />
                <button
                  className={`${
                    !isCompleted
                      ? "card__complete-btn-not-completed"
                      : "card__complete-btn-completed"
                  }`}
                  onClick={toggleIsCompleted}
                />
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
          <div className="card__footer-first-row">
            <div className="card__location">{locationLabel}</div>
            <div className="card__cost">{costLabel}</div>
          </div>
          <div className="card__footer-second-row">
            <div className="card__seasons">
              {seasonsAlphabetical.map((season) => {
                const Icon = seasonsIcons[season] || seasonsIcons.default;
                const label =
                  activitySeasonsLabels[seasons] + "icon" || "Unknown";
                return (
                  <div key={season} className="card__season-item">
                    {Icon && (
                      <img
                        src={Icon}
                        alt={label}
                        className="card__season-icon"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="card__group-size">{groupSizeLabel}</div>
          </div>
        </div>
      </div>
    </li>
  );
}
