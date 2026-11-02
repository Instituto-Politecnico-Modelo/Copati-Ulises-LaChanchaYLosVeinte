import * as pedidoRepository from "../repositories/pedido.repository.js";
import * as productoRepository from "../repositories/producto.repository.js";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { EstadoPedido, FLUJO_PEDIDO } from "../enums/Estados.js";
import { STAFF_ROLES } from "../enums/Roles.js";
import { isPositiveInt } from "../utils/validators.js";

// Un usuario ve su historial; el personal ve todos los pedidos.
export const getAll = (user) => {
    return STAFF_ROLES.includes(user.rol)
        ? pedidoRepository.findAll()
        : pedidoRepository.findByUsuario(user.codigo);
};

const getById = (codigo) => {
    const pedido = pedidoRepository.findById(codigo);
    if (!pedido) {
        throw new NotFoundError(Messages.PEDIDO_NOT_FOUND);
    }
    return pedido;
};

// Junta los renglones repetidos de un mismo producto y valida el formato.
const normalizeItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new BadRequestError(Messages.EMPTY_ORDER);
    }
    const cantidades = new Map();
    for (const item of items) {
        if (!item || !isPositiveInt(item.codigoProducto) || !isPositiveInt(item.cantidad)) {
            throw new BadRequestError(Messages.INVALID_ORDER_ITEM);
        }
        cantidades.set(item.codigoProducto, (cantidades.get(item.codigoProducto) ?? 0) + item.cantidad);
    }
    return cantidades;
};

export const create = (user, { items } = {}) => {
    const cantidades = normalizeItems(items);

    // Primero se valida todo, después se descuenta el stock (operación atómica).
    const renglones = [];
    for (const [codigoProducto, cantidad] of cantidades) {
        const producto = productoRepository.findById(codigoProducto);
        if (!producto) {
            throw new NotFoundError(Messages.PRODUCTO_NOT_FOUND);
        }
        if (producto.cantidadDisponible < cantidad) {
            throw new ConflictError(
                `Stock insuficiente de "${producto.nombre}" (disponible: ${producto.cantidadDisponible}).`
            );
        }
        renglones.push({
            codigoProducto,
            nombre: producto.nombre,
            precioUnitario: producto.precio,
            cantidad
        });
    }

    renglones.forEach((renglon) => {
        const producto = productoRepository.findById(renglon.codigoProducto);
        productoRepository.update(producto.codigo, {
            cantidadDisponible: producto.cantidadDisponible - renglon.cantidad
        });
    });

    const precioFinal = renglones.reduce((total, r) => total + r.precioUnitario * r.cantidad, 0);
    return pedidoRepository.create({ codigoUsuario: user.codigo, items: renglones, precioFinal });
};

// Avanza el pedido al siguiente estado del flujo (solo personal del local).
export const updateEstado = (codigo, { estado } = {}) => {
    const pedido = getById(codigo);
    if (pedido.estado === EstadoPedido.CANCELADO) {
        throw new ConflictError(Messages.PEDIDO_ALREADY_CANCELLED);
    }
    const siguiente = FLUJO_PEDIDO[FLUJO_PEDIDO.indexOf(pedido.estado) + 1];
    if (!siguiente || estado !== siguiente) {
        throw new BadRequestError(
            siguiente
                ? `${Messages.INVALID_STATE} El siguiente estado es "${siguiente}".`
                : Messages.INVALID_STATE
        );
    }
    return pedidoRepository.update(codigo, { estado });
};

// Cancelar un pedido devuelve el stock de los productos.
export const cancel = (user, codigo) => {
    const pedido = getById(codigo);
    if (pedido.codigoUsuario !== user.codigo) {
        throw new ForbiddenError(Messages.FORBIDDEN);
    }
    if (pedido.estado === EstadoPedido.ENTREGADO) {
        throw new ConflictError(Messages.PEDIDO_DELIVERED);
    }
    if (pedido.estado === EstadoPedido.CANCELADO) {
        throw new ConflictError(Messages.PEDIDO_ALREADY_CANCELLED);
    }

    pedido.items.forEach((item) => {
        const producto = productoRepository.findById(item.codigoProducto);
        if (producto) {
            productoRepository.update(producto.codigo, {
                cantidadDisponible: producto.cantidadDisponible + item.cantidad
            });
        }
    });
    return pedidoRepository.update(codigo, { estado: EstadoPedido.CANCELADO });
};
