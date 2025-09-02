import { BASE_URL } from "../constants/apiEndpoints";
import { checkResponse } from "./weatherApi";
import { getToken } from "../utils/token";

//Private
export const getCurrentUser = () => {
  return fetch(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  }).then(checkResponse);
};

export const updateUser = (user) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then(checkResponse);
};

export const deleteUser = (userId) => {
  return fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  }).then(checkResponse);
};
