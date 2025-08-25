import activitiesData from "../../db.json";

let activitiesDB = [...activitiesData.activities];

// simulate network latency
const delay = (result, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(result), ms));

export function getActivities(token) {
  return delay([...activitiesDB]);
}

export function updateActivity(id, updates, token) {
  const index = activitiesDB.findIndex((a) => a._id === id);
  if (index === -1) return Promise.reject(new Error("Activity not found"));

  activitiesDB[index] = { ...activitiesDB[index], ...updates };
  console.log(`Updated ${id} activity:`, activitiesDB[index]);
  return delay(activitiesDB[index]);
}

export function deleteActivity(id, token) {
  // token parameter is ignored in stub, will be used for real backend
  const index = activitiesDB.findIndex((activity) => activity._id === id);
  if (index === -1) return Promise.reject(new Error("Activity not found"));

  const [deleted] = activitiesDB.splice(index, 1);
  console.log(`Deleted ${id} activity:`, deleted);
  return delay(deleted); // could also return true if you prefer
}

// TODO: CREATE A REAL BACKEND
// export function getActivities(token) {
//   return fetch(`${BASE_URL}/activities`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   }).then(checkResponse);
// }
//
// export const deleteActivity = (id, token) => {
//   return fetch(`${BASE_URL}/activities/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   }).then(checkResponse);
// };
