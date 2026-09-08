CREATE DATABASE restaurante;
USE restaurante;

-- =========================================
-- TABLA PRODUCTO
-- =========================================

CREATE TABLE Producto (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    precio INT NOT NULL,
    descripcion VARCHAR(50),
    cantidadDisponible INT NOT NULL
);


-- =========================================
-- TABLA REPARTIDOR
-- =========================================

CREATE TABLE Repartidor (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono INT NOT NULL,
    patente VARCHAR(50) NOT NULL
);


-- =========================================
-- TABLA USUARIO
-- =========================================

CREATE TABLE Usuario (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL UNIQUE,
    contrasenia VARCHAR(50) NOT NULL,
    telefono INT NOT NULL
);


-- =========================================
-- TABLA MESA
-- =========================================

CREATE TABLE Mesa (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    espacio INT NOT NULL,
    adentro BOOLEAN NOT NULL
);


-- =========================================
-- TABLA PEDIDO
-- =========================================

CREATE TABLE Pedido (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    precioFinal INT NOT NULL,
    fechaRealizacion DATETIME NOT NULL,
    codigoRepartidor INT NOT NULL,
    codigoUsuario INT NOT NULL,

    CONSTRAINT fk_pedido_repartidor
        FOREIGN KEY (codigoRepartidor)
        REFERENCES Repartidor(codigo),

    CONSTRAINT fk_pedido_usuario
        FOREIGN KEY (codigoUsuario)
        REFERENCES Usuario(codigo)
);


-- =========================================
-- TABLA PEDIDO_PRODUCTO
-- =========================================

CREATE TABLE Pedido_Producto (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    codigoProducto INT NOT NULL,
    codigoPedido INT NOT NULL,

    CONSTRAINT fk_pedido_producto_producto
        FOREIGN KEY (codigoProducto)
        REFERENCES Producto(codigo),

    CONSTRAINT fk_pedido_producto_pedido
        FOREIGN KEY (codigoPedido)
        REFERENCES Pedido(codigo)
);


-- =========================================
-- TABLA RESERVACION
-- =========================================

CREATE TABLE Reserva (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    codigoUsuario INT NOT NULL,
    codigoMesa INT NOT NULL,
    fechaReserva DATE NOT NULL,
    hora TIME NOT NULL,

    CONSTRAINT fk_reserva_usuario
        FOREIGN KEY (codigoUsuario)
        REFERENCES Usuario(codigo),

    CONSTRAINT fk_reserva_mesa
        FOREIGN KEY (codigoMesa)
        REFERENCES Mesa(codigo)
);