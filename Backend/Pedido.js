class Pedido {
    constructor(numeroDePedido, precioFinal, fechaRealizacion, usuario, productos) {
        this.numeroDePedido = numeroDePedido;
        this.precioFinal = precioFinal;
        this.fechaRealizacion = fechaRealizacion;
        this.usuario = usuario;
        this.productos = productos;
    }
}

export default Pedido;