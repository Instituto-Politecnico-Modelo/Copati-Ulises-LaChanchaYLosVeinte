import Producto from "../models/producto.model.js";

let productos = [];
let nextCodigo = 1;

export const findAll = () => {
    return productos;
};

export const findById = (codigo) => {
    return productos.find((producto) => producto.codigo === Number(codigo));
};

export const create = ({ nombre, precio, descripcion, cantidadDisponible }) => {
    const nuevoProducto = new Producto(nextCodigo++, nombre, precio, descripcion, cantidadDisponible);
    productos.push(nuevoProducto);
    return nuevoProducto;
};

export const update = (codigo, data) => {
    const producto = findById(codigo);
    if (!producto) {
        return null;
    }
    Object.assign(producto, data);
    return producto;
};

export const remove = (codigo) => {
    const index = productos.findIndex((producto) => producto.codigo === Number(codigo));
    if (index === -1) {
        return false;
    }
    productos.splice(index, 1);
    return true;
};
