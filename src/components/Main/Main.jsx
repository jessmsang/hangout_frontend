import { useContext } from "react";

import "./Main.css";

import UserContext from "../../contexts/UserContext";

import RecommendedActivities from "../RecommendedActivities/RecommendedActivities";
import SearchActivities from "../SearchActivities/SearchActivities";
import SavedActivities from "../SavedActivities/SavedActivities";
import CompletedActivities from "../CompletedActivities/CompletedActivities";

export default function Main() {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <div className="main">
      <RecommendedActivities />
      <SearchActivities />
      {isLoggedIn && (
        <div>
          <SavedActivities />
          <CompletedActivities />
        </div>
      )}
    </div>
  );
}
