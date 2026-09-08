import { NotFoundError } from "../exceptions/AppError.js";

export const notFoundHandler = (req, res, next) => {
    next(new NotFoundError(`La ruta ${req.method} ${req.originalUrl} no existe.`));
};

export default notFoundHandler;
