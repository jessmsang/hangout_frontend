import "./Main.css";

import RecommendedActivities from "../RecommendedActivities/RecommendedActivities";
import SearchActivities from "../SearchActivities/SearchActivities";

export default function Main() {
  return (
    <div className="main">
      <RecommendedActivities />
      <SearchActivities />
    </div>
  );
}
