import * as mesaService from "../services/mesa.service.js";
import { handle } from "../utils/handler.js";

export const getAll = handle(() => mesaService.getAll());

export const getById = handle((req) => mesaService.getById(req.params.id));

export const getHorarios = handle((req) => mesaService.getHorarios(req.params.id, req.query.fecha));

export const create = handle((req) => mesaService.create(req.body), 201);

export const update = handle((req) => mesaService.update(req.params.id, req.body));

export const remove = handle((req) => mesaService.remove(req.params.id));
