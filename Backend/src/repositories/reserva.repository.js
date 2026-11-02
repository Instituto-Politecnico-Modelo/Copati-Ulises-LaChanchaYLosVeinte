import Reserva from "../models/reserva.model.js";
import { EstadoReserva } from "../enums/Estados.js";

const reservas = [];
let nextCodigo = 1;

export const findAll = () => {
    return reservas;
};

export const findById = (codigo) => {
    return reservas.find((reserva) => reserva.codigo === Number(codigo));
};

export const findByUsuario = (codigoUsuario) => {
    return reservas.filter((reserva) => reserva.codigoUsuario === codigoUsuario);
};

export const findActiveByMesa = (codigoMesa) => {
    return reservas.filter(
        (reserva) => reserva.codigoMesa === Number(codigoMesa) && reserva.estado === EstadoReserva.RESERVADA
    );
};

export const create = ({ codigoUsuario, codigoMesa, fecha, hora }) => {
    const nueva = new Reserva(nextCodigo++, codigoUsuario, codigoMesa, fecha, hora, EstadoReserva.RESERVADA);
    reservas.push(nueva);
    return nueva;
};

export const update = (codigo, data) => {
    const reserva = findById(codigo);
    Object.assign(reserva, data);
    return reserva;
};
