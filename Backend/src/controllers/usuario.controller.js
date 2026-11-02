import * as usuarioService from "../services/usuario.service.js";
import { handle } from "../utils/handler.js";

export const register = handle((req) => usuarioService.register(req.body), 201);

export const login = handle((req) => usuarioService.login(req.body));

export const logout = handle((req) => usuarioService.logout(req.token));

export const me = handle((req) => usuarioService.toPublic(req.user));
