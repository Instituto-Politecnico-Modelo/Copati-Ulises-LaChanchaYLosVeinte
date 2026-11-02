import { Router } from "express";
import * as pedidoController from "../controllers/pedido.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { STAFF_ROLES } from "../enums/Roles.js";

const router = Router();

router.get("/", authenticate, pedidoController.getAll);
router.post("/", authenticate, pedidoController.create);
router.patch("/:id/estado", authenticate, authorize(...STAFF_ROLES), pedidoController.updateEstado);
router.delete("/:id", authenticate, pedidoController.cancel);

export default router;
