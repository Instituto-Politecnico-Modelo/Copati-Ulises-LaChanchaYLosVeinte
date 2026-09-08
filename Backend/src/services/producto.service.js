import * as productoRepository from "../repositories/producto.repository.js";
import { NotFoundError, BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

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

export const create = (data) => {
    const { nombre, precio, cantidadDisponible } = data;
    if (!nombre || precio == null || cantidadDisponible == null) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }
    return productoRepository.create(data);
};

export const update = (codigo, data) => {
    getById(codigo);
    return productoRepository.update(codigo, data);
};

export const remove = (codigo) => {
    getById(codigo);
    productoRepository.remove(codigo);
};
