import { UnauthorizedError, ForbiddenError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import * as usuarioRepository from "../repositories/usuario.repository.js";

// Exige un token válido (Authorization: Bearer <token>) y carga req.user.
export const authenticate = (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    const user = token ? usuarioRepository.findBySession(token) : null;

    if (!user) {
        return next(new UnauthorizedError(Messages.UNAUTHENTICATED));
    }
    req.user = user;
    req.token = token;
    next();
};

// Restringe el acceso a los roles indicados (se usa después de authenticate).
export const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
        return next(new ForbiddenError(Messages.FORBIDDEN));
    }
    next();
};
