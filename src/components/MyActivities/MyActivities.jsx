import CompletedActivities from "../CompletedActivities/CompletedActivities";
import SavedActivities from "../SavedActivities/SavedActivities";

export default function MyActivities() {
  return (
    <div className="my-activities-section">
      <SavedActivities />
      <CompletedActivities />
    </div>
  );
}
