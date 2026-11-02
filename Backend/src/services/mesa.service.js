import * as mesaRepository from "../repositories/mesa.repository.js";
import * as reservaRepository from "../repositories/reserva.repository.js";
import { NotFoundError, BadRequestError, ConflictError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { HORARIOS } from "../enums/Estados.js";
import { isPositiveInt, isValidDate, toDateTime } from "../utils/validators.js";

export const getAll = () => {
    return mesaRepository.findAll();
};

export const getById = (codigo) => {
    const mesa = mesaRepository.findById(codigo);
    if (!mesa) {
        throw new NotFoundError(Messages.MESA_NOT_FOUND);
    }
    return mesa;
};

const validate = ({ espacio, adentro, disponible }) => {
    if (!isPositiveInt(espacio) || typeof adentro !== "boolean") {
        throw new BadRequestError(Messages.INVALID_MESA);
    }
    if (disponible !== undefined && typeof disponible !== "boolean") {
        throw new BadRequestError(Messages.INVALID_MESA);
    }
};

export const create = (data = {}) => {
    validate(data);
    return mesaRepository.create({
        espacio: data.espacio,
        adentro: data.adentro,
        disponible: data.disponible ?? true
    });
};

export const update = (codigo, data = {}) => {
    const mesa = getById(codigo);
    const merged = { ...mesa, ...data };
    validate(merged);
    return mesaRepository.update(codigo, {
        espacio: merged.espacio,
        adentro: merged.adentro,
        disponible: merged.disponible
    });
};

export const remove = (codigo) => {
    getById(codigo);
    if (reservaRepository.findActiveByMesa(codigo).length > 0) {
        throw new ConflictError(Messages.MESA_WITH_RESERVAS);
    }
    mesaRepository.remove(codigo);
    return null;
};

// Devuelve todos los horarios con su estado para una mesa y fecha determinadas.
export const getHorarios = (codigo, fecha) => {
    const mesa = getById(codigo);
    if (!isValidDate(fecha)) {
        throw new BadRequestError(Messages.INVALID_DATE);
    }
    const ocupados = reservaRepository
        .findActiveByMesa(mesa.codigo)
        .filter((reserva) => reserva.fecha === fecha)
        .map((reserva) => reserva.hora);
    const ahora = new Date();

    return HORARIOS.map((hora) => ({
        hora,
        disponible: mesa.disponible && !ocupados.includes(hora) && toDateTime(fecha, hora) > ahora
    }));
};
