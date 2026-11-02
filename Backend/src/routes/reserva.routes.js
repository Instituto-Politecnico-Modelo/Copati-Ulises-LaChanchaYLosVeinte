import { Router } from "express";
import * as reservaController from "../controllers/reserva.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticate, reservaController.getAll);
router.post("/", authenticate, reservaController.create);
router.delete("/:id", authenticate, reservaController.cancel);

export default router;
