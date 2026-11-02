import useFetch from "./useFetch.js";
import { getProducts } from "../services/productService.js";

export default function useProducts() {
  const { data, loading, error, reload } = useFetch(getProducts);
  return { products: data, loading, error, reload };
}
