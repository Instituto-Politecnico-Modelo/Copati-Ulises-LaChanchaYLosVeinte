import { request } from "./http.js";

const API_URL = `${import.meta.env.VITE_API_URL ?? ""}/mesas`;

export const getTables = () => request(API_URL);

export const getTableSchedules = (id, fecha) => request(`${API_URL}/${id}/horarios?fecha=${fecha}`);

export const createTable = (table) =>
  request(API_URL, { method: "POST", body: JSON.stringify(table) });

export const updateTable = (id, table) =>
  request(`${API_URL}/${id}`, { method: "PUT", body: JSON.stringify(table) });

export const deleteTable = (id) => request(`${API_URL}/${id}`, { method: "DELETE" });
