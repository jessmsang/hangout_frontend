import { useContext } from "react";
import ActivitiesContext from "../../contexts/ActivitiesContext";
import UserContext from "../../contexts/UserContext";
import ActivitiesCarousel from "../ActivitiesCarousel/ActivitiesCarousel";
import CompletedActivities from "../CompletedActivities/CompletedActivities";
import SavedActivities from "../SavedActivities/SavedActivities";
import "./MyActivities.css";

export default function MyActivities() {
  const { activities } = useContext(ActivitiesContext);
  const { currentUser } = useContext(UserContext);

  const myActivities = activities.filter(
    (activity) => activity.owner === currentUser._id
  );

  return (
    <section className="my-activities">
      <h2 className="my-activities__title">My Added Activities</h2>
      {myActivities.length === 0 ? (
        <p className="my-activities__empty-text">
          You haven't added any activities yet.
        </p>
      ) : (
        <ActivitiesCarousel activities={myActivities} />
      )}

      <SavedActivities />
      <CompletedActivities />
    </section>
  );
}
