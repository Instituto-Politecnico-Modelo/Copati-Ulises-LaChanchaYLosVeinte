import Mesa from "../models/mesa.model.js";

let mesas = [
    new Mesa(1, 2, true, true),
    new Mesa(2, 4, true, true),
    new Mesa(3, 4, false, true),
    new Mesa(4, 6, false, true),
    new Mesa(5, 8, true, true),
    new Mesa(6, 10, false, true)
];
let nextCodigo = 7;

export const findAll = () => {
    return mesas;
};

export const findById = (codigo) => {
    return mesas.find((mesa) => mesa.codigo === Number(codigo));
};

export const create = ({ espacio, adentro, disponible }) => {
    const nuevaMesa = new Mesa(nextCodigo++, espacio, adentro, disponible);
    mesas.push(nuevaMesa);
    return nuevaMesa;
};

export const update = (codigo, data) => {
    const mesa = findById(codigo);
    Object.assign(mesa, data);
    return mesa;
};

export const remove = (codigo) => {
    mesas = mesas.filter((mesa) => mesa.codigo !== Number(codigo));
};
