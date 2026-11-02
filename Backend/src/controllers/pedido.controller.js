import * as pedidoService from "../services/pedido.service.js";
import { handle } from "../utils/handler.js";

export const getAll = handle((req) => pedidoService.getAll(req.user));

export const create = handle((req) => pedidoService.create(req.user, req.body), 201);

export const updateEstado = handle((req) => pedidoService.updateEstado(req.params.id, req.body));

export const cancel = handle((req) => pedidoService.cancel(req.user, req.params.id));
