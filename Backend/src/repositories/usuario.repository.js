import Usuario from "../models/usuario.model.js";
import { Roles } from "../enums/Roles.js";

// Cuentas iniciales para poder probar los distintos roles.
const usuarios = [
    new Usuario(1, "admin@chancha.com", "admin123", "1140000001", Roles.ADMIN),
    new Usuario(2, "recepcion@chancha.com", "recep123", "1140000002", Roles.RECEPTIONIST)
];
let nextCodigo = 3;

// Sesiones activas: token -> código de usuario.
const sesiones = new Map();

export const findById = (codigo) => {
    return usuarios.find((usuario) => usuario.codigo === Number(codigo));
};

export const findByEmail = (email) => {
    return usuarios.find((usuario) => usuario.email === email);
};

export const create = ({ email, contrasenia, telefono, rol }) => {
    const nuevoUsuario = new Usuario(nextCodigo++, email, contrasenia, telefono, rol);
    usuarios.push(nuevoUsuario);
    return nuevoUsuario;
};

export const saveSession = (token, codigoUsuario) => {
    sesiones.set(token, codigoUsuario);
};

export const findBySession = (token) => {
    return findById(sesiones.get(token));
};

export const removeSession = (token) => {
    sesiones.delete(token);
};
