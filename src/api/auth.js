import { checkResponse } from "./weatherApi";
import { BASE_URL } from "../constants/apiEndpoints";

// Public
export const register = (email, password, name) =>
  fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  }).then(checkResponse);

export const login = (email, password) =>
  fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
