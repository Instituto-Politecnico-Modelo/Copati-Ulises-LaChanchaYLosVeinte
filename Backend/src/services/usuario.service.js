import { randomUUID } from "node:crypto";
import * as usuarioRepository from "../repositories/usuario.repository.js";
import { BadRequestError, ConflictError, UnauthorizedError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { Roles } from "../enums/Roles.js";
import { isEmail } from "../utils/validators.js";

// Nunca se devuelve la contraseña al cliente.
export const toPublic = ({ contrasenia, ...usuario }) => usuario;

export const register = ({ email, contrasenia, telefono } = {}) => {
    if (!isEmail(email)) {
        throw new BadRequestError(Messages.INVALID_EMAIL);
    }
    if (typeof contrasenia !== "string" || contrasenia.length < 6) {
        throw new BadRequestError(Messages.INVALID_PASSWORD);
    }
    const phone = String(telefono ?? "").trim();
    if (!/^\d{6,15}$/.test(phone)) {
        throw new BadRequestError(Messages.INVALID_PHONE);
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (usuarioRepository.findByEmail(normalizedEmail)) {
        throw new ConflictError(Messages.EMAIL_REGISTERED);
    }

    // Todo registro público crea un usuario común; los demás roles no se auto-asignan.
    const usuario = usuarioRepository.create({
        email: normalizedEmail,
        contrasenia,
        telefono: phone,
        rol: Roles.USER
    });
    return toPublic(usuario);
};

export const login = ({ email, contrasenia } = {}) => {
    if (typeof email !== "string" || typeof contrasenia !== "string") {
        throw new BadRequestError(Messages.INVALID_DATA);
    }
    const usuario = usuarioRepository.findByEmail(email.trim().toLowerCase());
    if (!usuario || usuario.contrasenia !== contrasenia) {
        throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
    }
    const token = randomUUID();
    usuarioRepository.saveSession(token, usuario.codigo);
    return { token, usuario: toPublic(usuario) };
};

export const logout = (token) => {
    usuarioRepository.removeSession(token);
    return null;
};
