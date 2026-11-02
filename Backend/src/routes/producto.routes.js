import { Router } from "express";
import * as productoController from "../controllers/producto.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { Roles } from "../enums/Roles.js";

const router = Router();

// La carta es pública; modificarla es exclusivo del administrador.
router.get("/", productoController.getAll);
router.get("/:id", productoController.getById);
router.post("/", authenticate, authorize(Roles.ADMIN), productoController.create);
router.put("/:id", authenticate, authorize(Roles.ADMIN), productoController.update);
router.delete("/:id", authenticate, authorize(Roles.ADMIN), productoController.remove);

export default router;
