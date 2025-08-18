import "./ActivityCriteriaForm.css";

export default function ActivityCriteriaForm({
  variant,
  filter = {
    seasons: [],
    location: [],
    category: [],
    groupSize: { min: 1, max: 12 },
    cost: { min: "$", max: "$$$" },
    isExactGroupSize: false,
    isExactCost: false,
  },
  updateFilter = () => {},
  onReset = () => {},
}) {
  const costLevels = ["$", "$$", "$$$"];

  const toggleIsExactCost = () => {
    updateFilter({ isExactCost: !filter.isExactCost });
  };

  const toggleIsExactGroupSize = () => {
    updateFilter({ isExactGroupSize: !filter.isExactGroupSize });
  };

  const toggleArrayItem = (arr = [], value) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  return (
    <div className={`form__container form__container_${variant}`}>
      <div className={`form__sections form__sections_${variant}`}>
        <fieldset className="form__section form__section_seasons">
          <legend className="form__title">Seasons</legend>
          {["summer", "winter", "fall", "spring"].map((season) => (
            <label className="form__label" key={season}>
              <input
                type="checkbox"
                value={season}
                checked={filter.seasons.includes(season)}
                onChange={() =>
                  updateFilter({
                    seasons: toggleArrayItem(filter.seasons, season),
                  })
                }
                className="form__input"
              />
              {season.charAt(0).toUpperCase() + season.slice(1)}
            </label>
          ))}
        </fieldset>

        <fieldset className="form__section form__section_location">
          <legend className="form__title">Location</legend>
          {["indoor", "outdoor"].map((loc) => (
            <label className="form__label" key={loc}>
              <input
                type="checkbox"
                value={loc}
                checked={filter.location.includes(loc)}
                onChange={() =>
                  updateFilter({
                    location: toggleArrayItem(filter.location, loc),
                  })
                }
                className="form__input"
              />
              {loc.charAt(0).toUpperCase() + loc.slice(1)}
            </label>
          ))}
        </fieldset>

        <fieldset className="form__section form__section_category">
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
                value={cat}
                checked={filter.category.includes(cat)}
                onChange={() =>
                  updateFilter({
                    category: toggleArrayItem(filter.category, cat),
                  })
                }
                className="form__input"
              />
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </label>
          ))}
        </fieldset>

        <fieldset className="form__section form__section_cost">
          <legend className="form__title">Cost</legend>

          {!filter.isExactCost ? (
            <div className="form__section_range-view">
              <label className="form__label">
                Min:
                <select
                  value={filter.cost.min}
                  onChange={(e) =>
                    updateFilter({
                      cost: {
                        ...filter.cost,
                        min: e.target.value,
                        max:
                          costLevels.indexOf(filter.cost.max) <
                          costLevels.indexOf(e.target.value)
                            ? e.target.value
                            : filter.cost.max,
                      },
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
                  value={filter.cost.max}
                  onChange={(e) =>
                    updateFilter({
                      cost: { ...filter.cost, max: e.target.value },
                    })
                  }
                  className="form__input form__input_cost"
                >
                  {costLevels
                    .filter(
                      (level) =>
                        costLevels.indexOf(level) >=
                        costLevels.indexOf(filter.cost.min)
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
                  checked={filter.isExactCost}
                  onChange={toggleIsExactCost}
                  className="form__input form__input_exact"
                />
                Exact
              </label>
            </div>
          ) : (
            <div className="form__section_exact-view">
              <label className="form__label">
                Exactly:
                <select
                  value={filter.cost.min}
                  onChange={(e) =>
                    updateFilter({
                      cost: { min: e.target.value, max: e.target.value },
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
                  checked={filter.isExactCost}
                  onChange={toggleIsExactCost}
                  className="form__input form__input_exact"
                />
                Exact
              </label>
            </div>
          )}
        </fieldset>

        <fieldset className="form__section form__section_group">
          <legend className="form__title">Group Size</legend>

          {!filter.isExactGroupSize ? (
            <div className="form__section_range-view">
              <label className="form__label">
                Min:
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={filter.groupSize.min}
                  onChange={(e) =>
                    updateFilter({
                      groupSize: {
                        ...filter.groupSize,
                        min: Number(e.target.value),
                      },
                    })
                  }
                  className="form__input form__input_group"
                />
              </label>

              <label className="form__label">
                Max:
                <input
                  type="number"
                  min={filter.groupSize.min}
                  max="12"
                  value={filter.groupSize.max}
                  onChange={(e) =>
                    updateFilter({
                      groupSize: {
                        ...filter.groupSize,
                        max: Number(e.target.value),
                      },
                    })
                  }
                  className="form__input form__input_group"
                />
              </label>

              <label className="form__label form__label_exact">
                <input
                  type="checkbox"
                  checked={filter.isExactGroupSize}
                  onChange={toggleIsExactGroupSize}
                  className="form__input form__input_exact"
                />
                Exact
              </label>
            </div>
          ) : (
            <div className="form__section_exact-view">
              <label className="form__label">
                Exactly:
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={filter.groupSize.min}
                  onChange={(e) =>
                    updateFilter({
                      groupSize: {
                        min: Number(e.target.value),
                        max: Number(e.target.value),
                      },
                    })
                  }
                  className="form__input form__input_group"
                />
              </label>

              <label className="form__label form__label_exact">
                <input
                  type="checkbox"
                  checked={filter.isExactGroupSize}
                  onChange={toggleIsExactGroupSize}
                  className="form__input form__input_exact"
                />
                Exact
              </label>
            </div>
          )}
        </fieldset>

        <button type="button" className="form__reset-btn" onClick={onReset}>
          Reset
        </button>
      </div>
      <span className="form__error"></span>
    </div>
  );
}
