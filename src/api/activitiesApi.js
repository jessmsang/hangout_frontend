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
  console.log(activity);
  return fetch(`${BASE_URL}/activities`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  }).then(checkResponse);
};

export const deleteActivity = (activityId) => {
  return fetch(`${BASE_URL}/activities/${activityId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  }).then(checkResponse);
};

export function addCardSave({ activityId }) {
  return fetch(`${BASE_URL}/activities/${activityId}/save`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  }).then(checkResponse);
}

export function removeCardSave({ activityId }) {
  return fetch(`${BASE_URL}/activities/${activityId}/save`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  }).then(checkResponse);
}

export function addCardComplete({ activityId }) {
  return fetch(`${BASE_URL}/activities/${activityId}/complete`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  }).then(checkResponse);
}

export function removeCardComplete({ activityId }) {
  return fetch(`${BASE_URL}/activities/${activityId}/complete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  }).then(checkResponse);
}
