import { request } from "./http.js";

const API_URL = `${import.meta.env.VITE_API_URL ?? ""}/reservas`;

export const getReservations = () => request(API_URL);

export const createReservation = (reservation) =>
  request(API_URL, { method: "POST", body: JSON.stringify(reservation) });

export const cancelReservation = (id) => request(`${API_URL}/${id}`, { method: "DELETE" });
