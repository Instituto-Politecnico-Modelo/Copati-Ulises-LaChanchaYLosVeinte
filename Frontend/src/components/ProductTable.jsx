import Button from "./Button.jsx";
import { formatPrice } from "../utils/format.js";

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <caption className="sr-only">Listado de productos</caption>
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Stock</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.codigo}>
              <td>{p.codigo}</td>
              <td>{p.nombre}</td>
              <td>{formatPrice(p.precio)}</td>
              <td>{p.cantidadDisponible}</td>
              <td className="actions">
                <Button variant="secondary" aria-label={`Editar ${p.nombre}`} onClick={() => onEdit(p)}>Editar</Button>
                <Button variant="danger" aria-label={`Eliminar ${p.nombre}`} onClick={() => onDelete(p)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
