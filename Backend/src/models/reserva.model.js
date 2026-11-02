class Reserva {
    constructor(codigo, codigoUsuario, codigoMesa, fecha, hora, estado) {
        this.codigo = codigo;
        this.codigoUsuario = codigoUsuario;
        this.codigoMesa = codigoMesa;
        this.fecha = fecha;
        this.hora = hora;
        this.estado = estado;
    }
}

export default Reserva;
