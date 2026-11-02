import Pedido from "../models/pedido.model.js";
import { EstadoPedido } from "../enums/Estados.js";

const pedidos = [];
let nextCodigo = 1;

export const findAll = () => {
    return pedidos;
};

export const findById = (codigo) => {
    return pedidos.find((pedido) => pedido.codigo === Number(codigo));
};

export const findByUsuario = (codigoUsuario) => {
    return pedidos.filter((pedido) => pedido.codigoUsuario === codigoUsuario);
};

export const create = ({ codigoUsuario, items, precioFinal }) => {
    const nuevo = new Pedido(
        nextCodigo++,
        codigoUsuario,
        items,
        precioFinal,
        new Date().toISOString(),
        EstadoPedido.PENDIENTE
    );
    pedidos.push(nuevo);
    return nuevo;
};

export const update = (codigo, data) => {
    const pedido = findById(codigo);
    Object.assign(pedido, data);
    return pedido;
};
