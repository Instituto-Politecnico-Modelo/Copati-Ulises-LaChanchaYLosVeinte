import * as reservaRepository from "../repositories/reserva.repository.js";
import * as mesaService from "./mesa.service.js";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { EstadoReserva, HORARIOS } from "../enums/Estados.js";
import { STAFF_ROLES } from "../enums/Roles.js";
import { isPositiveInt, isValidDate, toDateTime } from "../utils/validators.js";

// Un usuario ve sus reservas; el personal ve todas.
export const getAll = (user) => {
    return STAFF_ROLES.includes(user.rol)
        ? reservaRepository.findAll()
        : reservaRepository.findByUsuario(user.codigo);
};

export const create = (user, { codigoMesa, fecha, hora } = {}) => {
    if (!isPositiveInt(codigoMesa)) {
        throw new BadRequestError(Messages.INVALID_DATA);
    }
    if (!isValidDate(fecha)) {
        throw new BadRequestError(Messages.INVALID_DATE);
    }
    if (!HORARIOS.includes(hora)) {
        throw new BadRequestError(Messages.INVALID_TIME);
    }

    const mesa = mesaService.getById(codigoMesa);
    if (!mesa.disponible) {
        throw new ConflictError(Messages.MESA_NOT_AVAILABLE);
    }
    if (toDateTime(fecha, hora) <= new Date()) {
        throw new BadRequestError(Messages.PAST_RESERVATION);
    }

    const duplicada = reservaRepository
        .findActiveByMesa(mesa.codigo)
        .some((reserva) => reserva.fecha === fecha && reserva.hora === hora);
    if (duplicada) {
        throw new ConflictError(Messages.SLOT_TAKEN);
    }

    return reservaRepository.create({
        codigoUsuario: user.codigo,
        codigoMesa: mesa.codigo,
        fecha,
        hora
    });
};

export const cancel = (user, codigo) => {
    const reserva = reservaRepository.findById(codigo);
    if (!reserva) {
        throw new NotFoundError(Messages.RESERVA_NOT_FOUND);
    }
    if (reserva.codigoUsuario !== user.codigo) {
        throw new ForbiddenError(Messages.FORBIDDEN);
    }
    if (reserva.estado === EstadoReserva.CANCELADA) {
        throw new ConflictError(Messages.RESERVA_ALREADY_CANCELLED);
    }
    if (toDateTime(reserva.fecha, reserva.hora) <= new Date()) {
        throw new BadRequestError(Messages.RESERVA_STARTED);
    }
    return reservaRepository.update(codigo, { estado: EstadoReserva.CANCELADA });
};
