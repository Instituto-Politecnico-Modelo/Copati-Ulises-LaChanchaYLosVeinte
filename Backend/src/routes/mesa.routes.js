import { Router } from "express";
import * as mesaController from "../controllers/mesa.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { STAFF_ROLES } from "../enums/Roles.js";

const router = Router();

router.get("/", authenticate, mesaController.getAll);
router.get("/:id", authenticate, mesaController.getById);
router.get("/:id/horarios", authenticate, mesaController.getHorarios);
router.post("/", authenticate, authorize(...STAFF_ROLES), mesaController.create);
router.put("/:id", authenticate, authorize(...STAFF_ROLES), mesaController.update);
router.delete("/:id", authenticate, authorize(...STAFF_ROLES), mesaController.remove);

export default router;
