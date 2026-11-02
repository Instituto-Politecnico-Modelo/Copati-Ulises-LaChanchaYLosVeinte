export const Messages = Object.freeze({
    PRODUCTO_NOT_FOUND: "El producto no existe.",
    MESA_NOT_FOUND: "La mesa no existe.",
    RESERVA_NOT_FOUND: "La reserva no existe.",
    PEDIDO_NOT_FOUND: "El pedido no existe.",
    USUARIO_NOT_FOUND: "El usuario no existe.",
    INVALID_DATA: "Los datos enviados son inválidos.",
    DUPLICATED_RESOURCE: "El recurso ya existe.",
    INTERNAL_ERROR: "Error interno del servidor.",

    // Autenticación y permisos
    UNAUTHENTICATED: "Debés iniciar sesión para realizar esta operación.",
    INVALID_CREDENTIALS: "Email o contraseña incorrectos.",
    FORBIDDEN: "No tenés permisos para realizar esta operación.",

    // Usuarios
    INVALID_EMAIL: "El formato del email no es válido.",
    INVALID_PASSWORD: "La contraseña debe tener al menos 6 caracteres.",
    INVALID_PHONE: "El teléfono debe tener entre 6 y 15 dígitos.",
    EMAIL_REGISTERED: "Ya existe una cuenta registrada con ese email.",

    // Productos
    INVALID_PRODUCT: "Nombre, precio (mayor a 0) y cantidad (entero >= 0) son obligatorios.",

    // Mesas
    INVALID_MESA: "El espacio debe ser un entero mayor a 0 y 'adentro' un booleano.",
    MESA_WITH_RESERVAS: "No se puede eliminar una mesa con reservas activas.",
    MESA_NOT_AVAILABLE: "La mesa no está disponible para ser reservada.",

    // Reservas
    INVALID_DATE: "La fecha debe tener formato AAAA-MM-DD.",
    INVALID_TIME: "El horario seleccionado no es válido.",
    PAST_RESERVATION: "No se puede reservar en una fecha y hora pasada.",
    SLOT_TAKEN: "La mesa ya está reservada en ese día y horario.",
    RESERVA_ALREADY_CANCELLED: "La reserva ya fue cancelada.",
    RESERVA_STARTED: "No se puede cancelar una reserva que ya comenzó.",

    // Pedidos
    EMPTY_ORDER: "El pedido debe tener al menos un producto.",
    INVALID_ORDER_ITEM: "Cada producto debe tener un código y una cantidad entera mayor a 0.",
    INVALID_STATE: "El estado indicado no es válido para este pedido.",
    PEDIDO_DELIVERED: "No se puede cancelar un pedido ya entregado.",
    PEDIDO_ALREADY_CANCELLED: "El pedido ya fue cancelado."
});
