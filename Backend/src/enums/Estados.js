export const EstadoReserva = Object.freeze({
    RESERVADA: "Reservada",
    CANCELADA: "Cancelada"
});

export const EstadoPedido = Object.freeze({
    PENDIENTE: "Pendiente de pago",
    PAGADO: "Pagado",
    EN_PREPARACION: "En preparacion",
    EN_REPARTO: "En reparto",
    ENTREGADO: "Entregado",
    CANCELADO: "Cancelado"
});

// Orden en el que un pedido puede avanzar (el cancelado queda afuera del flujo).
export const FLUJO_PEDIDO = [
    EstadoPedido.PENDIENTE,
    EstadoPedido.PAGADO,
    EstadoPedido.EN_PREPARACION,
    EstadoPedido.EN_REPARTO,
    EstadoPedido.ENTREGADO
];

export const HORARIOS = [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"
];
