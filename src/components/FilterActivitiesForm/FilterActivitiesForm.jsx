import { useContext, useState } from "react";
import "./FilterActivitiesForm.css";
import FilterContext from "../../contexts/FilterContext";

export default function FilterActivitiesForm() {
  const {
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
  } = useContext(FilterContext);

  const [hasGroupSizeError, setHasGroupSizeError] = useState(false);

  const costLevels = ["$", "$$", "$$$"];

  const toggleIsExactCost = () => {
    setIsExactCost((prev) => !prev);
  };

  //   const validateGroupSize = (min, max) => {
  //     if (min > max) {
  //       setHasGroupSizeError(true);
  //     } else {
  //       setHasGroupSizeError(false);
  //     }
  //   };

  const toggleIsExactGroupSize = () => {
    setIsExactGroupSize((prev) => !prev);
  };

  const handleFormReset = () => {
    setSeasons([]);
    setLocation([]);
    setCategory([]);
    setIsExactCost(false);
    setIsExactGroupSize(false);
    setCost({ min: "$", max: "$$$" });
    setGroupSize({ min: 1, max: 12 });
  };

  return (
    <div className="form__container">
      <form className="form">
        <fieldset className="form__section">
          <legend className="form__title">Seasons</legend>
          {["summer", "winter", "fall", "spring"].map((season) => (
            <label className="form__label" key={season}>
              <input
                type="checkbox"
                name="season"
                value={season}
                checked={seasons.includes(season)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (e.target.checked) {
                    setSeasons([...seasons, value]);
                  } else {
                    setSeasons(seasons.filter((s) => s !== value));
                  }
                }}
                className="form__input"
              />
              {season.charAt(0).toUpperCase() + season.slice(1)}
            </label>
          ))}
        </fieldset>

        <fieldset className="form__section">
          <legend className="form__title">Location</legend>
          {["indoor", "outdoor"].map((loc) => (
            <label className="form__label" key={loc}>
              <input
                type="checkbox"
                name="location"
                value={loc}
                checked={location.includes(loc)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (e.target.checked) {
                    setLocation([...location, value]);
                  } else {
                    setLocation(location.filter((l) => l !== value));
                  }
                }}
                className="form__input"
              />
              {loc.charAt(0).toUpperCase() + loc.slice(1)}
            </label>
          ))}
        </fieldset>

        <fieldset className="form__section">
          <legend className="form__title">Category</legend>
          {[
            "active",
            "adventure",
            "low-key",
            "creative",
            "dining",
            "festive",
            "romantic",
          ].map((cat) => (
            <label className="form__label" key={cat}>
              <input
                type="checkbox"
                name="category"
                value={cat}
                checked={category.includes(cat)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (e.target.checked) {
                    setCategory([...category, value]);
                  } else {
                    setCategory(category.filter((c) => c !== value));
                  }
                }}
                className="form__input"
              />
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </label>
          ))}
        </fieldset>

        <fieldset className="form__section form__section_cost">
          <legend className="form__title">Cost</legend>

          {!isExactCost && (
            <div className="form__section_range-view">
              <label className="form__label">
                Min:
                <select
                  name="minCost"
                  value={cost.min}
                  onChange={(e) =>
                    setCost({
                      ...cost,
                      min: e.target.value,
                      max:
                        costLevels.indexOf(cost.max) <
                        costLevels.indexOf(e.target.value)
                          ? e.target.value
                          : cost.max,
                    })
                  }
                  className="form__input form__input_cost"
                >
                  {costLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form__label">
                Max:
                <select
                  name="maxCost"
                  value={cost.max}
                  onChange={(e) =>
                    setCost({
                      ...cost,
                      max: e.target.value,
                    })
                  }
                  className="form__input form__input_cost"
                >
                  {costLevels
                    .filter(
                      (level) =>
                        costLevels.indexOf(level) >=
                        costLevels.indexOf(cost.min)
                    )
                    .map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                </select>
              </label>

              <label className="form__label form__label_exact">
                <input
                  type="checkbox"
                  name="exactCost"
                  checked={isExactCost}
                  value="exact"
                  className="form__input form__input_exact"
                  onChange={toggleIsExactCost}
                />
                Exact
              </label>
            </div>
          )}

          {isExactCost && (
            <div className="form__section_exact-view">
              <label className="form__label">
                Exactly:
                <select
                  name="exactCost"
                  value={cost.min}
                  onChange={(e) =>
                    setCost({
                      ...cost,
                      min: e.target.value,
                      max: e.target.value,
                    })
                  }
                  className="form__input form__input_cost"
                >
                  {costLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form__label form__label_exact">
                <input
                  type="checkbox"
                  name="exactCost"
                  value="exact"
                  checked={isExactCost}
                  className="form__input form__input-exact"
                  onChange={toggleIsExactCost}
                />
                Exact
              </label>
            </div>
          )}
        </fieldset>

        <fieldset className="form__section form__section_group">
          <legend className="form__title">Group Size</legend>
          {!isExactGroupSize && (
            <div className="form__section_range-view">
              <label className="form__label">
                Min:
                <input
                  type="number"
                  name="minGroupSize"
                  value={groupSize.min}
                  min="1"
                  max="12"
                  onChange={(e) =>
                    setGroupSize({
                      ...groupSize,
                      min: e.target.value,
                    })
                  }
                  className="form__input form__input_group"
                />
              </label>
              <label className="form__label">
                Max:
                <input
                  type="number"
                  name="maxGroupSize"
                  value={groupSize.max}
                  min={groupSize.min}
                  max="12"
                  onChange={(e) =>
                    setGroupSize({
                      ...groupSize,
                      max: e.target.value,
                    })
                  }
                  className="form__input form__input_group"
                />
              </label>
              <label className="form__label form__label_exact">
                <input
                  type="checkbox"
                  name="exact"
                  checked={isExactGroupSize}
                  value="exact"
                  className="form__input form__input_exact"
                  onChange={toggleIsExactGroupSize}
                />
                Exact
              </label>
            </div>
          )}
          {isExactGroupSize && (
            <div className="form__section_exact-view">
              <label className="form__label">
                Exactly:
                <input
                  type="number"
                  name="exactGroupSize"
                  value={groupSize.min}
                  min={groupSize.min}
                  max={groupSize.max}
                  onChange={(e) =>
                    setGroupSize({
                      ...groupSize,
                      min: e.target.value,
                      max: e.target.value,
                    })
                  }
                  className="form__input form__input_group"
                />
              </label>
              <label className="form__label form__label_exact">
                <input
                  type="checkbox"
                  name="exact"
                  value="exact"
                  checked={isExactGroupSize}
                  className="form__input form__input-exact"
                  onChange={toggleIsExactGroupSize}
                />
                Exact
              </label>
            </div>
          )}
        </fieldset>

        <span className="form__error"></span>
      </form>
      <button
        type="button"
        className="form__reset-btn"
        onClick={handleFormReset}
      >
        Reset Filters
      </button>
    </div>
  );
}
