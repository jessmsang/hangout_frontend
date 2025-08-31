import { checkResponse } from "./weatherApi";
import { getToken } from "../utils/token";
import { BASE_URL } from "../constants/apiEndpoints";

//Public
export function getActivities() {
  return fetch(`${BASE_URL}/activities`, {
    headers: { "Content-Type": "application/json" },
  }).then(checkResponse);
}

//Private
export const createActivity = (activity) => {
  return fetch(`${BASE_URL}/activities`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  }).then(checkResponse);
};

export const deleteActivity = (id) => {
  return fetch(`${BASE_URL}/activities/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken}`,
      "Content-Type": "application/json",
    },
  }).then(checkResponse);
};
