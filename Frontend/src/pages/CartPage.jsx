import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { createOrder } from "../services/pedidoService.js";
import { formatPrice } from "../utils/format.js";
import Button from "../components/Button.jsx";
import StatusMessage from "../components/StatusMessage.jsx";

export default function CartPage({ onNavigate }) {
  const { items, setQuantity, remove, clear, total } = useCart();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      await createOrder(items.map((i) => ({ codigoProducto: i.codigo, cantidad: i.cantidad })));
      toast.success("¡Pedido realizado correctamente!");
      clear();
      onNavigate("pedidos");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-labelledby="titulo-carrito">
      <h2 id="titulo-carrito">Mi pedido</h2>
      {items.length === 0 ? (
        <>
          <StatusMessage message="Todavía no agregaste productos a tu pedido." />
          <p><Button onClick={() => onNavigate("menu")}>Ir a la carta</Button></p>
        </>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <caption className="sr-only">Productos del pedido</caption>
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Subtotal</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.codigo}>
                    <td>{i.nombre}</td>
                    <td>{formatPrice(i.precio)}</td>
                    <td>
                      <label className="sr-only" htmlFor={`cant-${i.codigo}`}>Cantidad de {i.nombre}</label>
                      <input
                        id={`cant-${i.codigo}`}
                        className="qty"
                        type="number"
                        min="1"
                        value={i.cantidad}
                        onChange={(e) => setQuantity(i.codigo, Math.floor(Number(e.target.value)) || 1)}
                      />
                    </td>
                    <td>{formatPrice(i.precio * i.cantidad)}</td>
                    <td>
                      <Button variant="danger" aria-label={`Quitar ${i.nombre}`} onClick={() => remove(i.codigo)}>Quitar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="total">Total: <strong>{formatPrice(total)}</strong></p>
          <div className="actions">
            <Button variant="secondary" onClick={clear}>Vaciar</Button>
            <Button loading={loading} onClick={confirm}>Confirmar pedido</Button>
          </div>
        </>
      )}
    </section>
  );
}
