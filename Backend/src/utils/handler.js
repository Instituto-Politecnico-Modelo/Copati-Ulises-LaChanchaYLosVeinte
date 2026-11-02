import { successResponse } from "../responses/response.js";

// Envuelve la lógica de un controlador: responde con el formato estándar
// y delega cualquier error al middleware centralizado.
export const handle = (action, statusCode = 200) => (req, res, next) => {
    try {
        return successResponse(res, action(req), statusCode);
    } catch (err) {
        next(err);
    }
};
