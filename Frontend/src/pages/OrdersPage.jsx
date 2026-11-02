import { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { getOrders, cancelOrder, updateOrderStatus } from "../services/pedidoService.js";
import { formatDateTime, formatPrice } from "../utils/format.js";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Spinner from "../components/Spinner.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import StatusMessage from "../components/StatusMessage.jsx";

// Flujo que debe seguir un pedido (el mismo que valida el backend).
const FLOW = ["Pendiente de pago", "Pagado", "En preparacion", "En reparto", "Entregado"];

export default function OrdersPage() {
  const { user, isStaff } = useAuth();
  const toast = useToast();
  const { data: orders, loading, error, reload } = useFetch(getOrders);
  const [toCancel, setToCancel] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async (action, successMessage) => {
    setBusy(true);
    try {
      await action();
      toast.success(successMessage);
      setToCancel(null);
      await reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const sorted = [...orders].sort((a, b) => b.codigo - a.codigo);

  return (
    <section aria-labelledby="titulo-pedidos">
      <h2 id="titulo-pedidos">{isStaff ? "Todos los pedidos" : "Historial de mis pedidos"}</h2>
      {loading && <Spinner text="Cargando pedidos..." />}
      {error && <StatusMessage message={error} onRetry={reload} />}
      {!loading && !error && sorted.length === 0 && <StatusMessage message="Todavía no hay pedidos." />}

      <div className="stack">
        {sorted.map((order) => {
          const next = FLOW[FLOW.indexOf(order.estado) + 1];
          const isOwner = order.codigoUsuario === user.codigo;
          const canCancel = isOwner && order.estado !== "Entregado" && order.estado !== "Cancelado";
          return (
            <article key={order.codigo} className="card">
              <div className="section-head">
                <h3>Pedido #{order.codigo}</h3>
                <StatusBadge status={order.estado} />
              </div>
              <p className="muted">
                {formatDateTime(order.fechaRealizacion)}
                {isStaff && ` · Usuario #${order.codigoUsuario}`}
              </p>
              <ul>
                {order.items.map((i) => (
                  <li key={i.codigoProducto}>
                    {i.cantidad} × {i.nombre} — {formatPrice(i.precioUnitario * i.cantidad)}
                  </li>
                ))}
              </ul>
              <p className="total">Total: <strong>{formatPrice(order.precioFinal)}</strong></p>
              <div className="actions">
                {isStaff && next && order.estado !== "Cancelado" && (
                  <Button
                    variant="secondary"
                    loading={busy}
                    onClick={() => run(() => updateOrderStatus(order.codigo, next), `Pedido pasado a "${next}".`)}
                  >
                    Pasar a "{next}"
                  </Button>
                )}
                {canCancel && (
                  <Button variant="danger" onClick={() => setToCancel(order)}>Cancelar pedido</Button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {toCancel && (
        <ConfirmDialog
          title="Cancelar pedido"
          message={`¿Seguro que querés cancelar el pedido #${toCancel.codigo}?`}
          confirmText="Cancelar pedido"
          loading={busy}
          onConfirm={() => run(() => cancelOrder(toCancel.codigo), "Pedido cancelado correctamente.")}
          onCancel={() => setToCancel(null)}
        />
      )}
    </section>
  );
}
