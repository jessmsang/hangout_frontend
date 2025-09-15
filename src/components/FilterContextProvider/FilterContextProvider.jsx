import { useContext, useState, useMemo } from "react";
import FilterContext from "../../contexts/FilterContext";
import ActivitiesContext from "../../contexts/ActivitiesContext";
import WeatherContext from "../../contexts/WeatherContext";
import UserContext from "../../contexts/UserContext";
import {
  addCardSave,
  removeCardSave,
  addCardComplete,
  removeCardComplete,
} from "../../api/activitiesApi";

export default function FilterContextProvider({ children }) {
  // Use activities from ActivitiesContext, which already have isSaved and isCompleted flags set in App.jsx
  const { activities } = useContext(ActivitiesContext);
  const { weatherData } = useContext(WeatherContext);
  const { currentUser, setCurrentUser } = useContext(UserContext);

  // --- Helper to create a blank filter state ---
  const createFilterState = () => ({
    seasons: [],
    location: [],
    category: [],
    groupSize: { min: 1, max: 12 },
    cost: { min: "$", max: "$$$" },
    isExactGroupSize: false,
    isExactCost: false,
  });

  // --- Section-specific filters ---
  const [filters, setFilters] = useState({
    search: createFilterState(),
    saved: createFilterState(),
    completed: createFilterState(),
  });

  // --- Update filters for a specific section ---
  const updateFilter = (section, newFilter) => {
    setFilters((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...newFilter },
    }));
  };

  // --- Filter activities by weather ---
  const activitiesFilteredByWeather = useMemo(() => {
    let filtered = activities;

    const currentSeason = weatherData?.season;
    if (currentSeason) {
      filtered = filtered.filter((activity) => {
        if (!Array.isArray(activity.seasons)) {
          console.warn("Activity missing seasons array:", activity);
          return false;
        }
        return activity.seasons.includes(currentSeason);
      });
    }

    //   {
    //   filtered = filtered.filter((activity) =>
    //     activity.seasons.includes(currentSeason)
    //   );
    // }

    const isOutdoor = weatherData?.isOutdoor;
    if (typeof isOutdoor === "boolean") {
      filtered = filtered.filter((activity) =>
        isOutdoor
          ? activity.location.includes("outdoor")
          : activity.location.includes("indoor")
      );
    }

    return filtered;
  }, [activities, weatherData]);

  // --- Generic activity filter function ---
  const filterActivities = (activitiesList, filter) => {
    let filtered = activitiesList;
    const {
      seasons,
      location,
      category,
      groupSize,
      cost,
      isExactGroupSize,
      isExactCost,
    } = filter;

    // Seasons
    if (seasons.length) {
      filtered = filtered.filter((activity) =>
        seasons.some((season) => activity.seasons.includes(season))
      );
    }

    // Location
    if (location.length) {
      filtered = filtered.filter((activity) =>
        location.some((loc) => activity.location.includes(loc))
      );
    }

    // Category
    if (category.length) {
      filtered = filtered.filter((activity) =>
        category.some((cat) => activity.category.includes(cat))
      );
    }

    // Cost
    const costLevels = ["$", "$$", "$$$"];
    if (isExactCost && cost.min) {
      const index = costLevels.indexOf(cost.min);
      filtered = filtered.filter(
        (activity) => costLevels.indexOf(activity.cost.min || "$") <= index
      );
    } else if (cost.min && cost.max) {
      const minIndex = costLevels.indexOf(cost.min);
      const maxIndex = costLevels.indexOf(cost.max);
      filtered = filtered.filter((activity) => {
        const minActivity = costLevels.indexOf(activity.cost.min || "$");
        const maxActivity = costLevels.indexOf(activity.cost.max || "$$$");
        return maxActivity >= minIndex && minActivity <= maxIndex;
      });
    }

    // Group size
    if (isExactGroupSize && groupSize.min) {
      filtered = filtered.filter(
        (activity) =>
          activity.groupSize.min <= groupSize.min &&
          activity.groupSize.max >= groupSize.min
      );
    } else if (groupSize.min || groupSize.max) {
      filtered = filtered.filter(
        (activity) =>
          activity.groupSize.max >= groupSize.min &&
          activity.groupSize.min <= groupSize.max
      );
    }

    return filtered;
  };

  // --- User-specific activities ---
  // Use activities directly for filtering
  const savedActivities = useMemo(() => {
    return activities.filter((activity) => activity.isSaved);
  }, [activities]);

  const completedActivities = useMemo(() => {
    return activities.filter((activity) => activity.isCompleted);
  }, [activities]);

  // --- Filtered activities by section ---
  const filteredActivities = useMemo(
    () => ({
      search: filterActivities(activities, filters.search),
      saved: filterActivities(savedActivities, filters.saved),
      completed: filterActivities(completedActivities, filters.completed),
    }),
    [activities, savedActivities, completedActivities, filters]
  );

  // --- Saving and Completing Activities ---

  const handleCardSave = ({ _id }) => {
    if (!currentUser) return;

    const savedIds = Array.isArray(currentUser.savedActivities)
      ? currentUser.savedActivities.map((a) => a._id)
      : [];

    const toggleSavedActivity = savedIds.includes(_id)
      ? removeCardSave({ activityId: _id })
      : addCardSave({ activityId: _id });

    return toggleSavedActivity
      .then(({ savedActivities }) => {
        const normalized = savedActivities.map((a) =>
          typeof a === "string" ? { _id: a } : a
        );
        setCurrentUser((prev) => ({
          ...prev,
          savedActivities: normalized,
        }));
        return normalized;
      })
      .catch((err) => {
        console.error("Error toggling saved activity:", err);
      });
  };

  const handleCardComplete = ({ _id }) => {
    if (!currentUser) return;

    const completedIds = Array.isArray(currentUser.completedActivities)
      ? currentUser.completedActivities.map((a) => a._id)
      : [];

    const toggleCompletedActivity = completedIds.includes(_id)
      ? removeCardComplete({ activityId: _id })
      : addCardComplete({ activityId: _id });

    return toggleCompletedActivity
      .then(({ completedActivities }) => {
        const normalized = completedActivities.map((a) =>
          typeof a === "string" ? { _id: a } : a
        );
        setCurrentUser((prev) => ({
          ...prev,
          completedActivities: normalized,
        }));
        return normalized;
      })
      .catch((err) => {
        console.error("Error toggling completed activity:", err);
      });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilter,
        filteredActivities,
        savedActivities,
        completedActivities,
        activitiesFilteredByWeather,
        handleCardSave,
        handleCardComplete,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
