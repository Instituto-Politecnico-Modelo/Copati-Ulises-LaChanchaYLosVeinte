const VARIANTS = {
  "Pendiente de pago": "warn",
  Pagado: "info",
  "En preparacion": "info",
  "En reparto": "info",
  Entregado: "ok",
  Cancelado: "off",
  Cancelada: "off",
  Reservada: "ok"
};

export default function StatusBadge({ status }) {
  return <span className={`badge badge--${VARIANTS[status] ?? "info"}`}>{status}</span>;
}
