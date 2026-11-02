class Pedido {
    constructor(codigo, codigoUsuario, items, precioFinal, fechaRealizacion, estado) {
        this.codigo = codigo;
        this.codigoUsuario = codigoUsuario;
        this.items = items;
        this.precioFinal = precioFinal;
        this.fechaRealizacion = fechaRealizacion;
        this.estado = estado;
    }
}

export default Pedido;
