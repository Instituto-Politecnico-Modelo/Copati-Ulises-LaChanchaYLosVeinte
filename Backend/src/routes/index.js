import { Router } from "express";
import productoRoutes from "./producto.routes.js";
import usuarioRoutes from "./usuario.routes.js";
import mesaRoutes from "./mesa.routes.js";
import reservaRoutes from "./reserva.routes.js";
import pedidoRoutes from "./pedido.routes.js";

const router = Router();

router.use("/productos", productoRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/mesas", mesaRoutes);
router.use("/reservas", reservaRoutes);
router.use("/pedidos", pedidoRoutes);

export default router;
