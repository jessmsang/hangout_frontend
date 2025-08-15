import { checkResponse } from "./weatherApi";
import { BASE_URL } from "./constants";

export const register = (
  registerEmail,
  registerPassword,
  registerName,
  avatarUrl
) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: registerEmail,
      password: registerPassword,
      name: registerName,
      avatar: avatarUrl,
    }),
  }).then(checkResponse);
};

export const login = (loginEmail, loginPassword) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: loginEmail,
      password: loginPassword,
    }),
  }).then(checkResponse);
};
