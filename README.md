# Copati-Ulises-LaChanchaYLosVeinte

## Cómo ejecutar el sistema

1. **Backend** (puerto 3000): `cd Backend && npm install && npm start`
2. **Frontend** (puerto 5173): `cd Frontend && npm install && npm run dev` y abrir http://localhost:5173
3. Prueba rápida del backend (con el servidor levantado): `cd Backend && node smoke-test.mjs`

### Cuentas de prueba
| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@chancha.com | admin123 |
| Recepcionista | recepcion@chancha.com | recep123 |
| Usuario | se crea desde "Ingresar > Registrate" | mínimo 6 caracteres |

### Funcionalidades
- Registro e inicio de sesión (token Bearer, roles administrador / recepcionista / usuario).
- Carta de productos (pública). El administrador hace el ABM de productos.
- Pedidos: carrito, confirmación con control y descuento de stock, historial, cancelación (devuelve stock) y avance de estado por el personal.
- Mesas: ABM para administrador y recepcionista.
- Reservas: consulta de horarios libres por mesa y fecha, reserva, listado y cancelación.

### Reglas de negocio (validadas en el backend)
- Email con formato válido y no repetido; contraseña de al menos 6 caracteres.
- No se puede pedir ni reservar sin sesión iniciada.
- Un pedido debe tener al menos 1 producto y no puede superar el stock.
- No se cancelan pedidos entregados ni de otros usuarios.
- Los estados del pedido avanzan en orden: Pendiente de pago → Pagado → En preparacion → En reparto → Entregado (Cancelado aparte).
- La mesa debe estar disponible; no se puede reservar un horario ocupado ni en el pasado.
- No se cancelan reservas ya iniciadas ni de otros usuarios.
- Los datos viven en memoria: se reinician al reiniciar el backend.
