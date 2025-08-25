import { checkResponse } from "./weatherApi";
import { BASE_URL } from "../constants/apiEndpoints";

//STUBBED BACKEND:

let usersDB = [
  {
    _id: "1",
    email: "test1@test.com",
    password: "Pas$word1",
    name: "Demo User",
  },
];

let currentUser = null;

const delay = (result, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(result), ms));

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const register = (email, password, name) => {
  const exists = usersDB.find((user) => user.email === email);
  if (exists) {
    return Promise.reject(new Error("User already exists"));
  }

  const newUser = {
    _id: String(Date.now()),
    email,
    password,
    name,
  };

  usersDB.push(newUser);
  currentUser = newUser;

  return delay({
    token: "fake-token",
    user: sanitizeUser(newUser),
  });
};

export const login = (loginEmail, loginPassword) => {
  const user = usersDB.find(
    (user) => user.email === loginEmail && user.password === loginPassword
  );

  if (!user) {
    return Promise.reject(new Error("Invalid email or password"));
  }

  currentUser = user;
  return delay({
    token: "fake-token",
    user: sanitizeUser(user),
  });
};

export const logout = () => {
  currentUser = null;
  return delay(true);
};

export const checkToken = (token) => {
  if (token === "fake-token" && currentUser) {
    return delay({ user: sanitizeUser(currentUser) });
  }
  return Promise.reject(new Error("Invalid token"));
};

// TODO: CREATE A REAL BACKEND WITH CODE BELOW:
// export const register = (
//   email,
//   password,
//   name,
// ) => {
//   return fetch(`${BASE_URL}/signup`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       email,
//       password,
//       name,
//     }),
//   }).then(checkResponse);
// };

// export const login = (loginEmail, loginPassword) => {
//   return fetch(`${BASE_URL}/signin`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       email: loginEmail,
//       password: loginPassword,
//     }),
//   }).then(checkResponse);
// };

// export const deleteUser = (userId, token) => {
//   return fetch(`${BASE_URL}/users/${userId}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   }).then(checkResponse);
// };
