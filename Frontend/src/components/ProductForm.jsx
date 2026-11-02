import { useState } from "react";
import FormField from "./FormField.jsx";
import Button from "./Button.jsx";
import { validateProduct } from "../utils/validators.js";

const EMPTY = { nombre: "", precio: "", descripcion: "", cantidadDisponible: "" };

export default function ProductForm({ initial, loading, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    initial
      ? {
          nombre: initial.nombre,
          precio: String(initial.precio),
          descripcion: initial.descripcion ?? "",
          cantidadDisponible: String(initial.cantidadDisponible)
        }
      : EMPTY
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateProduct(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({
      nombre: values.nombre.trim(),
      precio: Number(values.precio),
      descripcion: values.descripcion.trim(),
      cantidadDisponible: Number(values.cantidadDisponible)
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField id="nombre" label="Nombre" value={values.nombre} onChange={handleChange} error={errors.nombre} />
      <FormField id="precio" label="Precio (ARS)" type="number" min="0" value={values.precio} onChange={handleChange} error={errors.precio} />
      <FormField id="cantidadDisponible" label="Cantidad disponible" type="number" min="0" value={values.cantidadDisponible} onChange={handleChange} error={errors.cantidadDisponible} />
      <FormField id="descripcion" as="textarea" rows="3" label="Descripción" value={values.descripcion} onChange={handleChange} error={errors.descripcion} />
      <div className="actions">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>{initial ? "Guardar cambios" : "Crear producto"}</Button>
      </div>
    </form>
  );
}
