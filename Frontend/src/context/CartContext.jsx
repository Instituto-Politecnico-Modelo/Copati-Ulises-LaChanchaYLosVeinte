import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

// El carrito vive en el cliente hasta confirmar el pedido en el backend.
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const add = (product) =>
    setItems((prev) => {
      const found = prev.find((i) => i.codigo === product.codigo);
      if (found) {
        return prev.map((i) => (i.codigo === product.codigo ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [...prev, { codigo: product.codigo, nombre: product.nombre, precio: product.precio, cantidad: 1 }];
    });

  const setQuantity = (codigo, cantidad) =>
    setItems((prev) =>
      prev.map((i) => (i.codigo === codigo ? { ...i, cantidad: Math.max(1, cantidad) } : i))
    );

  const remove = (codigo) => setItems((prev) => prev.filter((i) => i.codigo !== codigo));
  const clear = () => setItems([]);

  const count = items.reduce((total, i) => total + i.cantidad, 0);
  const total = items.reduce((sum, i) => sum + i.cantidad * i.precio, 0);

  return (
    <CartContext.Provider value={{ items, add, setQuantity, remove, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
