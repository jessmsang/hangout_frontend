import { useContext, useState, useMemo } from "react";
import FilterContext from "../../contexts/FilterContext";
import ActivitiesContext from "../../contexts/ActivitiesContext";
import WeatherContext from "../../contexts/WeatherContext";

export default function FilterContextProvider({ children }) {
  const [seasons, setSeasons] = useState([]);
  const [location, setLocation] = useState([]);
  const [category, setCategory] = useState([]);
  const [groupSize, setGroupSize] = useState({ min: "", max: "" });
  const [cost, setCost] = useState({ min: "", max: "" });

  const activities = useContext(ActivitiesContext);
  const { weatherData } = useContext(WeatherContext);

  const filteredActivities = useMemo(() => {
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

    // TODO: add category/groupSize/cost filters here
    // if (groupSize.min || groupSize.max) {
    //   filtered = filtered.filter((activity) => {
    //     const size = activity.groupSize || 0;
    //     return (
    //       (!groupSize.min || size >= groupSize.min) &&
    //       (!groupSize.max || size <= groupSize.max)
    //     );
    //   });
    // }

    // if (cost.min || cost.max) {
    //   filtered = filtered.filter((activity) => {
    //     const price = activity.cost || 0;
    //     return (
    //       (!cost.min || price >= cost.min) && (!cost.max || price <= cost.max)
    //     );
    //   });
    // }

    return filtered;
  }, [activities, weatherData, seasons, category, location, groupSize, cost]);

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
        filteredActivities,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
