import { request } from "./http.js";

const API_URL = `${import.meta.env.VITE_API_URL ?? ""}/pedidos`;

export const getOrders = () => request(API_URL);

export const createOrder = (items) =>
  request(API_URL, { method: "POST", body: JSON.stringify({ items }) });

export const updateOrderStatus = (id, estado) =>
  request(`${API_URL}/${id}/estado`, { method: "PATCH", body: JSON.stringify({ estado }) });

export const cancelOrder = (id) => request(`${API_URL}/${id}`, { method: "DELETE" });
