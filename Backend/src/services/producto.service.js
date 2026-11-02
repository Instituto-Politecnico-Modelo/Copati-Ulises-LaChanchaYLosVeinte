import * as productoRepository from "../repositories/producto.repository.js";
import { NotFoundError, BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isNonEmptyString, isNonNegativeInt } from "../utils/validators.js";

const validate = ({ nombre, precio, cantidadDisponible }) => {
    if (
        !isNonEmptyString(nombre) ||
        typeof precio !== "number" || !(precio > 0) ||
        !isNonNegativeInt(cantidadDisponible)
    ) {
        throw new BadRequestError(Messages.INVALID_PRODUCT);
    }
};

export const getAll = () => {
    return productoRepository.findAll();
};

export const getById = (codigo) => {
    const producto = productoRepository.findById(codigo);
    if (!producto) {
        throw new NotFoundError(Messages.PRODUCTO_NOT_FOUND);
    }
    return producto;
};

export const create = (data = {}) => {
    validate(data);
    return productoRepository.create(data);
};

export const update = (codigo, data = {}) => {
    const actual = getById(codigo);
    validate({ ...actual, ...data });
    return productoRepository.update(codigo, data);
};

export const remove = (codigo) => {
    getById(codigo);
    productoRepository.remove(codigo);
};
