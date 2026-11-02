import { request } from "./http.js";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const USERS_URL = `${API_URL}/usuarios`;

export const register = (data) =>
  request(`${USERS_URL}/registro`, { method: "POST", body: JSON.stringify(data) });

export const login = (data) =>
  request(`${USERS_URL}/login`, { method: "POST", body: JSON.stringify(data) });

export const logout = () => request(`${USERS_URL}/logout`, { method: "POST" });
