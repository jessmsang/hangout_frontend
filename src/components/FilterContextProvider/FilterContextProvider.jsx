import { useContext, useState, useMemo } from "react";
import FilterContext from "../../contexts/FilterContext";
import ActivitiesContext from "../../contexts/ActivitiesContext";
import WeatherContext from "../../contexts/WeatherContext";
// TODO: ADD API THINGS
// import api from "../../utils/api";

export default function FilterContextProvider({ children }) {
  const [seasons, setSeasons] = useState([]);
  const [location, setLocation] = useState([]);
  const [category, setCategory] = useState([]);
  const [groupSize, setGroupSize] = useState({ min: 1, max: 12 });
  const [cost, setCost] = useState({ min: "$", max: "$$$" });

  const [isExactGroupSize, setIsExactGroupSize] = useState(false);
  const [isExactCost, setIsExactCost] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const { activities, setActivities } = useContext(ActivitiesContext);
  const { weatherData } = useContext(WeatherContext);

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
      filtered = filtered.filter((activity) => {
        return isOutdoor
          ? activity.location.includes("outdoor")
          : activity.location.includes("indoor");
      });
    }

    return filtered;
  }, [activities, weatherData, seasons, location]);

  const filteredActivities = useMemo(() => {
    let filtered = activities;

    if (seasons.length > 0) {
      filtered = filtered.filter((activity) =>
        seasons.some((season) => activity.seasons.includes(season))
      );
    }

    if (location.length > 0) {
      filtered = filtered.filter((activity) =>
        location.some((loc) => activity.location.includes(loc))
      );
    }

    if (category.length > 0) {
      filtered = filtered.filter((activity) =>
        category.some((cat) => activity.category.includes(cat))
      );
    }

    const costLevels = ["$", "$$", "$$$"];

    if (isExactCost && cost.min) {
      const selectedCostIndex = costLevels.indexOf(cost.min);
      filtered = filtered.filter((activity) => {
        const activityMinIndex = costLevels.indexOf(activity.cost.min || "$");

        return activityMinIndex <= selectedCostIndex;
      });
    } else if (cost.min && cost.max) {
      const minIndex = costLevels.indexOf(cost.min);
      const maxIndex = costLevels.indexOf(cost.max);
      filtered = filtered.filter((activity) => {
        const activityMinIndex = costLevels.indexOf(activity.cost.min || "$");
        const activityMaxIndex = costLevels.indexOf(activity.cost.max || "$$$");

        return activityMaxIndex >= minIndex && activityMinIndex <= maxIndex;
      });
    }

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
  }, [
    activities,
    seasons,
    category,
    location,
    groupSize,
    isExactGroupSize,
    cost,
    isExactCost,
  ]);

  const handleCardLike = ({ id, isLiked }) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, isLiked: !isLiked } : act))
    );
  };

  const handleCardComplete = ({ id, isCompleted }) => {
    setActivities((prev) =>
      prev.map((act) =>
        act.id === id ? { ...act, isCompleted: !isCompleted } : act
      )
    );
  };

  return (
    <FilterContext.Provider
      value={{
        seasons,
        setSeasons,
        location,
        setLocation,
        category,
        setCategory,
        groupSize,
        setGroupSize,
        cost,
        setCost,
        isExactGroupSize,
        setIsExactGroupSize,
        isExactCost,
        setIsExactCost,
        filteredActivities,
        activitiesFilteredByWeather,
        isLiked,
        setIsLiked,
        isCompleted,
        setIsCompleted,
        handleCardLike,
        handleCardComplete,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
