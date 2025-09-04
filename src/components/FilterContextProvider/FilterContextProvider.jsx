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
      filtered = filtered.filter((activity) =>
        activity.seasons.includes(currentSeason)
      );
    }

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
  const savedActivities = useMemo(() => {
    if (!currentUser) return [];
    return activities.filter((activity) =>
      currentUser.savedActivities?.includes(activity._id)
    );
  }, [activities, currentUser]);

  const completedActivities = useMemo(() => {
    if (!currentUser) return [];
    return activities.filter((activity) =>
      currentUser.completedActivities?.includes(activity._id)
    );
  }, [activities, currentUser]);

  // --- Filtered activities by section ---
  const filteredActivities = useMemo(
    () => ({
      search: filterActivities(activities, filters.search),
      saved: filterActivities(savedActivities, filters.saved),
    }),
    [activities, savedActivities, filters]
  );

  // --- Utility to toggle array items ---
  const toggleArrayItem = (arr = [], item) =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const toggleUserActivity = (prop, _id) => {
    if (!currentUser) return Promise.resolve(null);
    const updatedUser = {
      ...currentUser,
      [prop]: toggleArrayItem(currentUser[prop], _id),
    };
    setCurrentUser(updatedUser);
    return Promise.resolve(updatedUser);
  };

  // const handleCardSave = ({ _id }) =>
  //   toggleUserActivity("savedActivities", _id);

  // const handleCardComplete = ({ _id }) =>
  //   toggleUserActivity("completedActivities", _id);

  const handleCardSave = ({ _id }) => {
    if (!currentUser) return;

    const action = currentUser.savedActivities.includes(_id)
      ? removeCardSave({ activityId: _id })
      : addCardSave({ activityId: _id });

    return action
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        return updatedUser;
      })
      .catch((err) => {
        console.error("Error toggling saved activity:", err);
      });
  };

  const handleCardComplete = ({ _id }) => {
    if (!currentUser) return;

    const action = currentUser.completedActivities.includes(_id)
      ? removeCardComplete({ activityId: _id })
      : addCardComplete({ activityId: _id });

    return action
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        return updatedUser;
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
