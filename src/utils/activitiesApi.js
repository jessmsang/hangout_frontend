import activitiesData from "../../db.json";

let activitiesDB = [...activitiesData.activities]; // in-memory copy

export function getActivities() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...activitiesDB]), 300); // simulate async
  });
}

export function updateActivity(id, updates) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = activitiesDB.findIndex((activity) => activity._id === id);
      if (index === -1) return reject(new Error("Activity not found"));

      activitiesDB[index] = {
        ...activitiesDB[index],
        ...updates,
      };

      resolve(activitiesDB[index]);
    }, 300);
  });
}
