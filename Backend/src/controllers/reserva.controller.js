import * as reservaService from "../services/reserva.service.js";
import { handle } from "../utils/handler.js";

export const getAll = handle((req) => reservaService.getAll(req.user));

export const create = handle((req) => reservaService.create(req.user, req.body), 201);

export const cancel = handle((req) => reservaService.cancel(req.user, req.params.id));
