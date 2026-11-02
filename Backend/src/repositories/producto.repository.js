import Producto from "../models/producto.model.js";

let productos = [
    new Producto(1, "Costillar a lo bestia", 18500, "Costillar de cerdo para compartir", 15),
    new Producto(2, "Matambre a la pizza", 14000, "Con mozzarella, salsa y papas fritas", 20),
    new Producto(3, "Brasas para dos", 26000, "Parrillada surtida para dos personas", 10),
    new Producto(4, "Empanadas de carne (x6)", 7200, "Carne cortada a cuchillo", 40),
    new Producto(5, "Berenjenas al escabeche", 4800, "Entrada de la casa", 25),
    new Producto(6, "Vino Malbec", 9500, "Botella 750 ml", 30)
];
let nextCodigo = 7;

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
