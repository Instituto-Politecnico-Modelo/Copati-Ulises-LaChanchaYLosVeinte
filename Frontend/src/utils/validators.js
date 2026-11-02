const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, contrasenia }) {
  const errors = {};
  if (!EMAIL_REGEX.test(email.trim())) errors.email = "Ingresá un email válido.";
  if (!contrasenia) errors.contrasenia = "Ingresá tu contraseña.";
  return errors;
}

export function validateRegister({ email, contrasenia, telefono }) {
  const errors = {};
  if (!EMAIL_REGEX.test(email.trim())) errors.email = "Ingresá un email válido.";
  if (contrasenia.length < 6) errors.contrasenia = "La contraseña debe tener al menos 6 caracteres.";
  if (!/^\d{6,15}$/.test(telefono.trim())) errors.telefono = "Ingresá entre 6 y 15 dígitos, sin espacios.";
  return errors;
}

export function validateTable({ espacio }) {
  const errors = {};
  if (espacio === "" || !Number.isInteger(Number(espacio)) || Number(espacio) <= 0)
    errors.espacio = "El espacio debe ser un entero mayor a 0.";
  return errors;
}

// Devuelve un objeto { campo: mensaje } con los errores del producto.
export function validateProduct({ nombre, precio, descripcion, cantidadDisponible }) {
  const errors = {};

  if (!nombre.trim()) errors.nombre = "El nombre es obligatorio.";
  else if (nombre.trim().length > 60) errors.nombre = "Máximo 60 caracteres.";

  if (precio === "" || Number.isNaN(Number(precio))) errors.precio = "Ingresá un precio válido.";
  else if (Number(precio) <= 0) errors.precio = "El precio debe ser mayor a 0.";

  if (cantidadDisponible === "" || Number.isNaN(Number(cantidadDisponible)))
    errors.cantidadDisponible = "Ingresá una cantidad válida.";
  else if (!Number.isInteger(Number(cantidadDisponible)) || Number(cantidadDisponible) < 0)
    errors.cantidadDisponible = "Debe ser un número entero mayor o igual a 0.";

  if (descripcion.length > 200) errors.descripcion = "Máximo 200 caracteres.";

  return errors;
}
