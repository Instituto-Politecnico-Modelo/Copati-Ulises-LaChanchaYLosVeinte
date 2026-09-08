import * as productoService from "../services/producto.service.js";
import { successResponse } from "../responses/response.js";

export const getAll = (req, res, next) => {
    try {
        const productos = productoService.getAll();
        return successResponse(res, productos);
    } catch (err) {
        next(err);
    }
};

export const getById = (req, res, next) => {
    try {
        const producto = productoService.getById(req.params.id);
        return successResponse(res, producto);
    } catch (err) {
        next(err);
    }
};

export const create = (req, res, next) => {
    try {
        const producto = productoService.create(req.body);
        return successResponse(res, producto, 201);
    } catch (err) {
        next(err);
    }
};

export const update = (req, res, next) => {
    try {
        const producto = productoService.update(req.params.id, req.body);
        return successResponse(res, producto);
    } catch (err) {
        next(err);
    }
};

export const remove = (req, res, next) => {
    try {
        productoService.remove(req.params.id);
        return successResponse(res, null);
    } catch (err) {
        next(err);
    }
};
