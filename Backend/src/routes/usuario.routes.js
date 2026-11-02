import { Router } from "express";
import * as usuarioController from "../controllers/usuario.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/registro", usuarioController.register);
router.post("/login", usuarioController.login);
router.post("/logout", authenticate, usuarioController.logout);
router.get("/me", authenticate, usuarioController.me);

export default router;
