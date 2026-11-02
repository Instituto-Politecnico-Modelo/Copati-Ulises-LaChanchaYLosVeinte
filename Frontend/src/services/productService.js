import { request } from "./http.js";

const API_URL = `${import.meta.env.VITE_API_URL ?? ""}/productos`;

export const getProducts = () => request(API_URL);

export const getProductById = (id) => request(`${API_URL}/${id}`);

export const createProduct = (product) =>
  request(API_URL, { method: "POST", body: JSON.stringify(product) });

export const updateProduct = (id, product) =>
  request(`${API_URL}/${id}`, { method: "PUT", body: JSON.stringify(product) });

export const deleteProduct = (id) =>
  request(`${API_URL}/${id}`, { method: "DELETE" });
