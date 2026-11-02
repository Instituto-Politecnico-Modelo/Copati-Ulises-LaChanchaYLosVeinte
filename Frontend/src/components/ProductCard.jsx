import { formatPrice } from "../utils/format.js";
import Button from "./Button.jsx";

export default function ProductCard({ product, onAdd }) {
  const available = product.cantidadDisponible > 0;
  return (
    <article className="card">
      <h3>{product.nombre}</h3>
      <p className="card__desc">{product.descripcion || "Sin descripción."}</p>
      <div className="card__footer">
        <strong>{formatPrice(product.precio)}</strong>
        <span className={`badge ${available ? "badge--ok" : "badge--off"}`}>
          {available ? `Disponible: ${product.cantidadDisponible}` : "Agotado"}
        </span>
      </div>
      {onAdd && (
        <Button
          disabled={!available}
          aria-label={`Agregar ${product.nombre} al pedido`}
          onClick={() => onAdd(product)}
        >
          Agregar al pedido
        </Button>
      )}
    </article>
  );
}
